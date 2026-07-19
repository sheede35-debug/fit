import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, useLocation, Redirect, Router as WouterRouter } from 'wouter';
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from '@/pages/not-found';

import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Requests from '@/pages/Requests';
import NewRequest from '@/pages/NewRequest';
import RequestDetail from '@/pages/RequestDetail';
import Workflows from '@/pages/Workflows';
import NewWorkflow from '@/pages/NewWorkflow';
import WorkflowDetail from '@/pages/WorkflowDetail';
import Analytics from '@/pages/Analytics';
import AiHub from '@/pages/AiHub';
import Notifications from '@/pages/Notifications';
import Admin from '@/pages/Admin';

// ─── DEMO MODE ────────────────────────────────────────────────────────────────
// Set to false to re-enable Clerk authentication
export const DEMO_MODE = true;
// ──────────────────────────────────────────────────────────────────────────────

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(244 76% 59%)",
    colorForeground: "hsl(222 47% 11%)",
    colorMutedForeground: "hsl(215 16% 47%)",
    colorDanger: "hsl(0 84.2% 60.2%)",
    colorBackground: "hsl(0 0% 100%)",
    colorInput: "hsl(214 32% 91%)",
    colorInputForeground: "hsl(222 47% 11%)",
    colorNeutral: "hsl(214 32% 91%)",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-card rounded-2xl w-[440px] max-w-full overflow-hidden shadow-lg border border-border/50",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-foreground font-bold tracking-tight",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-foreground font-medium",
    formFieldLabel: "text-foreground font-medium",
    footerActionLink: "text-primary hover:text-primary/80 font-medium",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm",
    formFieldInput: "bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent",
    footerAction: "bg-muted/30 border-t border-border pt-6",
    dividerLine: "bg-border",
    alert: "bg-destructive/10 border border-destructive/20 text-destructive",
    main: "p-8",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

// ─── DEMO ROUTES (auth bypassed) ──────────────────────────────────────────────
function DemoRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={() => <Redirect to="/dashboard" />} />
        <Route path="/sign-in/*?" component={() => <Redirect to="/dashboard" />} />
        <Route path="/sign-up/*?" component={() => <Redirect to="/dashboard" />} />
        <Route path="/dashboard"><AppLayout><Dashboard /></AppLayout></Route>
        <Route path="/requests/new"><AppLayout><NewRequest /></AppLayout></Route>
        <Route path="/requests/:id"><AppLayout><RequestDetail /></AppLayout></Route>
        <Route path="/requests"><AppLayout><Requests /></AppLayout></Route>
        <Route path="/workflows/new"><AppLayout><NewWorkflow /></AppLayout></Route>
        <Route path="/workflows/:id"><AppLayout><WorkflowDetail /></AppLayout></Route>
        <Route path="/workflows"><AppLayout><Workflows /></AppLayout></Route>
        <Route path="/analytics"><AppLayout><Analytics /></AppLayout></Route>
        <Route path="/ai"><AppLayout><AiHub /></AppLayout></Route>
        <Route path="/notifications"><AppLayout><Notifications /></AppLayout></Route>
        <Route path="/admin"><AppLayout><Admin /></AppLayout></Route>
        <Route component={NotFound} />
      </Switch>
    </QueryClientProvider>
  );
}

// ─── CLERK ROUTES (auth enabled) ──────────────────────────────────────────────
function HomeRedirect() {
  return (
    <>
      <Show when="signed-in"><Redirect to="/dashboard" /></Show>
      <Show when="signed-out"><Landing /></Show>
    </>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <>
      <Show when="signed-in">
        <AppLayout><Component /></AppLayout>
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey!}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: "Welcome to FlowIQ", subtitle: "Sign in to access your command center" } },
        signUp: { start: { title: "Create your account", subtitle: "Get started with FlowIQ Enterprise" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
          <Route path="/requests/new"><ProtectedRoute component={NewRequest} /></Route>
          <Route path="/requests/:id"><ProtectedRoute component={RequestDetail} /></Route>
          <Route path="/requests"><ProtectedRoute component={Requests} /></Route>
          <Route path="/workflows/new"><ProtectedRoute component={NewWorkflow} /></Route>
          <Route path="/workflows/:id"><ProtectedRoute component={WorkflowDetail} /></Route>
          <Route path="/workflows"><ProtectedRoute component={Workflows} /></Route>
          <Route path="/analytics"><ProtectedRoute component={Analytics} /></Route>
          <Route path="/ai"><ProtectedRoute component={AiHub} /></Route>
          <Route path="/notifications"><ProtectedRoute component={Notifications} /></Route>
          <Route path="/admin"><ProtectedRoute component={Admin} /></Route>
          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider defaultTheme="light" storageKey="flowiq-theme">
        <TooltipProvider>
          <WouterRouter base={basePath}>
            {DEMO_MODE ? <DemoRoutes /> : <ClerkProviderWithRoutes />}
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
