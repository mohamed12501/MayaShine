import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
// Fix casing issues in imports
import Home from "./pages/home";
import Admin from "./pages/admin";
import Login from "@/pages/login";
import ThankYou from "@/pages/thank-you";
import { useQuery } from "@tanstack/react-query";

function Router() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/user'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    throwOnError: false
  });

  // Don't perform redirects during loading
  if (isLoading) {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/thank-you" component={ThankYou} />
        <Route path="/login" component={Login} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/login">
        {user ? () => {
          // Use one-time redirect instead of window.location to prevent loops
          setTimeout(() => {
            window.location.replace('/admin');
          }, 100);
          return <div>Redirecting to admin...</div>;
        } : () => <Login />}
      </Route>
      <Route path="/admin">
        {user ? () => <Admin /> : () => {
          // Use one-time redirect instead of window.location to prevent loops
          setTimeout(() => {
            window.location.replace('/login');
          }, 100);
          return <div>Redirecting to login...</div>;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
