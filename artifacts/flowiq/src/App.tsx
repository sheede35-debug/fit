import { Suspense } from "react";
import { Switch, Route, useLocation, Redirect, Router as WouterRouter } from 'wouter';
import { QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { queryClient } from "@/lib/queryClient";
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from '@/pages/not-found';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Requests from '@/pages/Requests';
import NewRequest from '@/pages/NewRequest';
import RequestDetail from '@/pages/RequestDetail';
import Workflows from '@/pages/Workflows';
import NewWorkflow from '@/pages/NewWorkflow';
import WorkflowDetail from '@/pages/WorkflowDetail';
import Analytics from '@/pages/Analytics';
import AiHub from '@/pages/AiHub';
import Reports from '@/pages/Reports';
import Notifications from '@/pages/Notifications';
import Admin from '@/pages/Admin';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

// ─── Loading screen ────────────────────────────────────────────────────────────
function AuthLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

// ─── Protected route wrapper ───────────────────────────────────────────────────
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!user) return <Redirect to="/login" />;
  return <AppLayout><Component /></AppLayout>;
}

// ─── Root redirect ─────────────────────────────────────────────────────────────
function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  return <Redirect to={user ? "/dashboard" : "/login"} />;
}

// ─── Login gate (redirect if already signed in) ────────────────────────────────
function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (user) return <Redirect to="/dashboard" />;
  return <Login />;
}

// ─── All routes ────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      <Route path="/login" component={LoginRoute} />
      <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/requests/new"><ProtectedRoute component={NewRequest} /></Route>
      <Route path="/requests/:id"><ProtectedRoute component={RequestDetail} /></Route>
      <Route path="/requests"><ProtectedRoute component={Requests} /></Route>
      <Route path="/workflows/new"><ProtectedRoute component={NewWorkflow} /></Route>
      <Route path="/workflows/:id"><ProtectedRoute component={WorkflowDetail} /></Route>
      <Route path="/workflows"><ProtectedRoute component={Workflows} /></Route>
      <Route path="/analytics"><ProtectedRoute component={Analytics} /></Route>
      <Route path="/ai"><ProtectedRoute component={AiHub} /></Route>
      <Route path="/reports"><ProtectedRoute component={Reports} /></Route>
      <Route path="/notifications"><ProtectedRoute component={Notifications} /></Route>
      <Route path="/admin"><ProtectedRoute component={Admin} /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

// ─── App root ──────────────────────────────────────────────────────────────────
function App() {
  return (
    <LanguageProvider>
      <ThemeProvider defaultTheme="light" storageKey="flowiq-theme">
        <TooltipProvider>
          <WouterRouter base={basePath}>
            <AuthProvider>
              <QueryClientProvider client={queryClient}>
                <AppRoutes />
              </QueryClientProvider>
            </AuthProvider>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
