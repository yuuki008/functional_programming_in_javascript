import { RequestOptions } from "https";
import { baseRequest } from "./apiClient";
import { curry } from "./curry";

const curriedBaseRequest = curry(baseRequest);

const apiRequest = curriedBaseRequest('https://api.example.com');

export const get = (endpoint: string, options?: RequestOptions) =>
  apiRequest({ method: 'GET', path: endpoint, options });

export const post = (endpoint: string, options?: RequestOptions) =>
  apiRequest({ method: 'POST', path: endpoint, options });

export const put = (endpoint: string, options?: RequestOptions) =>
  apiRequest({ method: 'PUT', path: endpoint, options });

export const del = (endpoint: string, options?: RequestOptions) =>
  apiRequest({ method: 'DELETE', path: endpoint, options });
