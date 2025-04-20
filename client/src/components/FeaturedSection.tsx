export default function FeaturedSection() {
  const featuredItems = [
    {
      id: 1,
      title: "Ethereal Necklace",
      description: "Fine gold chain with delicate pearls",
      imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74613c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Aurora Ring",
      description: "Handcrafted with premium diamonds",
      imageUrl: "https://images.unsplash.com/photo-1589304038421-449708a42983?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Harmony Bracelet",
      description: "18k gold with custom engraving",
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-cormorant text-3xl md:text-4xl font-medium mb-3">Our Signature Collection</h2>
          <div className="w-20 h-1 bg-gold mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredItems.map(item => (
            <div key={item.id} className="group">
              <div className="relative overflow-hidden rounded-md mb-4">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="font-cormorant text-xl font-medium mb-1">{item.title}</h3>
              <p className="text-charcoal/70 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="#order" 
            className="inline-block text-gold border-b border-gold pb-1 font-medium hover:text-charcoal hover:border-charcoal transition-colors"
          >
            Create your own custom piece →
          </a>
        </div>
      </div>
    </section>
  );
}
