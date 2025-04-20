import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedSection from "@/components/FeaturedSection";
import CustomOrderForm from "@/components/CustomOrderForm";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-offwhite text-charcoal font-montserrat">
      <Header />
      <Hero />
      <FeaturedSection />
      <CustomOrderForm />
      <TestimonialsSection />
      <Footer />
      
      {/* Admin access link */}
      <div className="fixed bottom-4 right-4">
        <Link href="/admin">
          <a className="text-xs text-charcoal/30 hover:text-charcoal/60" title="Admin Access">
            Admin
          </a>
        </Link>
      </div>
    </div>
  );
}
