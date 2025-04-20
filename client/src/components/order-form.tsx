import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { orderFormSchema, type OrderFormValues, jewelryTypes } from "@shared/schema";
import { FileInput } from "@/components/ui/file-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export function OrderForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      jewelryType: "",
      description: "",
    }
  });
  
  const orderMutation = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      const formData = new FormData();
      
      // Append form fields
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('jewelryType', data.jewelryType);
      formData.append('description', data.description);
      
      // Append image if exists
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to submit order');
      }
      
      return response.json();
    },
    onSuccess: () => {
      navigate('/thank-you');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const onSubmit = (data: OrderFormValues) => {
    orderMutation.mutate(data);
  };
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };
  
  return (
    <section id="order" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-playfair text-center mb-3 text-gray-900">Your Sparkle, One Step Away</h2>
          <p className="text-center text-gray-700/80 font-montserrat mb-10 max-w-2xl mx-auto">
            Love something from our social media? Upload a screenshot of the piece you'd like to order, fill in your details, and let MAYA Jewelry handle the rest — elegance delivered to your door.
          </p>
          
          <div className="bg-white p-6 md:p-10 shadow-sm rounded">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700/80">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Your name" 
                            className="form-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700/80">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            placeholder="your.email@example.com" 
                            className="form-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700/80">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="(123) 456-7890" 
                            className="form-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="jewelryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700/80">Type of Jewelry</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="form-input">
                              <SelectValue placeholder="Select jewelry type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jewelryTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700/80">Description / Customization Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Tell us which social media post or design caught your eye! Include any customization requests or details about size, materials, or other preferences."
                          className="form-input resize-none"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700/80">Upload Screenshot from Social Media</FormLabel>
                      <FormControl>
                        <FileInput 
                          id="image" 
                          name="image" 
                          onFileSelect={handleFileSelect}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="form-group text-center">
                  <Button 
                    type="submit" 
                    className="btn-gold w-full md:w-auto"
                    disabled={orderMutation.isPending}
                  >
                    {orderMutation.isPending ? "Placing Order..." : "Place My Order"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
