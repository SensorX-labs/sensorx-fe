import { BaseQueryLoadMore } from "@/shared/models/base-query-page-list";
import { OffsetPagedResult, LoadMorePagedResult } from "@/shared/models/base-response";

// Response Entity
export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  parentName?: string;
  createdAt: string;
}

// Result Wrappers
export type CategoryListResult = OffsetPagedResult<Category>;
export type CategoryAllListResult = Category[];

// Request Models (Query)
export interface GetPageListCategoriesQuery {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface GetAllCategoriesResponse {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  createdAt: string;
}

// Request Models (Command)
export interface CreateCategoryRequest {
  name: string;
  parentId?: string;
  description?: string;
}

export interface SetParentCategoryRequest {
  parentId?: string;
}

export type LoadMoreCategoriesForModalQuery = BaseQueryLoadMore;

export interface LoadMoreCategoriesForModalResponse {
  id: string,
  name: string,
  description: string,
  createAt: string
}

export type LoadMoreCategoriesForModalResult = LoadMorePagedResult<LoadMoreCategoriesForModalResponse>
