import { Toaster } from "@/components/ui/sonner";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { readAdminSession } from "@/lib/adminAuth";
import { getAdminPanelBaseUrl, isAdminHost } from "@/lib/adminHost";
import { AdminDashboardPage } from "@/pages/AdminDashboard";
import { AdminIdolsPage } from "@/pages/AdminIdols";
import { AdminInquiriesPage } from "@/pages/AdminInquiries";
import { AdminLoginPage } from "@/pages/AdminLogin";
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

const publicRouteTree = publicRootRoute.addChildren([
  indexRoute,
  catalogRoute,
  idolDetailRoute,
  contactRoute,
  legacyAdminIndexRoute,
  legacyAdminIdolsRoute,
  legacyAdminInquiriesRoute,
]);

const publicRouter = createRouter({ routeTree: publicRouteTree });

// --- Admin subdomain router ---

const adminRootRoute = createRootRoute({ component: () => <Outlet /> });

const adminLoginRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/login",
  beforeLoad: () => {
    if (readAdminSession()) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLoginPage,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/",
  beforeLoad: () => {
    if (!readAdminSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminDashboardPage,
});

const adminIdolsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/idols",
  beforeLoad: () => {
    if (!readAdminSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminIdolsPage,
});

const adminInquiriesRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/inquiries",
  beforeLoad: () => {
    if (!readAdminSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminInquiriesPage,
});

const adminRouteTree = adminRootRoute.addChildren([
  adminLoginRoute,
  adminIndexRoute,
  adminIdolsRoute,
  adminInquiriesRoute,
]);

const adminRouter = createRouter({ routeTree: adminRouteTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof publicRouter | typeof adminRouter;
  }
}

function PublicApp() {
  return (
    <>
      <RouterProvider router={publicRouter} />
      <Toaster position="top-right" richColors />
    </>
  );
}

function AdminApp() {
  return (
    <AdminAuthProvider>
      <RouterProvider router={adminRouter} />
      <Toaster position="top-right" richColors />
    </AdminAuthProvider>
  );
}

export default function App() {
  if (isAdminHost()) {
    return <AdminApp />;
  }
  return <PublicApp />;
}
