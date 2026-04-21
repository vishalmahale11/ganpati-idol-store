import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getMainStoreBaseUrl } from "@/lib/adminHost";
import { useNavigate } from "@tanstack/react-router";
import { LogIn, ShoppingBag } from "lucide-react";
import { useState } from "react";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const ok = login(loginId.trim(), password);
      if (ok) {
        navigate({ to: "/" });
      } else {
        setError("Invalid login ID or password.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-elevated p-8 max-w-md w-full">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
          Admin sign in
        </h1>
        <p className="text-muted-foreground text-sm mb-6 text-center">
          Sign in to manage the Ganpati Store admin panel.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-login-id">Login ID</Label>
            <Input
              id="admin-login-id"
              name="loginId"
              type="text"
              autoComplete="username"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              data-ocid="admin.login.id_input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-ocid="admin.login.password_input"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
            data-ocid="admin.login.submit_button"
          >
            <LogIn className="w-4 h-4" />
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <a
          href={getMainStoreBaseUrl()}
          className="block mt-6 text-center text-sm text-muted-foreground hover:text-primary transition-smooth"
        >
          ← Back to Store
        </a>
      </div>
    </div>
  );
}
