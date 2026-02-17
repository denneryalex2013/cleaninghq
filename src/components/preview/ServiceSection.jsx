import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function ServiceSection({ 
  service, 
  primaryColor, 
  tertiaryColor,
  heroImage 
}) {
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('id');
  const quoteLink = recordId ? `?id=${recordId}&page=get-a-quote` : '?page=get-a-quote';

  return (
    <section 
      id={service.slug}
      className="py-32 px-4 scroll-mt-24"
      style={{ backgroundColor: tertiaryColor }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {service.hero?.headline || service.service_name}
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {service.intro?.text || service.hero?.subheadline || ''}
            </p>

            {service.benefits && service.benefits.length > 0 && (
              <ul className="space-y-4 mb-8">
                {service.benefits.slice(0, 4).map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: primaryColor }} />
                    <div>
                      <span className="text-lg font-bold text-gray-900">{benefit.title}</span>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <a href={quoteLink}>
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 font-bold rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                Get Free Quote
              </Button>
            </a>
          </div>

          <div>
            <img 
              src={heroImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'}
              alt={service.service_name}
              className="rounded-3xl shadow-2xl w-full h-[600px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}