export default function Hero() {
  return (
    <section id="home" className="py-16 md:py-24 bg-offwhite relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blush rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gold opacity-20 rounded-tr-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="font-cormorant text-4xl md:text-6xl font-light mb-6 leading-tight">
            <span className="block font-medium text-gold">Timeless elegance,</span> 
            crafted for you
          </h1>
          
          <p className="text-lg md:text-xl mb-8 font-light text-charcoal/80 max-w-xl mx-auto">
            Exquisite, personalized jewelry pieces that tell your unique story. Each creation is handcrafted with attention to every detail.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <a 
              href="#order" 
              className="bg-gold text-white font-medium py-3 px-8 rounded-md text-sm uppercase tracking-wider shadow-md hover:shadow-lg hover:bg-gold/90 transition-all transform hover:-translate-y-1"
            >
              Custom Order
            </a>
            <a 
              href="#gallery" 
              className="bg-transparent border border-gold text-gold font-medium py-3 px-8 rounded-md text-sm uppercase tracking-wider hover:bg-gold/5 transition-all"
            >
              View Collection
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
