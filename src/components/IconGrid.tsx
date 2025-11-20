import { useState } from 'react';
import type { IconGlyph } from '../utils/fontParser';

import { Check, Copy } from 'lucide-react';

interface IconGridProps {
    glyphs: IconGlyph[];
    fontFamily: string;
}

export function IconGrid({ glyphs, fontFamily }: IconGridProps) {
    const [copied, setCopied] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const filteredGlyphs = glyphs.filter(glyph =>
        glyph.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        glyph.unicode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `\\u${glyph.unicode}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-6xl mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-[#292524] uppercase tracking-tight">
                    {fontFamily} <span className="text-[#78716c] text-sm font-bold font-mono ml-2">({glyphs.length} ICONS)</span>
                </h2>
                <input
                    type="text"
                    placeholder="SEARCH_ICONS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border-2 border-[#d6d3d1] text-[#292524] px-4 py-2 rounded-none focus:outline-none focus:border-[#ea580c] focus:shadow-[4px_4px_0px_0px_#ea580c] transition-all placeholder:text-[#a8a29e] font-mono text-sm font-bold w-64"
                />
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
                {filteredGlyphs.map((glyph, index) => (
                    <div
                        key={`${glyph.unicode}-${index}`}
                        onClick={() => handleCopy(`\\u${glyph.unicode}`, `code-${index}`)}
                        className="group relative flex flex-col items-center p-4 px-0.5 bg-white border-2 border-[#e7e5e4] hover:border-[#ea580c] hover:shadow-[4px_4px_0px_0px_#ea580c] transition-all duration-200 justify-between cursor-pointer active:scale-95 active:shadow-none"
                    >
                        <button
                            className="absolute top-1 right-1 p-1.5 text-[#a8a29e] hover:text-[#ea580c] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Copy Name"
                        >
                            {copied === `code-${index}` ? <Check size={14} /> : <Copy size={14} />}
                        </button>

                        <div className="w-full h-12 flex items-center justify-center mt-2 text-[#57534e] group-hover:text-[#ea580c] transition-colors">
                            <svg
                                viewBox={glyph.viewBox || "0 0 100 100"}
                                className="max-w-full max-h-full fill-current"
                                preserveAspectRatio="xMidYMid meet"
                                style={{ width: 'auto', height: '100%' }}
                            >
                                <path d={glyph.path} />
                            </svg>
                        </div>

                        <div className="text-center w-full mt-2 flex flex-col gap-0.5">
                            <p
                                className="text-[11px] text-[#78716c] truncate font-mono font-bold group-hover:text-[#292524] px-1"
                                title={glyph.name}
                            >
                                {glyph.name}
                            </p>
                            <p
                                className="text-[10px] text-[#a8a29e] font-mono font-bold group-hover:text-[#ea580c] transition-colors"
                                title={`\\u${glyph.unicode}`}
                            >
                                \u{glyph.unicode}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
