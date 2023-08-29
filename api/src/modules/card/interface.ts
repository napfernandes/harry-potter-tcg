import { AttributeValue } from '../attribute/model';

export interface SearchInputPagination {
  page: number;
  size: number;
}

export interface SearchFilter {
  key: string;
  value: AttributeValue;
}

export interface SearchInput<EntityType> {
  filters: SearchFilter[];
  pagination: SearchInputPagination;
  sorting: {
    [K in keyof EntityType]: 'asc' | 'desc';
  };
}
