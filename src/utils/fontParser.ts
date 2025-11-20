import opentype from 'opentype.js';

export interface IconGlyph {
  name: string;
  unicode: string;
  path: string;
  viewBox?: string;
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
            const pathObj = glyph.getPath(0, 80, 100);
            const path = pathObj.toPathData(2);
            
            // Calculate bounding box for viewBox
            const bbox = pathObj.getBoundingBox();
            const width = bbox.x2 - bbox.x1;
            const height = bbox.y2 - bbox.y1;
            
            // Add some padding (optional, but good for visual breathing room)
            const padding = 0; 
            const viewBox = `${bbox.x1 - padding} ${bbox.y1 - padding} ${width + padding * 2} ${height + padding * 2}`;

            glyphs.push({
              name: glyph.name || `icon-${glyph.unicode}`,
              unicode: glyph.unicode.toString(16),
              path,
              viewBox,
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
