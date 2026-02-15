import React from 'react';
import { Star } from 'lucide-react';

export default function Testimonials({ testimonials, tertiaryColor }) {
  const defaultTestimonials = [
    { name: 'Sarah Johnson', text: 'Outstanding service! My office has never looked better. The team is professional and thorough.', rating: 5 },
    { name: 'Mike Rodriguez', text: 'Reliable and affordable. They transformed our home. Highly recommend!', rating: 5 },
    { name: 'Emily Chen', text: 'Best cleaning service in town. Always on time and do an amazing job.', rating: 5 }
  ];

  const items = testimonials || defaultTestimonials;

  return (
    <section className="py-32 px-4" style={{ backgroundColor: tertiaryColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600">
            Don't just take our word for it
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">"{testimonial.text}"</p>
              <p className="font-bold text-gray-900">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}