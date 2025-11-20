import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import clsx from 'clsx';

interface DropzoneProps {
    onFilesDrop: (files: File[]) => void;
}

export function Dropzone({ onFilesDrop }: DropzoneProps) {
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

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesDrop(Array.from(e.target.files));
        }
    }, [onFilesDrop]);

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={clsx(
                'w-full max-w-3xl p-12 rounded-none border-2 border-dashed transition-all duration-200 ease-in-out cursor-pointer group',
                isDragging
                    ? 'border-[#ea580c] bg-orange-50 scale-[1.01] shadow-[4px_4px_0px_0px_#ea580c]'
                    : 'border-[#d6d3d1] hover:border-[#ea580c] hover:bg-[#fafaf9] hover:shadow-[4px_4px_0px_0px_#d6d3d1]'
            )}
            onClick={() => document.getElementById('file-input')?.click()}
        >
            <input
                type="file"
                id="file-input"
                className="hidden"
                multiple
                accept=".ttf,.woff,.woff2,.otf,.svg"
                onChange={handleFileInput}
            />

            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className={clsx(
                    'p-4 rounded-none border-2 transition-colors duration-200',
                    isDragging ? 'bg-orange-100 border-orange-500 text-orange-600' : 'bg-white border-[#e7e5e4] text-[#a8a29e] group-hover:text-[#ea580c] group-hover:border-[#ea580c]'
                )}>
                    <Upload size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#292524] mb-1 uppercase tracking-tight">
                        Drag & drop font files here
                    </h3>
                    <p className="text-[#78716c] text-sm font-mono font-bold">
                        SUPPORTS TTF, WOFF, WOFF2, OTF, SVG
                    </p>
                </div>
            </div>
        </div>
    );
}
