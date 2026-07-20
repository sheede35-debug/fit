import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch, Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login(email.trim(), password);
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Invalid credentials. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <GitBranch className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">FlowIQ</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Enterprise Workflow Intelligence
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-lg font-semibold mb-1">Welcome back</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Sign in to access your command center
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={pending}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={pending}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full mt-2" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </div>

          {/* Footer hint */}
          <div className="bg-muted/30 border-t border-border px-8 py-4">
            <p className="text-xs text-muted-foreground text-center">
              Use your organisation credentials to sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
