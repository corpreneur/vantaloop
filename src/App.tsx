import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SubmitFeedback from "./pages/SubmitFeedback";
import TriageDashboard from "./pages/TriageDashboard";

function Router() {
  return (
    <Switch>
      {/* Public: feedback submission form (no login required) */}
      <Route path="/submit" component={SubmitFeedback} />
      {/* Protected: intake triage dashboard */}
      <Route path="/triage" component={TriageDashboard} />
      {/* Primary: V2 Kanban board with all enhancements */}
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
