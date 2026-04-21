/** True when the app is served on the admin subdomain (e.g. admin.localhost, admin.example.com). */
export function isAdminHost(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.startsWith("admin.");
}

/** Public storefront origin (strip `admin.` from hostname). */
export function getMainStoreBaseUrl(): string {
  if (typeof window === "undefined") return "/";
  const { protocol, hostname, port } = window.location;
  const mainHost = hostname.startsWith("admin.")
    ? hostname.slice("admin.".length)
    : hostname;
  const portPart = port ? `:${port}` : "";
  return `${protocol}//${mainHost}${portPart}`;
}

/** Admin panel origin (add `admin.` if missing). */
export function getAdminPanelBaseUrl(): string {
  if (typeof window === "undefined") return "/";
  const { protocol, hostname, port } = window.location;
  if (hostname.startsWith("admin.")) {
    const portPart = port ? `:${port}` : "";
    return `${protocol}//${hostname}${portPart}`;
  }
  const adminHost = `admin.${hostname}`;
  const portPart = port ? `:${port}` : "";
  return `${protocol}//${adminHost}${portPart}`;
}
