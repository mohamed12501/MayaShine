import { features } from "@/lib/utils";

export function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-playfair text-center mb-12 text-gray-900">Our Craftsmanship</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div className="text-center" key={index}>
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center">
                  <i className={`fas fa-${feature.icon} text-primary text-2xl`}></i>
                </div>
              </div>
              <h3 className="text-xl font-playfair mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-700/80 font-montserrat text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
