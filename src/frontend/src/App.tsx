import { Toaster } from "@/components/ui/sonner";
import { getAdminPanelBaseUrl, isAdminHost } from "@/lib/adminHost";
import { CatalogPage } from "@/pages/Catalog";
import { ContactPage } from "@/pages/Contact";
import { HomePage } from "@/pages/Home";
import { IdolDetailPage } from "@/pages/IdolDetail";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

// --- Public storefront router (main host) ---

const publicRootRoute = createRootRoute({ component: () => <Outlet /> });

const indexRoute = createRoute({
  getParentRoute: () => publicRootRoute,
  path: "/",
  component: HomePage,
});
const catalogRoute = createRoute({
  getParentRoute: () => publicRootRoute,
  path: "/catalog",
  component: CatalogPage,
});
const idolDetailRoute = createRoute({
  getParentRoute: () => publicRootRoute,
  path: "/catalog/$idolId",
  component: IdolDetailPage,
});
const contactRoute = createRoute({
  getParentRoute: () => publicRootRoute,
  path: "/contact",
  validateSearch: (search: Record<string, unknown>) => ({
    idolId: typeof search.idolId === "string" ? search.idolId : undefined,
    idolName: typeof search.idolName === "string" ? search.idolName : undefined,
  }),
  component: ContactPage,
});

function redirectToAdminPanel(path: string) {
  const base = getAdminPanelBaseUrl();
  const target = path === "/" ? `${base}/` : `${base}${path}`;
  throw redirect({ href: target });
}

const legacyAdminIndexRoute = createRoute({
  getParentRoute: () => publicRootRoute,
  path: "/admin",
  beforeLoad: () => redirectToAdminPanel("/"),
});
const legacyAdminIdolsRoute = createRoute({
  getParentRoute: () => publicRootRoute,
  path: "/admin/idols",
  beforeLoad: () => redirectToAdminPanel("/idols"),
});
const legacyAdminInquiriesRoute = createRoute({
  getParentRoute: () => publicRootRoute,
  path: "/admin/inquiries",
  beforeLoad: () => redirectToAdminPanel("/inquiries"),
});

const routeTree = publicRootRoute.addChildren([
  indexRoute,
  catalogRoute,
  idolDetailRoute,
  contactRoute,
  legacyAdminIndexRoute,
  legacyAdminIdolsRoute,
  legacyAdminInquiriesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  if (isAdminHost()) {
    window.location.href = getAdminPanelBaseUrl();
    return null;
  }
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
