import { useState, useEffect, useCallback } from 'react';
import { Dropzone } from './components/Dropzone';
import { IconGrid } from './components/IconGrid';
import { Dialog } from './components/Dialog';
import { parseFontFile, type ParsedFont } from './utils/fontParser';
import { saveToHistory, getHistory, type HistoryItem, clearHistory } from './utils/storage';
import { Trash2, Type, FileType } from 'lucide-react';
import clsx from 'clsx';


function App() {
  const [fonts, setFonts] = useState<ParsedFont[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
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
      // Check if already loaded
      const isLoaded = fonts.some(f => f.fileName === item.fileName);

      if (isLoaded) {
        // Remove if already loaded
        setFonts(prev => prev.filter(f => f.fileName !== item.fileName));
      } else {
        // Add if not loaded
        // Convert base64 back to file/buffer
        const res = await fetch(item.fileData);
        const blob = await res.blob();
        const file = new File([blob], item.fileName);
        const parsed = await parseFontFile(file);
        setFonts(prev => [...prev, parsed]);
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
      onConfirm: () => {
        clearHistory();
        setHistoryItems([]);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="flex h-screen w-screen bg-[#fafaf9] text-[#292524] overflow-hidden font-sans selection:bg-orange-200 selection:text-orange-900">
      {/* Sidebar */}
      <aside className="w-80 bg-[#fafaf9] border-r-2 border-[#a8a29e] flex flex-col flex-shrink-0 z-20">
        {/* Sidebar Header */}
        <div className="p-6 border-b-2 border-[#a8a29e]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <Type size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-[#292524]">
              Iconfont<br />Viewer
            </h1>
          </div>
        </div>

        {/* Sidebar Content - History */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xs font-bold text-[#78716c] uppercase tracking-widest">History</h2>
            {historyItems.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-none hover:bg-red-100 text-[#78716c] hover:text-red-600 transition-colors border border-transparent hover:border-red-600"
                title="Clear History"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="space-y-2">
            {historyItems.length === 0 ? (
              <div className="text-center py-8 text-[#a8a29e] text-sm font-mono">
                NO_HISTORY_FOUND
              </div>
            ) : (
              historyItems.map((item) => {
                const isSelected = fonts.some(f => f.fileName === item.fileName);
                return (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className={clsx(
                      "w-full flex items-center gap-3 px-3 py-3 border-2 transition-all group text-left relative",
                      isSelected
                        ? "bg-orange-50 border-orange-600 shadow-[2px_2px_0px_0px_#ea580c]"
                        : "bg-white border-[#d6d3d1] hover:border-[#78716c] hover:shadow-[2px_2px_0px_0px_#78716c]"
                    )}
                    title={item.fileName}
                  >
                    <div className={clsx(
                      "p-2 border transition-colors flex-shrink-0",
                      isSelected ? "bg-orange-100 border-orange-200 text-orange-700" : "bg-[#f5f5f4] border-[#e7e5e4] text-[#a8a29e] group-hover:text-[#78716c]"
                    )}>
                      <FileType size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={clsx(
                        "font-bold truncate text-sm transition-colors font-mono",
                        isSelected ? "text-orange-900" : "text-[#57534e] group-hover:text-[#292524]"
                      )}>
                        {item.fileName}
                      </div>
                      <div className="text-[10px] text-[#a8a29e] truncate font-mono">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f5f5f4]">
        {/* Top Bar */}
        <header className="h-16 px-8 border-b-2 border-[#a8a29e] bg-[#fafaf9] flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-2 text-[#78716c] text-sm font-mono font-bold">
            {fonts.length > 0 ? (
              <span>LOADED: {fonts.length} FONT{fonts.length !== 1 ? 'S' : ''}</span>
            ) : (
              <span>WAITING_FOR_INPUT...</span>
            )}
          </div>
          <div className="flex gap-4">
            {fonts.length > 0 && (
              <button
                onClick={() => setFonts([])}
                className="px-4 py-2 bg-white border-2 border-[#d6d3d1] hover:border-[#78716c] hover:shadow-[2px_2px_0px_0px_#78716c] text-[#57534e] text-sm font-bold transition-all active:translate-y-[1px] active:shadow-none"
              >
                CLEAR_WORKSPACE
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            {error && (
              <div className="w-full mb-8 p-4 bg-red-50 border-2 border-red-500 text-red-700 text-sm flex items-center gap-2 font-bold shadow-[4px_4px_0px_0px_#ef4444]">
                <div className="w-2 h-2 bg-red-600" />
                ERROR: {error}
              </div>
            )}

            {fonts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500 mt-10">

                {/* Hero Graphic */}
                <div className="relative w-full max-w-lg aspect-square mb-12 flex items-center justify-center">
                  {/* Decorative Circles/Shapes */}
                  <div className="absolute inset-0 border-2 border-[#e7e5e4] rounded-full animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-12 border-2 border-dashed border-[#d6d3d1] rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                  {/* Central Composition */}
                  <div className="relative z-10 grid grid-cols-2 gap-4 p-8 bg-[#fafaf9] border-4 border-[#292524] shadow-[8px_8px_0px_0px_#ea580c]">
                    <div className="w-24 h-24 bg-[#292524] text-white flex items-center justify-center">
                      <Type size={48} strokeWidth={2.5} />
                    </div>
                    <div className="w-24 h-24 border-4 border-[#292524] flex items-center justify-center">
                      <div className="text-4xl font-black">Aa</div>
                    </div>
                    <div className="w-24 h-24 border-4 border-[#ea580c] bg-[#ea580c] text-white flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    </div>
                    <div className="w-24 h-24 bg-[#e7e5e4] flex items-center justify-center text-[#292524]">
                      <FileType size={48} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-white border-2 border-[#292524] px-4 py-2 font-mono text-xs font-bold shadow-[4px_4px_0px_0px_#292524] rotate-3">
                    .TTF
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white border-2 border-[#292524] px-4 py-2 font-mono text-xs font-bold shadow-[4px_4px_0px_0px_#292524] -rotate-3">
                    .WOFF
                  </div>
                </div>

                <div className="text-center mb-12">
                  <h2 className="text-5xl font-black text-[#292524] mb-6 tracking-tighter uppercase">
                    Font<span className="text-[#ea580c]">Viewer</span>
                  </h2>
                  <p className="text-[#78716c] text-lg max-w-md mx-auto font-medium">
                    Drag & drop your font files anywhere to inspect.
                    <br />
                    <span className="text-sm font-mono mt-2 block text-[#a8a29e]">SUPPORTED: TTF, WOFF, SVG, OTF</span>
                  </p>
                </div>

                {/* Invisible Dropzone Overlay or Button */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-none blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <button
                    onClick={() => document.getElementById('hidden-dropzone-input')?.click()}
                    className="relative px-8 py-4 bg-[#292524] text-white font-bold uppercase tracking-widest border-2 border-transparent hover:bg-orange-600 transition-colors shadow-[4px_4px_0px_0px_#a8a29e] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#a8a29e]"
                  >
                    Select Files
                  </button>
                </div>

                {/* Hidden Dropzone for functionality */}
                <div className="hidden">
                  <Dropzone onFilesDrop={handleFilesDrop} />
                </div>
                <input
                  type="file"
                  id="hidden-dropzone-input"
                  className="hidden"
                  multiple
                  accept=".ttf,.woff,.woff2,.otf,.svg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFilesDrop(Array.from(e.target.files));
                    }
                  }}
                />

              </div>
            ) : (
              <div className="w-full flex flex-col items-center gap-12 pb-20">
                {fonts.map((font, i) => (
                  <IconGrid key={`${font.fileName}-${i}`} glyphs={font.glyphs} fontFamily={font.fontFamily} />
                ))}

                <div className="w-full max-w-2xl mt-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-0.5 flex-1 bg-[#d6d3d1]"></div>
                    <span className="text-[#a8a29e] text-sm font-bold uppercase tracking-widest">Add more files</span>
                    <div className="h-0.5 flex-1 bg-[#d6d3d1]"></div>
                  </div>
                  <Dropzone onFilesDrop={handleFilesDrop} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-[#fafaf9]/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#e7e5e4] border-t-[#ea580c] rounded-full animate-spin"></div>
            <div className="font-mono font-bold text-[#ea580c] animate-pulse">PROCESSING...</div>
          </div>
        </div>
      )}

      <Dialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        variant="danger"
        confirmText="CLEAR HISTORY"
      />
    </div>
  );
}

export default App;
