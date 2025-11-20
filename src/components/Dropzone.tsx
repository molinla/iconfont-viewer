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
                'w-full max-w-3xl p-12 rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer group',
                isDragging
                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                    : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
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
                    'p-4 rounded-full transition-colors duration-300',
                    isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50'
                )}>
                    <Upload size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-1">
                        Drag & drop font files here
                    </h3>
                    <p className="text-slate-500 text-sm">
                        Supports TTF, WOFF, WOFF2, OTF, SVG
                    </p>
                </div>
            </div>
        </div>
    );
}
