import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { CheckCircle } from "lucide-react";

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Thank You - MAYA Jewelry</title>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-24 flex items-center justify-center">
        <div className="container max-w-lg mx-auto px-6">
          <div className="bg-white p-8 rounded shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-playfair mb-4 text-gray-900">Thank You for Your Order</h1>
            
            <p className="text-gray-700 mb-6">
              We've received your custom jewelry request. A MAYA Jewelry specialist will contact you within 24-48 hours to discuss your order.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link href="/">
                <Button variant="outline">Return to Home</Button>
              </Link>
              <Link href="/#collection">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  View Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
