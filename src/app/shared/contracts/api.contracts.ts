export interface ApiResource<T> {
  data: T;
}

export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginatedLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginatedApiResource<T> {
  data: T[];
  meta: PaginatedMeta;
  links: PaginatedLinks;
}

export interface ApiValidationErrors {
  [field: string]: string | string[];
}

export interface ApiResult {
  ok: boolean;
  status: number;
  validationErrors?: ApiValidationErrors;
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';
