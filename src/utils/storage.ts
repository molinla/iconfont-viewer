

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

  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      try {
        const base64 = reader.result as string;
        const item: HistoryItem = {
          id: crypto.randomUUID(),
          fileName: file.name,
          timestamp: Date.now(),
          fileData: base64
        };

        const existing = getHistory();
        // Keep only last 5 items to avoid quota limits
        const newHistory = [item, ...existing].slice(0, 5);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        resolve();
      } catch (err) {
        console.error('Failed to save to history', err);
        // Likely quota exceeded
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
