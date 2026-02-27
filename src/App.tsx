import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import SubmitFeedback from "./pages/SubmitFeedback";
import TeamIntake from "./pages/TeamIntake";
import TriageDashboard from "./pages/TriageDashboard";
import RoleManagement from "./pages/RoleManagement";
import { DashboardLayoutSkeleton } from "./components/DashboardLayoutSkeleton";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) return <Redirect to="/auth" />;
  return <Component />;
}

function Router() {
  const { user, loading } = useAuth();

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/submit" component={SubmitFeedback} />
      <Route path="/intake" component={TeamIntake} />
      <Route path="/auth">
        {loading ? <DashboardLayoutSkeleton /> : user ? <Redirect to="/" /> : <Auth />}
      </Route>
      {/* Protected routes */}
      <Route path="/triage">{() => <ProtectedRoute component={TriageDashboard} />}</Route>
      <Route path="/admin/roles">{() => <ProtectedRoute component={RoleManagement} />}</Route>
      <Route path="/">{() => <ProtectedRoute component={Home} />}</Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster position="bottom-right" />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
