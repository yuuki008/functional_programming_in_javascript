export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestOptions {
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number>;
  body?: any;
}

