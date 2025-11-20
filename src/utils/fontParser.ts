import opentype from 'opentype.js';

export interface IconGlyph {
  name: string;
  unicode: string;
  path: string;
  fontFamily: string;
}

export interface ParsedFont {
  fileName: string;
  fontFamily: string;
  glyphs: IconGlyph[];
}

export async function parseFontFile(file: File): Promise<ParsedFont> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      
      try {
        const font = opentype.parse(buffer);
        const glyphs: IconGlyph[] = [];
        const fontFamily = font.names.fontFamily?.en || file.name.split('.')[0];

        for (let i = 0; i < font.glyphs.length; i++) {
          const glyph = font.glyphs.get(i);
          if (glyph.unicode) {
            // Generate path for 100px font size, baseline at 80px
            const path = glyph.getPath(0, 80, 100).toPathData(2);
            
            glyphs.push({
              name: glyph.name || `icon-${glyph.unicode}`,
              unicode: glyph.unicode.toString(16),
              path,
              fontFamily
            });
          }
        }

        resolve({
          fileName: file.name,
          fontFamily,
          glyphs
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
