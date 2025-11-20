import { useRef } from 'react';
import { Trash2, FileType } from 'lucide-react';
import clsx from 'clsx';
import type { HistoryItem } from '../utils/storage';

interface HistoryProps {
    historyItems: HistoryItem[];
    loadedFontHashes: Set<string>;
    highlightedItemId: string | null;
    onLoadFromHistory: (item: HistoryItem) => void;
    onClearHistory: () => void;
}

export function History({
    historyItems,
    loadedFontHashes,
    highlightedItemId,
    onLoadFromHistory,
    onClearHistory,
}: HistoryProps) {
    const historyRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    return (
        <aside className="w-80 bg-[#fafaf9] border-r-2 border-[#a8a29e] flex flex-col flex-shrink-0 z-20">
            <div className="p-6 border-b-2 border-[#a8a29e]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-600 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                        >
                            <polyline points="4 7 4 4 20 4 20 7"></polyline>
                            <line x1="9" y1="20" x2="15" y2="20"></line>
                            <line x1="12" y1="4" x2="12" y2="20"></line>
                        </svg>
                    </div>
                    <h1 className="text-xl font-black uppercase tracking-tighter text-[#292524]">
                        Iconfont<br />Viewer
                    </h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xs font-bold text-[#78716c] uppercase tracking-widest">History</h2>
                    {historyItems.length > 0 && (
                        <button
                            onClick={onClearHistory}
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
                            const isSelected = loadedFontHashes.has(item.id);
                            const isHighlighted = highlightedItemId === item.id;
                            return (
                                <button
                                    key={item.id}
                                    ref={(el) => {
                                        if (el) historyRefs.current.set(item.id, el);
                                        else historyRefs.current.delete(item.id);
                                    }}
                                    onClick={() => onLoadFromHistory(item)}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-3 py-3 border-2 transition-all group text-left relative",
                                        isHighlighted && "animate-pulse",
                                        isSelected
                                            ? "bg-orange-50 border-orange-600 shadow-[2px_2px_0px_0px_#ea580c]"
                                            : isHighlighted
                                                ? "bg-orange-50 border-orange-600 shadow-[4px_4px_0px_0px_#ea580c] scale-[1.02]"
                                                : "bg-white border-[#d6d3d1] hover:border-[#78716c] hover:shadow-[2px_2px_0px_0px_#78716c]"
                                    )}
                                    title={item.fileName}
                                >
                                    <div className={clsx(
                                        "p-2 border transition-colors flex-shrink-0",
                                        isSelected || isHighlighted ? "bg-orange-100 border-orange-200 text-orange-700" : "bg-[#f5f5f4] border-[#e7e5e4] text-[#a8a29e] group-hover:text-[#78716c]"
                                    )}>
                                        <FileType size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={clsx(
                                            "font-bold truncate text-sm transition-colors font-mono",
                                            isSelected || isHighlighted ? "text-orange-900" : "text-[#57534e] group-hover:text-[#292524]"
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
    );
}
