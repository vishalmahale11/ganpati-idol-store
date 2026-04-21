import { AdminLayout } from "@/components/AdminLayout";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { AdminDashboardPage } from "@/pages/AdminDashboard";
import { AdminIdolsPage } from "@/pages/AdminIdols";
import { AdminInquiriesPage } from "@/pages/AdminInquiries";
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
} from "@tanstack/react-router";

// Root route
const rootRoute = createRootRoute({ component: () => <Outlet /> });

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog",
  component: CatalogPage,
});
const idolDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog/$idolId",
  component: IdolDetailPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboardPage,
});
const adminIdolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/idols",
  component: AdminIdolsPage,
});
const adminInquiriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/inquiries",
  component: AdminInquiriesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  idolDetailRoute,
  contactRoute,
  adminRoute,
  adminIdolsRoute,
  adminInquiriesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
