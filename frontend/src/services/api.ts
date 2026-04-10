const BROWSER_API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const SERVER_API_URL =
  process.env.API_URL_INTERNAL ?? process.env.API_URL ?? BROWSER_API_URL;

export const API_URL =
  typeof window === 'undefined' ? SERVER_API_URL : BROWSER_API_URL;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = 'Error en la petición';
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {
      // Si no es JSON, utilizamos el statusText
      message = response.statusText || message;
    }
    throw new ApiError(response.status, message);
  }

  return response.json();
}
