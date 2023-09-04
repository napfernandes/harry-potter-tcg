import { Model, SortOrder } from 'mongoose';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  SearchInput,
  SearchResult,
  SearchPagination,
  SearchInputPagination,
} from 'src/common/interface';

export abstract class BaseService<T> {
  @Inject() private readonly configService: ConfigService;

  constructor(protected model: Model<T>) {}

  buildSearchCriteria(input?: Partial<T>): Record<string, any> {
    return input;
  }

  buildProjections(projections: string[]): Record<string, any> {
    console.log(projections);
    return null;
  }

  buildSorting(sorting: { [K in keyof T]: 'asc' | 'desc' }): {
    [key: string]: SortOrder;
  } {
    return sorting ?? {};
  }

  buildPagination(
    pagination: SearchInputPagination,
    skipPagination?: boolean,
  ): SearchPagination {
    const searchPagination: SearchPagination = {
      skip: 0,
      limit: skipPagination
        ? null
        : this.configService.get<number>('DEFAULT_RESULTS_PER_SEARCH'),
    };

    if (!pagination) {
      return searchPagination;
    }

    if (pagination.size) {
      searchPagination.limit = pagination.size;
    }

    if (pagination.page) {
      searchPagination.skip = pagination.page
        ? (pagination.page - 1) * searchPagination.limit
        : 0;
    }

    return searchPagination;
  }

  async searchAll(options?: SearchInput<T>): Promise<SearchResult<T>> {
    const sorting = this.buildSorting(options.sorting);
    const filters = this.buildSearchCriteria(options.filters);
    const projections = this.buildProjections(options.include);
    const pagination = this.buildPagination(
      options.pagination,
      options.skipPagination,
    );

    const [total, results] = await Promise.all([
      this.model.count(filters),
      this.model
        .find(filters, projections)
        .sort(sorting)
        .skip(pagination.skip)
        .limit(pagination.limit),
    ]);

    return {
      total,
      results,
      pages: pagination.limit ? Math.ceil(total / pagination.limit) : 1,
    };
  }
}
