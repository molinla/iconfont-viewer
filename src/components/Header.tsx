import { useState, useImperativeHandle, forwardRef } from 'react';
import { FileType, Search } from 'lucide-react';

interface HeaderProps {
  fontsCount: number;
  loading: boolean;
  globalSearchTerm: string;
  onGlobalSearchChange: (term: string) => void;
  onClearWorkspace: () => void;
}

export interface HeaderRef {
  triggerDuplicateMessage: (message: string) => void;
}

export const Header = forwardRef<HeaderRef, HeaderProps>(
  ({ fontsCount, loading, globalSearchTerm, onGlobalSearchChange, onClearWorkspace }, ref) => {
    const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      triggerDuplicateMessage: (message: string) => {
        setDuplicateMessage(message);
        setTimeout(() => {
          setDuplicateMessage(null);
        }, 3000);
      },
    }));

    return (
      <>
        <header className="h-16 px-8 border-b-2 border-[#a8a29e] bg-[#fafaf9] flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-4 text-[#78716c] text-sm font-mono font-bold">
            {fontsCount > 0 ? (
              <span>LOADED: {fontsCount} FONT{fontsCount !== 1 ? 'S' : ''}</span>
            ) : (
              <span>WAITING_FOR_INPUT...</span>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-[#ea580c] animate-pulse">
                <div className="w-4 h-4 border-2 border-[#e7e5e4] border-t-[#ea580c] rounded-full animate-spin"></div>
                <span>PROCESSING...</span>
              </div>
            )}
          </div>
          <div className="flex gap-4 items-center">
            {fontsCount > 0 && (
              <>
                <div className="relative">
                  <Search 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a29e] pointer-events-none" 
                    size={16} 
                  />
                  <input
                    type="text"
                    placeholder="GLOBAL_SEARCH..."
                    value={globalSearchTerm}
                    onChange={(e) => onGlobalSearchChange(e.target.value)}
                    className="bg-white border-2 border-[#d6d3d1] text-[#292524] pl-10 pr-4 py-2 rounded-none focus:outline-none focus:border-[#ea580c] focus:shadow-[4px_4px_0px_0px_#ea580c] transition-all placeholder:text-[#a8a29e] font-mono text-sm font-bold w-80"
                  />
                </div>
                <button
                  onClick={onClearWorkspace}
                  className="px-4 py-2 bg-white border-2 border-[#d6d3d1] hover:border-[#78716c] hover:shadow-[2px_2px_0px_0px_#78716c] text-[#57534e] text-sm font-bold transition-all active:translate-y-[1px] active:shadow-none"
                >
                  CLEAR_WORKSPACE
                </button>
              </>
            )}
          </div>
        </header>

        {duplicateMessage && (
          <div className="mx-8 mt-6 p-4 bg-orange-50 border-2 border-orange-600 text-orange-900 text-sm flex items-center gap-3 font-bold shadow-[4px_4px_0px_0px_#ea580c] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-2 border transition-colors flex-shrink-0 bg-orange-100 border-orange-200 text-orange-700">
              <FileType size={18} />
            </div>
            {duplicateMessage}
          </div>
        )}
      </>
    );
  }
);

Header.displayName = 'Header';

