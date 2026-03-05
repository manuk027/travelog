import { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

/**
 * ConfirmModal — drop-in replacement for window.confirm()
 *
 * Props:
 *   isOpen     {boolean}   – whether the modal is visible
 *   onClose    {fn}        – called when user cancels
 *   onConfirm  {fn}        – called when user confirms
 *   title      {string}    – modal heading
 *   message    {string}    – supporting message / warning
 *   confirmLabel {string}  – label for the confirm button  (default: "Delete")
 *   loading    {boolean}   – show spinner on confirm button
 *   variant    {string}    – "danger" (rose) | "warning" (amber) — default: "danger"
 */
const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmLabel = 'Delete',
    loading = false,
    variant = 'danger',
}) => {
    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const isDanger = variant === 'danger';
    const iconBg   = isDanger ? 'bg-rose-100 dark:bg-rose-900/30'   : 'bg-amber-100 dark:bg-amber-900/30';
    const iconClr  = isDanger ? 'text-rose-500'                      : 'text-amber-500';
    const btnClr   = isDanger
        ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'
        : 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400';

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            aria-modal="true"
            role="dialog"
        >
            {/* Blur overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white dark:bg-dark-card rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-slate-100 dark:border-slate-800 p-6 animate-scale-in">

                {/* Icon */}
                <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>
                    <AlertTriangle className={`w-7 h-7 ${iconClr}`} />
                </div>

                {/* Title */}
                <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2 ${btnClr}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Deleting…</span>
                            </>
                        ) : (
                            confirmLabel
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
