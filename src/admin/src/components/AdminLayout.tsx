import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getMainStoreBaseUrl } from "@/lib/adminHost";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ChevronRight,
  Image,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/idols", label: "Manage Idols", icon: Image },
  { href: "/inquiries", label: "Inquiries", icon: MessageSquare },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouterState();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const path = router.location.pathname;

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shadow-subtle shrink-0">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-border">
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-smooth"
          >
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="leading-tight min-w-0">
              <p className="font-display text-sm font-bold text-foreground truncate">
                Ganpati Store
              </p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? path === item.href
              : path.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                data-ocid={`admin.sidebar.${item.label.toLowerCase().replace(/\s/g, "_")}.link`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth group ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
                />
                <span className="flex-1 min-w-0 truncate">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="admin.sidebar.logout.button"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-auto">{children}</main>
        <div className="border-t border-border px-6 py-3 text-center">
          <a
            href={getMainStoreBaseUrl()}
            className="text-sm text-muted-foreground hover:text-primary transition-smooth"
          >
            ← Back to Store
          </a>
        </div>
      </div>
    </div>
  );
}
