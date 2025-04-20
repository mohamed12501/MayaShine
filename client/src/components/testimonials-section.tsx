import { testimonials } from "@/lib/utils";

export function TestimonialsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-playfair text-center mb-12 text-gray-900">Client Stories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div className="bg-white p-6 shadow-sm rounded text-center" key={index}>
              <div className="mb-4 text-primary">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <p className="italic text-gray-700/80 font-montserrat text-sm mb-4">
                "{testimonial.content}"
              </p>
              <p className="font-medium text-gray-900">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
