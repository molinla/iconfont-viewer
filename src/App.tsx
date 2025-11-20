import { useState, useEffect, useCallback } from 'react';
import { Dropzone } from './components/Dropzone';
import { IconGrid } from './components/IconGrid';
import { parseFontFile, type ParsedFont } from './utils/fontParser';
import { saveToHistory, getHistory, type HistoryItem, clearHistory } from './utils/storage';
import { Trash2, Type, FileType } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [fonts, setFonts] = useState<ParsedFont[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHistoryItems(getHistory());
  }, [fonts]); // Update history when fonts change (added)

  const handleFilesDrop = useCallback(async (files: File[]) => {
    setLoading(true);
    setError(null);
    try {
      const parsed = await Promise.all(files.map(f => parseFontFile(f)));
      setFonts(prev => [...prev, ...parsed]);

      // Save to history
      for (const file of files) {
        await saveToHistory(file);
      }
      // Refresh history items
      setHistoryItems(getHistory());
    } catch (err) {
      console.error(err);
      setError('Failed to parse font file. Please ensure it is a valid font format.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFromHistory = async (item: HistoryItem) => {
    setLoading(true);
    setError(null);
    try {
      // Convert base64 back to file/buffer
      const res = await fetch(item.fileData);
      const blob = await res.blob();
      const file = new File([blob], item.fileName);
      const parsed = await parseFontFile(file);
      setFonts([parsed]);
    } catch (err) {
      console.error(err);
      setError('Failed to load from history.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      setHistoryItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="w-full p-6 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Type size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Iconfont Viewer
          </h1>
        </div>
        <div className="flex gap-4">
          {fonts.length > 0 && (
            <button
              onClick={() => setFonts([])}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-8 overflow-y-auto pb-40">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {fonts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Preview your icons instantly
              </h2>
              <p className="text-slate-500 text-lg max-w-md mx-auto">
                Drag and drop your TTF, WOFF, or SVG font files to view all glyphs and copy their codes.
              </p>
            </div>
            <Dropzone onFilesDrop={handleFilesDrop} />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-12">
            {fonts.map((font, i) => (
              <IconGrid key={`${font.fileName}-${i}`} glyphs={font.glyphs} fontFamily={font.fontFamily} />
            ))}

            <div className="w-full max-w-2xl mt-12">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-slate-200"></div>
                <span className="text-slate-400 text-sm">Add more files</span>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>
              <Dropzone onFilesDrop={handleFilesDrop} />
            </div>
          </div>
        )}
      </main>

      {/* History Bar - Bottom Center */}
      {historyItems.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl p-2 flex items-center gap-2">
            <div className="flex-1 flex gap-2 overflow-x-auto p-2 scrollbar-hide mask-linear-fade">
              {historyItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all group min-w-[160px] max-w-[200px] flex-shrink-0 text-left"
                  title={item.fileName}
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                    <FileType size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-700 group-hover:text-blue-700 truncate text-sm">
                      {item.fileName}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="h-12 w-px bg-slate-200 mx-2" />

            <button
              onClick={handleClearHistory}
              className="p-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              title="Clear History"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default App;
