import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Star } from 'lucide-react';

export default function ServicePage({ 
  service,
  content, 
  primaryColor, 
  secondaryColor,
  tertiaryColor,
  city,
  state,
  companyName,
  heroImage,
  testimonials,
  reviewsVerified,
  googleReviews
}) {
  const benefits = content?.benefits || [
    'Professional trained staff',
    'Eco-friendly products',
    'Satisfaction guaranteed',
    'Flexible scheduling'
  ];

  const whyChooseUs = content?.why_choose_us || [
    { title: 'Expert Team', desc: 'Highly trained professionals' },
    { title: 'Quality Service', desc: 'Consistent, reliable cleaning' },
    { title: 'Fair Pricing', desc: 'Transparent, competitive rates' }
  ];

  const displayTestimonials = reviewsVerified && googleReviews?.length > 0 
    ? googleReviews.slice(0, 3)
    : testimonials?.slice(0, 3) || [];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section 
        className="relative py-32 px-4 text-white"
        style={{ 
          backgroundImage: `url(${heroImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {content?.headline || `${service} in ${city}`}
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            {content?.subheadline || `Professional ${service.toLowerCase()} services for ${city}, ${state}`}
          </p>
          <Link to="/get-a-quote">
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 font-bold rounded-lg"
              style={{ backgroundColor: primaryColor }}
            >
              Get Free Quote
            </Button>
          </Link>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            {content?.description_title || `About Our ${service}`}
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            {content?.description || `We provide professional ${service.toLowerCase()} services in ${city}, ${state}. Our experienced team uses industry-leading equipment and eco-friendly products to deliver exceptional results every time.`}
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4" style={{ backgroundColor: tertiaryColor }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            What's Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white rounded-xl p-6 shadow-md">
                <CheckCircle2 className="w-8 h-8 flex-shrink-0" style={{ color: primaryColor }} />
                <span className="text-lg font-semibold text-gray-900">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Why Choose {companyName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="text-center p-6">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <span className="text-4xl">✨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {displayTestimonials.length > 0 && (
        <section className="py-24 px-4" style={{ backgroundColor: tertiaryColor }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              What Our Clients Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayTestimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
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
      )}

      {/* Service Area */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Serving {city} & Surrounding Areas
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            We proudly serve {city}, {state} and the surrounding communities with professional {service.toLowerCase()}.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-24 px-4 text-white text-center"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-2xl mb-10 text-white/90">
            Get your free quote today for {service.toLowerCase()} in {city}
          </p>
          <Link to="/get-a-quote">
            <Button 
              size="lg" 
              className="text-lg px-12 py-7 font-bold rounded-lg bg-white hover:bg-gray-100"
              style={{ color: primaryColor }}
            >
              Get Your Free Quote <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}