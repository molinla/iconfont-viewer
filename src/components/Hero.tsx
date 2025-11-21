import { useState, useCallback } from 'react';
import { Type, FileType } from 'lucide-react';

interface HeroProps {
    onFilesDrop: (files: File[]) => void;
}

export function Hero({ onFilesDrop }: HeroProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFilesDrop(files);
        }
    }, [onFilesDrop]);

    return (
        <div
            className={`flex-1 flex flex-col items-center justify-center w-full animate-in fade-in zoom-in-95 duration-500 mt-10 transition-all ${isDragging ? 'bg-orange-50 border-4 border-[#ea580c] border-dashed' : ''
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="relative w-full max-w-lg aspect-square mb-12 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-[#e7e5e4] rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-12 border-2 border-dashed border-[#d6d3d1] rounded-full animate-[spin_15s_linear_infinite_reverse]" />

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

            <div className="relative group pb-14">
                <button
                    onClick={() => document.getElementById('hidden-dropzone-input')?.click()}
                    className="relative px-8 py-4 bg-[#292524] text-white font-bold uppercase tracking-widest border-2 border-transparent hover:bg-orange-600 transition-colors shadow-[4px_4px_0px_0px_#a8a29e] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#a8a29e]"
                >
                    Select Files
                </button>
            </div>
            <input
                type="file"
                id="hidden-dropzone-input"
                className="hidden"
                multiple
                accept=".ttf,.woff,.woff2,.otf,.svg"
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        onFilesDrop(Array.from(e.target.files));
                    }
                }}
            />
        </div>
    );
}
