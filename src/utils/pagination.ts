export type SortOrder = 'asc' | 'desc';

export type ParsedSort = {
  sortBy: string;
  sortOrder: SortOrder;
};

export function parseSort(sortBy: string | undefined, defaultSort: string = 'createdAt:desc'): ParsedSort {
  const raw = (sortBy || defaultSort).trim();
  const [field, order] = raw.split(':');

  const sortOrder: SortOrder = order === 'asc' ? 'asc' : 'desc';
  return {
    sortBy: field || 'createdAt',
    sortOrder,
  };
}

export function getPagination(page: number, limit: number): { page: number; limit: number; skip: number } {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
  const skip = (safePage - 1) * safeLimit;

  return { page: safePage, limit: safeLimit, skip };
}

