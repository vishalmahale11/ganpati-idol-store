/** Public storefront origin for returning from admin to storefront. */
export function getMainStoreBaseUrl(): string {
  const configured = import.meta.env.VITE_STOREFRONT_URL;
  if (configured && typeof configured === "string") {
    return configured.replace(/\/$/, "");
  }
  if (typeof window === "undefined") return "/";
  const { protocol, hostname, port } = window.location;
  const mainHost = hostname.startsWith("admin.")
    ? hostname.slice("admin.".length)
    : hostname;
  const portPart = port ? `:${port}` : "";
  return `${protocol}//${mainHost}${portPart}`;
}
