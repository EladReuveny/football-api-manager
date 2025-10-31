import { Link } from "react-router-dom";
import type { PaginationResponse } from "../types/common/paginationResponse";

type PaginationProps<T> = {
  pagination: Omit<PaginationResponse<T>, "items"> | null;
  onPageChange: (page: number) => void;
};

const Pagination = <T,>({ pagination, onPageChange }: PaginationProps<T>) => {
  if (!pagination) {
    return null;
  }

  const { currentPage } = pagination;

  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages)
      onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={handlePrevPage}
        className={`w-8 h-8 rounded-full border border-gray-600 text-gray-300 ${
          currentPage !== 1
            ? "hover:backdrop-brightness-400"
            : "cursor-not-allowed opacity-50"
        }`}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      <div className="flex items-center gap-2">
        {Array.from(
          { length: pagination?.totalPages ?? 1 },
          (_, index) => index + 1
        )
          .slice(
            currentPage - 4 > 0 ? currentPage - 4 : 0,
            currentPage + 4 < (pagination?.totalPages ?? 1)
              ? currentPage + 4
              : pagination?.totalPages ?? 1
          )
          .map((page) => (
            <Link
              key={page}
              to={`?page=${page}&limit=${pagination?.limit}`}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full border border-gray-600 transition-colors ${
                page === currentPage
                  ? "bg-(--color-text) text-(--color-bg)"
                  : "bg-transparent text-(--color-text) hover:backdrop-brightness-400"
              }`}
            >
              {page}
            </Link>
          ))}
      </div>

      <button
        type="button"
        disabled={currentPage === pagination?.totalPages}
        onClick={handleNextPage}
        className={`w-8 h-8 rounded-full border border-gray-600 text-gray-300 ${
          currentPage !== pagination?.totalPages
            ? "hover:backdrop-brightness-400"
            : "cursor-not-allowed opacity-50"
        }`}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination;
