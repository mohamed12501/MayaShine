import { galleryItems } from "@/lib/utils";

export function GallerySection() {
  return (
    <section id="collection" className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-playfair text-center mb-12 text-gray-900">Our Collection</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div className="overflow-hidden group" key={index}>
              <div className="relative overflow-hidden">
                <img 
                  src={item.imageSrc}
                  alt={item.title}
                  className="w-full h-80 object-cover transition duration-500 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition duration-300"></div>
              </div>
              <div className="pt-4 pb-8">
                <h3 className="text-lg font-playfair mb-1 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-700/70 font-montserrat">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a href="#" className="inline-block border border-primary text-primary py-2 px-6 rounded-sm font-montserrat font-medium text-sm uppercase hover:bg-primary hover:text-white transition duration-300">
            View Full Collection
          </a>
        </div>
      </div>
    </section>
  );
}
