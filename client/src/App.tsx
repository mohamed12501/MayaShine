import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "./pages/home";
import Admin from "./pages/admin";
import Login from "@/pages/login";
import ThankYou from "@/pages/thank-you";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// Simple authentication check component
function AuthenticationWrapper({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/user'],
    staleTime: 1000 * 60, // 1 minute
    retry: false,
    throwOnError: false
  });
  
  const [, navigate] = useLocation();
  const [currentPath] = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);
  
  useEffect(() => {
    // Only proceed when not loading
    if (!isLoading) {
      // Logic for authentication redirects
      const isAtLoginPage = currentPath === "/login";
      const isAtAdminPage = currentPath === "/admin";
      
      // Only redirect if we haven't already redirected (prevents loops)
      if (!hasRedirected) {
        if (user && isAtLoginPage) {
          setHasRedirected(true);
          navigate("/admin");
        } else if (!user && isAtAdminPage) {
          setHasRedirected(true);
          navigate("/login");
        }
      }
    }
  }, [user, isLoading, currentPath, hasRedirected, navigate]);
  
  return <>{children}</>;
}

function Router() {
  return (
    <AuthenticationWrapper>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/thank-you" component={ThankYou} />
        <Route path="/login" component={Login} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </AuthenticationWrapper>
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
