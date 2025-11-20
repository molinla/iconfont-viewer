import { X } from 'lucide-react';
import clsx from 'clsx';

interface DialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'default';
}

export function Dialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'CONFIRM',
    cancelText = 'CANCEL',
    variant = 'default'
}: DialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#fafaf9]/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white border-4 border-[#292524] shadow-[8px_8px_0px_0px_#292524] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-2 border-[#e7e5e4] bg-[#fafaf9]">
                    <h3 className="font-black uppercase tracking-tight text-lg text-[#292524]">
                        {title}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-[#e7e5e4] text-[#78716c] hover:text-[#292524] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-[#57534e] font-medium leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 bg-[#fafaf9] border-t-2 border-[#e7e5e4]">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 font-bold font-mono text-sm text-[#57534e] hover:text-[#292524] hover:bg-[#e7e5e4] transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={clsx(
                            "px-6 py-2 font-bold font-mono text-sm text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all border-2 border-transparent",
                            variant === 'danger'
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-[#292524] hover:bg-black"
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
