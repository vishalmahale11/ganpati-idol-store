import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Shield, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouterState();
  const path = router.location.pathname;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catalog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-smooth"
          >
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-subtle flex-shrink-0">
              <ShoppingBag className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <span className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                Ganpati
              </span>
              <span className="font-display text-lg font-bold text-primary">
                {" "}
                Store
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className={`px-4 py-2 rounded-md font-body text-sm font-medium transition-smooth ${
                  path === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Admin Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/admin" data-ocid="nav.admin.link">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border hover:border-primary hover:text-primary transition-smooth"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-smooth"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            data-ocid="nav.mobile_menu.toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-md font-body text-sm font-medium transition-smooth ${
                  path === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/admin" onClick={() => setMenuOpen(false)}>
              <Button variant="outline" size="sm" className="mt-2 gap-2 w-full">
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground">
                Ganpati Store
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Handcrafted Murtis for Your Festive Celebrations
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
