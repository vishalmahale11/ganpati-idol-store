import { Toaster } from "@/components/ui/sonner";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { readAdminSession } from "@/lib/adminAuth";
import { AdminDashboardPage } from "@/pages/AdminDashboard";
import { AdminIdolsPage } from "@/pages/AdminIdols";
import { AdminInquiriesPage } from "@/pages/AdminInquiries";
import { AdminLoginPage } from "@/pages/AdminLogin";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({ component: () => <Outlet /> });

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: () => {
    if (readAdminSession()) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLoginPage,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    if (!readAdminSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminDashboardPage,
});

const adminIdolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/idols",
  beforeLoad: () => {
    if (!readAdminSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminIdolsPage,
});

const adminInquiriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/inquiries",
  beforeLoad: () => {
    if (!readAdminSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminInquiriesPage,
});

const routeTree = rootRoute.addChildren([
  adminLoginRoute,
  adminIndexRoute,
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
    <AdminAuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AdminAuthProvider>
  );
}
