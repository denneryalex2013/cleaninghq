import React, { useEffect, useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Star, Shield, Award, MapPin, Phone, Mail, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Preview() {
  const navigate = useNavigate();
  const [siteRequest, setSiteRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSticky, setIsSticky] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const recordId = urlParams.get('id');

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadSiteRequest = async () => {
      if (!recordId) {
        setLoading(false);
        return;
      }

      try {
        const requests = await base44.entities.SiteRequest.filter({ id: recordId });
        if (requests.length > 0) {
          setSiteRequest(requests[0]);
        }
      } catch (error) {
        console.error('Error loading site request:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSiteRequest();
  }, [recordId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!siteRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Preview Not Found</h1>
          <Button onClick={() => navigate(createPageUrl('Home'))}>
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const primaryColor = siteRequest.primary_color || '#14b8a6';
  const secondaryColor = siteRequest.secondary_color || '#0ea5e9';
  const tertiaryColor = siteRequest.tertiary_color || '#f3f4f6';
  const content = siteRequest.generated_content || {};

  return (
    <div className="min-h-screen bg-white">
      {/* PREVIEW MODE BANNER */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 py-3 px-4 text-center sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
          <span className="font-bold text-gray-900">✨ PREVIEW MODE</span>
          <span className="text-gray-800 text-sm">This is how your website will look</span>
          <Button 
            size="sm"
            className="font-semibold"
            style={{ backgroundColor: primaryColor }}
            onClick={() => navigate(createPageUrl('Dashboard') + `?id=${recordId}`)}
          >
            Activate Website — $39/month
          </Button>
        </div>
      </div>

      {/* SECTION 1: STICKY HEADER */}
      <header className={`fixed top-12 left-0 right-0 z-40 transition-all duration-300 ${
        isSticky ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {siteRequest.logo ? (
              <img src={siteRequest.logo} alt={siteRequest.company_name} className="h-12 w-auto" />
            ) : (
              <div className="text-2xl font-bold" style={{ color: isSticky ? primaryColor : 'white' }}>
                {siteRequest.company_name}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${siteRequest.phone}`} className={`hidden md:flex items-center gap-2 font-semibold ${
              isSticky ? 'text-gray-900' : 'text-white'
            }`}>
              <Phone className="w-4 h-4" />
              {siteRequest.phone}
            </a>
            <Button 
              className="font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              Get a Quote
            </Button>
          </div>
        </div>
      </header>

      {/* SECTION 2: HERO SECTION */}
      <section 
        className="relative h-screen flex items-center justify-center text-white"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {content.hero?.headline || `Professional ${siteRequest.service_types?.[0] || 'Cleaning'} Services in ${siteRequest.city}`}
          </h1>
          <p className="text-xl md:text-3xl mb-10 text-gray-200">
            {content.hero?.subheadline || `Trusted by homeowners and businesses across ${siteRequest.city}, ${siteRequest.state}`}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 font-bold rounded-lg"
              style={{ backgroundColor: primaryColor }}
            >
              Get Free Quote
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-10 py-7 font-bold rounded-lg bg-white text-gray-900 hover:bg-gray-100"
            >
              Call {siteRequest.phone}
            </Button>
          </div>

          {/* Trust Badges Below CTA */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {siteRequest.insured && (
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                <span className="font-semibold">Fully Insured</span>
              </div>
            )}
            {siteRequest.years_in_business > 0 && (
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                <span className="font-semibold">{siteRequest.years_in_business}+ Years</span>
              </div>
            )}
            {siteRequest.google_rating > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{siteRequest.google_rating} Star Rated</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: TRUST BAR */}
      <section className="py-8" style={{ backgroundColor: tertiaryColor }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-10 h-10" style={{ color: primaryColor }} />
              <span className="font-bold text-gray-900">Licensed & Insured</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-10 h-10" style={{ color: primaryColor }} />
              <span className="font-bold text-gray-900">Locally Owned</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Star className="w-10 h-10" style={{ color: primaryColor }} />
              <span className="font-bold text-gray-900">5-Star Rated</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-10 h-10" style={{ color: primaryColor }} />
              <span className="font-bold text-gray-900">Same-Day Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SERVICES GRID */}
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
            {siteRequest.service_types?.map((service, idx) => (
              <div 
                key={idx}
                className="group bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300"
                style={{ 
                  '--hover-shadow': `0 20px 60px ${primaryColor}40`
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 20px 60px ${primaryColor}40`}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {content.services?.[service] || `Expert ${service.toLowerCase()} solutions for your property.`}
                </p>
                <button 
                  className="font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                  style={{ color: primaryColor }}
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: ABOUT SECTION */}
      <section className="py-32 px-4" style={{ backgroundColor: tertiaryColor }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80"
                alt="About us"
                className="rounded-3xl shadow-2xl w-full h-[600px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                {content.about?.title || `Why Choose ${siteRequest.company_name}?`}
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {content.about?.text || `We're a trusted cleaning company serving ${siteRequest.city}, ${siteRequest.state}. Our team is dedicated to providing exceptional cleaning services with attention to detail and customer satisfaction. We use professional-grade equipment and eco-friendly products to ensure your space is spotless and safe.`}
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'EPA-Approved Cleaning Products',
                  'Background-Checked Staff',
                  'Satisfaction Guaranteed',
                  'Flexible Scheduling'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-lg">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: primaryColor }} />
                    <span className="text-gray-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 font-bold rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                Schedule Service
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE US */}
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
            {[
              { icon: '🏆', title: 'Quality Guarantee', desc: 'We stand behind our work with a 100% satisfaction guarantee' },
              { icon: '⚡', title: 'Fast & Reliable', desc: 'Same-day service available with flexible scheduling' },
              { icon: '💰', title: 'Fair Pricing', desc: 'Transparent quotes with no hidden fees' },
              { icon: '🧹', title: 'Eco-Friendly', desc: 'Green cleaning products safe for your family and pets' },
              { icon: '👨‍👩‍👧‍👦', title: 'Trusted Team', desc: 'Background-checked and trained professionals' },
              { icon: '📱', title: 'Easy Booking', desc: 'Book online or call us for immediate service' }
            ].map((benefit, idx) => (
              <div key={idx} className="text-center">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <span className="text-4xl">{benefit.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: TESTIMONIALS */}
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
            {[
              { name: 'Sarah Johnson', text: 'Outstanding service! My office has never looked better. The team is professional and thorough.', rating: 5 },
              { name: 'Mike Rodriguez', text: 'Reliable and affordable. They transformed our home. Highly recommend!', rating: 5 },
              { name: 'Emily Chen', text: 'Best cleaning service in town. Always on time and do an amazing job.', rating: 5 }
            ].map((testimonial, idx) => (
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

      {/* SECTION 8: CTA BANNER */}
      <section 
        className="py-24 px-4 text-white text-center"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready for a Spotless Space?
          </h2>
          <p className="text-2xl mb-10 text-white/90">
            Get your free quote today and experience the {siteRequest.company_name} difference
          </p>
          <Button 
            size="lg" 
            className="text-lg px-12 py-7 font-bold rounded-lg bg-white hover:bg-gray-100"
            style={{ color: primaryColor }}
          >
            Get Your Free Quote
          </Button>
        </div>
      </section>

      {/* SECTION 9: FOOTER */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Logo & Info */}
            <div>
              {siteRequest.logo ? (
                <img src={siteRequest.logo} alt={siteRequest.company_name} className="h-12 w-auto mb-4" />
              ) : (
                <div className="text-2xl font-bold mb-4">{siteRequest.company_name}</div>
              )}
              <p className="text-gray-400">
                Professional cleaning services in {siteRequest.city}, {siteRequest.state}
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                {siteRequest.service_types?.slice(0, 5).map((service, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  {siteRequest.phone}
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  {siteRequest.email}
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {siteRequest.city}, {siteRequest.state}
                </li>
              </ul>
            </div>

            {/* Service Areas */}
            <div>
              <h3 className="text-lg font-bold mb-4">Service Areas</h3>
              <p className="text-gray-400">
                Proudly serving {siteRequest.city} and surrounding areas
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} {siteRequest.company_name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}