export const TOKEN_KEY = "worker_token";
export const WORKER_ID_KEY = "worker_id";
export const WORKER_NAME_KEY = "worker_name"; // optional, for storing worker name

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(WORKER_ID_KEY);
  sessionStorage.removeItem(WORKER_NAME_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function setWorkerId(id: number) {
  sessionStorage.setItem(WORKER_ID_KEY, String(id));
}

export function getWorkerId(): number | null {
  const id = sessionStorage.getItem(WORKER_ID_KEY);
  return id ? Number(id) : null;
}

// Optional: store worker name if you use it in the header
export function setWorkerName(name: string) {
  sessionStorage.setItem(WORKER_NAME_KEY, name);
}

export function getWorkerName(): string | null {
  return sessionStorage.getItem(WORKER_NAME_KEY);
}