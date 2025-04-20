import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import ThankYou from "@/pages/thank-you";
import { useQuery } from "@tanstack/react-query";

function Router() {
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    throwOnError: false
  });

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/login">
        {user ? () => (window.location.href = '/admin') : () => <Login />}
      </Route>
      <Route path="/admin">
        {user ? () => <Admin /> : () => (window.location.href = '/login')}
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
