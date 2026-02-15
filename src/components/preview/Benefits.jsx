import React from 'react';

export default function Benefits({ benefits, primaryColor }) {
  const defaultBenefits = [
    { icon: '🏆', title: 'Quality Guarantee', description: 'We stand behind our work with a 100% satisfaction guarantee' },
    { icon: '⚡', title: 'Fast & Reliable', description: 'Same-day service available with flexible scheduling' },
    { icon: '💰', title: 'Fair Pricing', description: 'Transparent quotes with no hidden fees' },
    { icon: '🧹', title: 'Eco-Friendly', description: 'Green cleaning products safe for your family and pets' },
    { icon: '👨‍👩‍👧‍👦', title: 'Trusted Team', description: 'Background-checked and trained professionals' },
    { icon: '📱', title: 'Easy Booking', description: 'Book online or call us for immediate service' }
  ];

  const items = benefits || defaultBenefits;

  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-600">
            Experience the difference of working with true professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {items.map((benefit, idx) => (
            <div key={idx} className="text-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <span className="text-4xl">{benefit.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}