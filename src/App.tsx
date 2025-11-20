import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog } from './components/Dialog';
import { History } from './components/History';
import { Hero } from './components/Hero';
import { Header, type HeaderRef } from './components/Header';
import { FontsContent, type FontsContentRef } from './components/FontsContent';
import { parseFontFile, type ParsedFont } from './utils/fontParser';
import { saveToHistory, getHistory, type HistoryItem, clearHistory } from './utils/storage';

// Helper function to calculate file hash
const calculateFileHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

function App() {
  const [fonts, setFonts] = useState<ParsedFont[]>([]);
  const [loadedFontHashes, setLoadedFontHashes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const fontGridRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const headerRef = useRef<HeaderRef>(null);
  const fontsContentRef = useRef<FontsContentRef>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  useEffect(() => {
    setHistoryItems(getHistory());
  }, [fonts]);

  const handleFilesDrop = useCallback(async (files: File[]) => {
    setLoading(true);
    setError(null);
    try {
      const filesToAdd: File[] = [];
      const duplicates: string[] = [];
      const newHashes = new Set(loadedFontHashes);

      for (const file of files) {
        const hash = await calculateFileHash(file);

        if (loadedFontHashes.has(hash)) {
          duplicates.push(file.name);

          const historyItem = historyItems.find(h => h.id === hash);
          if (historyItem) {
            setHighlightedItemId(historyItem.id);
            setTimeout(() => {
              fontsContentRef.current?.scrollToFont(hash);
            }, 100);
          }
        } else {
          filesToAdd.push(file);
          newHashes.add(hash);
        }
      }

      if (duplicates.length > 0) {
        const msg = duplicates.length === 1
          ? `'${duplicates[0]}' is already loaded`
          : `${duplicates.length} files are already loaded: ${duplicates.join(', ')}`;
        headerRef.current?.triggerDuplicateMessage(msg);
        setTimeout(() => {
          setHighlightedItemId(null);
        }, 3000);
      }

      if (filesToAdd.length > 0) {
        const parsedWithHashes = await Promise.all(
          filesToAdd.map(async (f) => {
            const parsed = await parseFontFile(f);
            const hash = await calculateFileHash(f);
            return { ...parsed, hash };
          })
        );
        setFonts(prev => [...prev, ...parsedWithHashes]);
        setLoadedFontHashes(newHashes);

        for (const file of filesToAdd) {
          await saveToHistory(file);
        }
        setHistoryItems(getHistory());
      }
    } catch (err) {
      console.error(err);
      setError('Failed to parse font file. Please ensure it is a valid font format.');
    } finally {
      setLoading(false);
    }
  }, [loadedFontHashes, historyItems]);

  const loadFromHistory = async (item: HistoryItem) => {
    setLoading(true);
    setError(null);
    try {
      const isLoaded = loadedFontHashes.has(item.id);

      if (isLoaded) {
        setFonts(prev => prev.filter(f => f.fileName !== item.fileName));
        setLoadedFontHashes(prev => {
          const updated = new Set(prev);
          updated.delete(item.id);
          return updated;
        });
      } else {
        const res = await fetch(item.fileData);
        const blob = await res.blob();
        const file = new File([blob], item.fileName);
        const parsed = await parseFontFile(file);
        const parsedWithHash = { ...parsed, hash: item.id };
        setFonts(prev => [...prev, parsedWithHash]);
        setLoadedFontHashes(prev => new Set(prev).add(item.id));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load from history.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Clear History',
      message: 'Are you sure you want to clear all history? This action cannot be undone.',
      confirmText: 'CLEAR HISTORY',
      onConfirm: () => {
        clearHistory();
        setHistoryItems([]);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteFont = (hash: string) => {
    const fontToDelete = fonts.find(f => f.hash === hash);
    if (!fontToDelete) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Delete Font',
      message: `Are you sure you want to remove '${fontToDelete.fontFamily}' from workspace?`,
      confirmText: 'DELETE',
      onConfirm: () => {
        setFonts(prev => prev.filter(f => f.hash !== hash));
        setLoadedFontHashes(prev => {
          const updated = new Set(prev);
          updated.delete(hash);
          return updated;
        });
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="flex h-screen w-screen bg-[#fafaf9] text-[#292524] overflow-hidden font-sans selection:bg-orange-200 selection:text-orange-900">
      <History
        historyItems={historyItems}
        loadedFontHashes={loadedFontHashes}
        highlightedItemId={highlightedItemId}
        onLoadFromHistory={loadFromHistory}
        onClearHistory={handleClearHistory}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-[#f5f5f4]">
        <Header
          ref={headerRef}
          fontsCount={fonts.length}
          loading={loading}
          globalSearchTerm={globalSearchTerm}
          onGlobalSearchChange={setGlobalSearchTerm}
          onClearWorkspace={() => {
            setFonts([]);
            setLoadedFontHashes(new Set());
            setGlobalSearchTerm('');
          }}
        />
        {fonts.length === 0 ? (
          <Hero onFilesDrop={handleFilesDrop} />
        ) : (
          <FontsContent
            ref={fontsContentRef}
            error={error}
            fonts={fonts}
            globalSearchTerm={globalSearchTerm}
            fontGridRefs={fontGridRefs}
            onFilesDrop={handleFilesDrop}
            onDeleteFont={handleDeleteFont}
          />
        )}
      </div>

      <Dialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        variant="danger"
        confirmText={confirmDialog.confirmText || 'CONFIRM'}
      />
    </div>
  );
}

export default App;
