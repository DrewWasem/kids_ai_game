interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pages, onPageChange }: PaginationProps) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="btn-secondary text-sm">Previous</button>
      <span className="text-sm text-gray-600 dark:text-gray-400">Page {page} of {pages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= pages} className="btn-secondary text-sm">Next</button>
    </div>
  );
}
