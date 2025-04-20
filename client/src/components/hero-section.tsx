import { Link } from "wouter";

export function HeroSection() {
  const scrollToOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    const orderSection = document.getElementById('order');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-playfair mb-4 text-gray-900 leading-tight">
          <span className="text-primary">Timeless elegance</span>,<br />crafted for you
        </h1>
        <p className="text-lg md:text-xl font-montserrat text-gray-800/80 max-w-2xl mx-auto mb-8">
          Each piece tells a unique story. Create your perfect jewelry piece that will last for generations to come.
        </p>
        <a 
          href="#order" 
          onClick={scrollToOrder}
          className="btn-gold inline-block"
        >
          Create Your Custom Piece
        </a>
      </div>
    </section>
  );
}
