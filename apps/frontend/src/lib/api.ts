const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function parseJson(response: Response) {
  const txt = await response.text().catch(() => "");
  if (!txt) return null;
  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

export async function post<T = unknown>(
  path: string,
  body: unknown,
  attachToken = true
): Promise<T> {
  const token = attachToken ? getToken() : null;
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const json = await parseJson(res);
  if (!res.ok) throw { status: res.status, body: json };
  return json as T;
}

export async function get<T = unknown>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const json = await parseJson(res);
  if (!res.ok) throw { status: res.status, body: json };
  return json as T;
}

export function saveToken(token: string) {
  localStorage.setItem("jwt", token);
}

export function getToken(): string | null {
  return localStorage.getItem("jwt");
}

export function clearToken() {
  localStorage.removeItem("jwt");
}

export default { post, get, saveToken, getToken, clearToken };
