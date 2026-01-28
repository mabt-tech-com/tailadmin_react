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

  function buildHeaders(init: RequestInit) {
    const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
    const hasBody = init.body !== undefined && init.body !== null;

    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {};

    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (hasBody && !isFormData) headers["Content-Type"] = "application/json";

    return {
      ...headers,
      ...(init.headers as any),
    } as Record<string, string>;
  }

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      credentials: "include",
      headers: buildHeaders(init),
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

    if (!res.ok) {
      const message =
        (isJson &&
          body &&
          typeof body === "object" &&
          (("detail" in (body as any) && (body as any).detail) ||
            ("error" in (body as any) && (body as any).error))) ||
        `Request failed: ${res.status}`;
      throw new ApiError(String(message), res.status, body);
    }

    return body as T;
  }

  // for exports that return Blob (csv/txt/etc.)
  async function requestBlob(path: string, init: RequestInit = {}): Promise<Blob> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      credentials: "include",
      headers: buildHeaders(init),
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");
      const message =
        (isJson &&
          body &&
          typeof body === "object" &&
          (("detail" in (body as any) && (body as any).detail) ||
            ("error" in (body as any) && (body as any).error))) ||
        `Request failed: ${res.status}`;
      throw new ApiError(String(message), res.status, body);
    }

    return res.blob();
  }

  return { request, requestBlob };
}

export const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:9000",
});