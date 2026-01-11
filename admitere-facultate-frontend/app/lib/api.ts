const apiBaseUrl =
  import.meta.env.PROD
    ? import.meta.env.VITE_API_URL ?? "http://localhost:8080"
    : "";

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Eroare de server.";
    try {
      const data = await response.json();
      if (data && typeof data === "object" && "error" in data) {
        message = String(data.error);
      }
    } catch {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
