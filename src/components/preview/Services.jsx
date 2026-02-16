import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Services({ services, primaryColor }) {
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('id');
  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional cleaning solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const serviceSlug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '');
            const serviceLink = recordId ? `?id=${recordId}&page=${serviceSlug}` : `?page=${serviceSlug}`;
            
            return (
              <a 
                key={idx}
                href={serviceLink}
                className="group bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 block"
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 20px 60px ${primaryColor}40`}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <span 
                  className="font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                  style={{ color: primaryColor }}
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}