import { useState } from "react";
import { Link } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClose = () => setIsOpen(false);
  
  return (
    <nav className="py-4 px-6 bg-white shadow-sm fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-2xl md:text-3xl font-playfair text-gray-900 no-underline cursor-pointer">
              MAYA <span className="text-primary">Jewelry</span>
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 font-montserrat text-sm">
          <Link href="/">
            <span className="hover:text-primary transition duration-300 cursor-pointer">Home</span>
          </Link>
          <Link href="/#order">
            <span className="hover:text-primary transition duration-300 cursor-pointer">Custom Order</span>
          </Link>
          <Link href="/#collection">
            <span className="hover:text-primary transition duration-300 cursor-pointer">Collection</span>
          </Link>
          <Link href="/#about">
            <span className="hover:text-primary transition duration-300 cursor-pointer">About</span>
          </Link>
          <Link href="/#contact">
            <span className="hover:text-primary transition duration-300 cursor-pointer">Contact</span>
          </Link>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/" onClick={handleClose}>
                  <span className="px-4 py-2 text-lg hover:text-primary transition duration-300 block cursor-pointer">Home</span>
                </Link>
                <Link href="/#order" onClick={handleClose}>
                  <span className="px-4 py-2 text-lg hover:text-primary transition duration-300 block cursor-pointer">Custom Order</span>
                </Link>
                <Link href="/#collection" onClick={handleClose}>
                  <span className="px-4 py-2 text-lg hover:text-primary transition duration-300 block cursor-pointer">Collection</span>
                </Link>
                <Link href="/#about" onClick={handleClose}>
                  <span className="px-4 py-2 text-lg hover:text-primary transition duration-300 block cursor-pointer">About</span>
                </Link>
                <Link href="/#contact" onClick={handleClose}>
                  <span className="px-4 py-2 text-lg hover:text-primary transition duration-300 block cursor-pointer">Contact</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
