import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { formatDate, truncateText } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order, jewelryTypes } from "@shared/schema";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AlertTriangle, Eye, Trash2, LogIn } from "lucide-react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Fetch current user
  const { data: user, isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['/api/user'],
    retry: false,
    // will return null on 401, not throw
    queryFn: getQueryFn({ on401: "returnNull" })
  });

  // If no user is logged in, redirect to login
  useEffect(() => {
    if (!isLoadingUser && !user) {
      setLocation("/login");
    }
  }, [user, isLoadingUser, setLocation]);
  
  // Fetch orders only if user is authenticated
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    enabled: !!user, // Only run if user is authenticated
    queryFn: getQueryFn({ on401: "returnNull" }), // Handle 401 gracefully
    retry: 1,
  });
  
  // Delete order mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/orders/${id}`),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete order",
        variant: "destructive"
      });
    }
  });
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/logout');
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      window.location.href = '/'; // Use a hard redirect instead of router
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
    }
  };
  
  // Filter orders based on selected type
  const filteredOrders = orders?.filter(order => 
    filterType === "all" || order.jewelryType === filterType
  );
  
  // Get selected order
  const selectedOrder = selectedOrderId ? orders?.find(order => order.id === selectedOrderId) : null;
  
  // If still loading user, show loading state
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-32 w-full max-w-lg mx-auto" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If not authenticated, user will be redirected via useEffect
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Admin Dashboard - MAYA Jewelry</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-playfair text-gray-900">Admin Dashboard</h2>
            <div className="flex space-x-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {jewelryTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="secondary" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-1"></i> Logout
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-32" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <p>Error loading orders. Please try again.</p>
            </div>
          ) : filteredOrders?.length === 0 ? (
            <div className="bg-white rounded shadow-sm p-8 text-center">
              <p className="text-gray-500">No orders found.</p>
            </div>
          ) : (
            <div className="bg-white rounded shadow-sm overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-900 text-white">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Jewelry Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.fullName}</TableCell>
                      <TableCell>{order.email}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell>{order.jewelryType}</TableCell>
                      <TableCell className="max-w-xs truncate">{truncateText(order.description, 40)}</TableCell>
                      <TableCell>
                        {order.imagePath ? (
                          <Button 
                            variant="link" 
                            className="text-primary hover:underline p-0 h-auto"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <i className="fas fa-image mr-1"></i> View
                          </Button>
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(order.submittedAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p>{selectedOrder.fullName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p>{selectedOrder.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p>{selectedOrder.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Jewelry Type</h4>
                  <p>{selectedOrder.jewelryType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Submitted On</h4>
                  <p>{formatDate(selectedOrder.submittedAt)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="whitespace-pre-line">{selectedOrder.description}</p>
              </div>
              
              {selectedOrder.imagePath && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Reference Image</h4>
                  <div className="mt-2 border rounded overflow-hidden">
                    <img 
                      src={selectedOrder.imagePath} 
                      alt="Reference" 
                      className="max-w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedOrderId) {
                  deleteMutation.mutate(selectedOrderId);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
