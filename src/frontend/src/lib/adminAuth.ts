const SESSION_KEY = "ganpati-admin-session";

/** Hardcoded admin credentials (replace with secure auth in production). */
export const ADMIN_LOGIN_ID = "admin@789";
export const ADMIN_PASSWORD = "welcome";

export function readAdminSession(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function writeAdminSession(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function credentialsMatch(loginId: string, password: string): boolean {
  return loginId === ADMIN_LOGIN_ID && password === ADMIN_PASSWORD;
}
