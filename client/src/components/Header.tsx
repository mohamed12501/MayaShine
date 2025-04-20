import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-2xl md:text-3xl font-cormorant font-semibold tracking-wide text-gold">
              MAYA Jewelry
            </a>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-gold hover:text-charcoal"
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="text-charcoal hover:text-gold transition-colors text-sm uppercase tracking-wider font-medium">Home</a>
          <a href="#order" className="text-charcoal hover:text-gold transition-colors text-sm uppercase tracking-wider font-medium">Custom Order</a>
          <a href="#footer" className="text-charcoal hover:text-gold transition-colors text-sm uppercase tracking-wider font-medium">Contact</a>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      <nav className={`bg-white px-4 py-3 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col space-y-3">
          <a 
            href="#home" 
            className="text-charcoal hover:text-gold transition-colors text-sm uppercase tracking-wider font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </a>
          <a 
            href="#order" 
            className="text-charcoal hover:text-gold transition-colors text-sm uppercase tracking-wider font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Custom Order
          </a>
          <a 
            href="#footer" 
            className="text-charcoal hover:text-gold transition-colors text-sm uppercase tracking-wider font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
