

const STORAGE_KEY = 'iconfont_history';
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export interface HistoryItem {
  id: string;
  fileName: string;
  timestamp: number;
  fileData: string; // Base64
}

export const saveToHistory = async (file: File): Promise<void> => {
  if (file.size > MAX_SIZE_BYTES) {
    console.warn('File too large for local storage history');
    return;
  }

  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const base64 = reader.result as string;
        const item: HistoryItem = {
          id: hashHex,
          fileName: file.name,
          timestamp: Date.now(),
          fileData: base64
        };

        const existing = getHistory();
        // Remove existing item with same hash if present to update timestamp/filename
        const filtered = existing.filter(i => i.id !== hashHex);
        
        // Keep only last 5 items
        const newHistory = [item, ...filtered].slice(0, 5);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        resolve();
      } catch (err) {
        console.error('Failed to save to history', err);
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Failed to load history', err);
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
