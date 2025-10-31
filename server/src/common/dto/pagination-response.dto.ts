/**
 * Generic pagination response DTO.
 *
 * @template T - The type of the items in the paginated response.
 * @property {T[]} items - The paginated list of items.
 * @property {number} currentPage - The current page number.
 * @property {number} limit - The number of items per page.
 * @property {number} totalItems - The total number of items across all pages.
 * @property {number} totalPages - The total number of pages.
 */
export type PaginationResponseDto<T> = {
  items: T[];
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};
