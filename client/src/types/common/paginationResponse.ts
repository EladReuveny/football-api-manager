/**
 * Pagination response type
 * @template T - The type of the items array.
 * @property {T[]} items - The items array.
 * @property {number} pagination.currentPage - The current page number.
 * @property {number} pagination.limit - The number of items per page.
 * @property {number} pagination.totalItems - The total number of items.
 * @property {number} pagination.totalPages - The total number of pages.
 * @returns {PaginationResponse<T>}
 */
export type PaginationResponse<T> = {
  items: T[];
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};
