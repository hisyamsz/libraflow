export interface ApiMeta {
  status: number;
  message: string;
}

export interface ApiPagination {
  totalData: number;
  totalPage: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  meta: ApiMeta;
  data: T;
  pagination?: ApiPagination;
}

export interface ApiErrorData {
  meta?: { message?: string };
  message?: string;
}
