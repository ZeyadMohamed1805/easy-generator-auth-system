export class ApiError extends Error {
  readonly statusCode: number;
  readonly messages: string[];

  constructor(statusCode: number, messages: string[]) {
    super(messages[0] ?? 'Request failed');
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.messages = messages;
  }
}

export function messagesFromBody(body: unknown): string[] {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;
    if (Array.isArray(message)) {
      return message.map(String);
    }
    if (typeof message === 'string' && message.length > 0) {
      return [message];
    }
  }
  return ['Something went wrong. Please try again.'];
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  refreshInFlight ??= fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })
    .then((response) => response.ok)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers,
  });

  const isAuthRoute = path.startsWith('/api/auth/');
  if (response.status === 401 && retry && !isAuthRoute) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return api<T>(path, options, false);
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, messagesFromBody(data));
  }
  return data as T;
}
