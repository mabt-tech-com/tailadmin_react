// src/services/apiClient.ts

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type ApiClientOptions = {
  baseUrl?: string;
};

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = options.baseUrl ?? "";

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      // IMPORTANT: send session cookie to FastAPI
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

    if (!res.ok) {
      const message =
        (isJson && body && typeof body === "object" && "detail" in (body as any) && (body as any).detail) ||
        `Request failed: ${res.status}`;
      throw new ApiError(String(message), res.status, body);
    }

    return body as T;
  }

  return { request };
}

export const apiClient = createApiClient({
  // If your React is served from same domain as FastAPI, keep ""
  // If different, set: baseUrl: import.meta.env.VITE_API_BASE_URL
  baseUrl: "http://localhost:9000",
});