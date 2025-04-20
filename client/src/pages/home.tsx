import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { GallerySection } from "@/components/gallery-section";
import { OrderForm } from "@/components/order-form";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Footer } from "@/components/footer";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>MAYA Jewelry - Timeless elegance, crafted for you</title>
        <meta name="description" content="Custom handcrafted jewelry pieces that tell your unique story." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-16">
        <HeroSection />
        <FeaturesSection />
        <GallerySection />
        <OrderForm />
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
}
