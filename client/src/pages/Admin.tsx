import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import AdminLogin from "@/components/AdminLogin";
import OrdersTable from "@/components/OrdersTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Admin() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout", {});
      setIsAuthenticated(false);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-offwhite p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-cormorant font-semibold text-gold">MAYA Jewelry Admin</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-cormorant mb-6">Customer Orders</h2>
          <OrdersTable />
        </div>
      </div>
    </div>
  );
}
