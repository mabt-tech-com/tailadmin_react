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
    const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
    const hasBody = init.body !== undefined && init.body !== null;

    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {};

    if (token) headers["Authorization"] = `Bearer ${token}`;

    // only set content-type when we send JSON
    if (hasBody && !isFormData) headers["Content-Type"] = "application/json";

    // allow caller overrides
    const mergedHeaders = {
      ...headers,
      ...(init.headers as any),
    };

    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      credentials: "include",
      headers: mergedHeaders,
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
  baseUrl: "http://localhost:9000",
});