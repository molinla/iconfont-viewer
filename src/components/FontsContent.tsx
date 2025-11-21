import { useImperativeHandle, forwardRef } from 'react';
import { Dropzone } from './Dropzone';
import { IconGrid } from './IconGrid';
import { type ParsedFont } from '../utils/fontParser';

interface FontsContentProps {
  error: string | null;
  fonts: ParsedFont[];
  globalSearchTerm?: string;
  fontGridRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  onFilesDrop: (files: File[]) => void;
  onDeleteFont: (hash: string) => void;
}

export interface FontsContentRef {
  scrollToFont: (hash: string) => void;
}

export const FontsContent = forwardRef<FontsContentRef, FontsContentProps>(
  ({ error, fonts, globalSearchTerm = '', fontGridRefs, onFilesDrop, onDeleteFont }, ref) => {
    useImperativeHandle(ref, () => ({
      scrollToFont: (hash: string) => {
        const fontGridElement = fontGridRefs.current.get(hash);
        if (fontGridElement) {
          fontGridElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
    }));

    return (
      <main className="p-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {error && (
            <div className="w-full mb-8 p-4 bg-red-50 border-2 border-red-500 text-red-700 text-sm flex items-center gap-2 font-bold shadow-[4px_4px_0px_0px_#ef4444]">
              <div className="w-2 h-2 bg-red-600" />
              ERROR: {error}
            </div>
          )}

          <div className="w-full flex flex-col items-center gap-12 pb-20">
            {fonts.map((font, i) => (
              <IconGrid
                key={font.hash || i}
                glyphs={font.glyphs}
                fontFamily={font.fontFamily}
                globalSearchTerm={globalSearchTerm}
                onDelete={() => onDeleteFont(font.hash || '')}
              />
            ))}

            {fonts.length > 0 && (
              <div className="w-full max-w-2xl mt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-0.5 flex-1 bg-[#d6d3d1]"></div>
                  <span className="text-[#a8a29e] text-sm font-bold uppercase tracking-widest">
                    Add more files
                  </span>
                  <div className="h-0.5 flex-1 bg-[#d6d3d1]"></div>
                </div>
                <Dropzone onFilesDrop={onFilesDrop} />
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }
);

FontsContent.displayName = 'FontsContent';

