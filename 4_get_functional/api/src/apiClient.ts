import { curry } from './curry';
import { HttpMethod, RequestOptions } from './types';

const buildQueryParams = (params: Record<string, string | number>): string => {
  return new URLSearchParams(params as Record<string, string>).toString();
};

/**
* ベースリクエスト関数
* @param baseUrl API のベース URL
* @param method HTTP メソッド
* @param endpoint エンドポイント
* @param options リクエストオプション（ヘッダー、クエリパラメータ、ボディなど）
* @returns レスポンスデータ
*/
export const baseRequest = async (
  baseUrl: string,
  method: HttpMethod,
  endpoint: string,
  options: RequestOptions = {}
): Promise<any> => {
  const url = new URL(endpoint, baseUrl);

  // クエリパラメータを追加
  if (options.queryParams) {
    url.search = buildQueryParams(options.queryParams);
  }

  // ヘッダーを設定
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // リクエストオプションを構築
  const fetchOptions: RequestInit = {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  // リクエストを実行
  const response = await fetch(url.toString(), fetchOptions);

  // レスポンスの処理
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  // レスポンスを JSON として返す
  return response.json();
};

export const get = curry(baseRequest)('GET');
export const post = curry(baseRequest)('POST');
export const put = curry(baseRequest)('PUT');
export const del = curry(baseRequest)('DELETE');
