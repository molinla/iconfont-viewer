import { useState } from 'react';
import type { IconGlyph } from '../utils/fontParser';

import { Copy, Check } from 'lucide-react';

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
        glyph.unicode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-6xl mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-200">
                    {fontFamily} <span className="text-slate-500 text-sm font-normal">({glyphs.length} icons)</span>
                </h2>
                <input
                    type="text"
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {filteredGlyphs.map((glyph, index) => (
                    <div
                        key={`${glyph.unicode}-${index}`}
                        className="group relative flex flex-col items-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300"
                    >
                        <div className="w-16 h-16 flex items-center justify-center mb-4 text-slate-200 group-hover:text-blue-400 transition-colors">
                            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                                <path d={glyph.path} />
                            </svg>
                        </div>

                        <div className="text-center w-full">
                            <p className="text-xs text-slate-400 truncate font-mono mb-1" title={glyph.name}>
                                {glyph.name}
                            </p>
                            <p className="text-[10px] text-slate-600 font-mono uppercase">
                                {glyph.unicode}
                            </p>
                        </div>

                        <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-xl gap-2 backdrop-blur-sm">
                            <button
                                onClick={() => handleCopy(glyph.name, `name-${index}`)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-200 transition-colors w-24 justify-center"
                            >
                                {copied === `name-${index}` ? <Check size={12} /> : <Copy size={12} />}
                                Name
                            </button>
                            <button
                                onClick={() => handleCopy(glyph.unicode, `code-${index}`)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-200 transition-colors w-24 justify-center"
                            >
                                {copied === `code-${index}` ? <Check size={12} /> : <Copy size={12} />}
                                Code
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
