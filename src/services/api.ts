import { signOut } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
const INTERNAL_SERVER_ERROR = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  errorId?: string;
  errors: ApiFieldError[];
}

export type ApiResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      status: number;
      message: string;
      errors: ApiFieldError[];
      body?: ApiErrorResponse;
    };

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function buildUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

function buildHeaders(authenticated: boolean): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = authenticated ? getStoredToken() : null;

  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!value || typeof value !== 'object') return false;
  const body = value as Partial<ApiErrorResponse>;
  return typeof body.status === 'number'
    && typeof body.error === 'string'
    && typeof body.message === 'string';
}

async function parseError(response: Response): Promise<ApiResult<never>> {
  let parsedBody: unknown;

  try {
    parsedBody = await response.json();
  } catch {
    parsedBody = undefined;
  }

  const body = isApiErrorResponse(parsedBody)
    ? { ...parsedBody, errors: Array.isArray(parsedBody.errors) ? parsedBody.errors : [] }
    : undefined;

  if (response.status === 401 && body?.message === 'Token expirado.') {
    if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
    await signOut({ callbackUrl: '/login' });
  }

  const errors = body?.errors ?? [];
  const validationMessage = errors.map((error) => error.message).join('\n');
  const message = validationMessage
    || body?.message
    || response.statusText
    || `Erro HTTP ${response.status}`;

  return {
    success: false,
    status: response.status,
    message,
    errors,
    body,
  };
}

function networkError(error: unknown): ApiResult<never> {
  console.error('Falha ao acessar a API:', error);
  return {
    success: false,
    status: 0,
    message: INTERNAL_SERVER_ERROR,
    errors: [],
  };
}

async function request<T>(
  path: string,
  method: HttpMethod,
  data?: unknown,
  authenticated = true,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(buildUrl(path), {
      method,
      headers: buildHeaders(authenticated),
      body: data === undefined ? undefined : JSON.stringify(data),
    });

    if (!response.ok) return parseError(response);
    if (response.status === 204) return { success: true, data: undefined as T };

    const text = await response.text();
    return {
      success: true,
      data: text ? JSON.parse(text) as T : undefined as T,
    };
  } catch (error) {
    return networkError(error);
  }
}

export function apiGet<T>(path: string): Promise<ApiResult<T>> {
  return request<T>(path, 'GET');
}

export function apiPost<T>(path: string, data: unknown): Promise<ApiResult<T>> {
  return request<T>(path, 'POST', data);
}

export function apiPostLogin<T>(path: string, data: unknown): Promise<ApiResult<T>> {
  return request<T>(path, 'POST', data, false);
}

export function apiPut<T>(path: string, data: unknown): Promise<ApiResult<T>> {
  return request<T>(path, 'PUT', data);
}

export function apiDelete<T>(path: string): Promise<ApiResult<T>> {
  return request<T>(path, 'DELETE');
}
