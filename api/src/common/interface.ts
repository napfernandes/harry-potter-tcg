export interface SearchInputPagination {
  page: number;
  size: number;
}

export interface SearchPagination {
  skip: number;
  limit: number;
}

export interface SearchInput<T> {
  filters?: T;
  pagination?: SearchInputPagination;
  skipPagination?: boolean;
  include?: string[];
  sorting?: {
    [K in keyof T]: 'asc' | 'desc';
  };
}

export interface SearchResult<T> {
  total: number;
  pages: number;
  results: T[];
}
