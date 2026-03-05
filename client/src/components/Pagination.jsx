import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const delta = 1; // pages around current

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - delta && i <= currentPage + delta)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }

    return (
        <div className="flex items-center justify-center gap-1.5 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map((page, idx) =>
                page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-sm select-none">
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[36px] h-9 px-2.5 rounded-lg text-sm font-semibold transition-all border ${page === currentPage
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-100'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Next page"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;
