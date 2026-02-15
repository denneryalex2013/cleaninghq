import React, { useEffect, useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Hero from '../components/preview/Hero';
import TrustBar from '../components/preview/TrustBar';
import Services from '../components/preview/Services';
import About from '../components/preview/About';
import Benefits from '../components/preview/Benefits';
import Testimonials from '../components/preview/Testimonials';
import CTA from '../components/preview/CTA';
import Footer from '../components/preview/Footer';

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

  // Prepare component props
  const heroProps = {
    headline: content.hero?.headline || `Professional ${siteRequest.service_types?.[0] || 'Cleaning'} Services in ${siteRequest.city}`,
    subheadline: content.hero?.subheadline || `Trusted by homeowners and businesses across ${siteRequest.city}, ${siteRequest.state}`,
    phone: siteRequest.phone,
    primaryColor,
    insured: siteRequest.insured,
    yearsInBusiness: siteRequest.years_in_business,
    googleRating: siteRequest.google_rating
  };

  const servicesProps = {
    services: siteRequest.service_types?.map(service => ({
      title: service,
      description: content.services?.[service] || `Expert ${service.toLowerCase()} solutions for your property.`
    })) || [],
    primaryColor
  };

  const aboutProps = {
    title: content.about?.title || `Why Choose ${siteRequest.company_name}?`,
    text: content.about?.text || `We're a trusted cleaning company serving ${siteRequest.city}, ${siteRequest.state}. Our team is dedicated to providing exceptional cleaning services with attention to detail and customer satisfaction.`,
    primaryColor,
    tertiaryColor
  };

  const ctaProps = {
    headline: content.cta?.headline || 'Ready for a Spotless Space?',
    subheadline: content.cta?.subheadline || `Get your free quote today and experience the ${siteRequest.company_name} difference`,
    primaryColor,
    secondaryColor
  };

  const footerProps = {
    companyName: siteRequest.company_name,
    logo: siteRequest.logo,
    tagline: content.footer?.tagline,
    services: siteRequest.service_types || [],
    phone: siteRequest.phone,
    email: siteRequest.email,
    city: siteRequest.city,
    state: siteRequest.state
  };

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

      <Hero {...heroProps} />
      <TrustBar primaryColor={primaryColor} tertiaryColor={tertiaryColor} />
      <Services {...servicesProps} />
      <About {...aboutProps} />
      <Benefits benefits={content.benefits} primaryColor={primaryColor} />
      <Testimonials testimonials={content.testimonials} tertiaryColor={tertiaryColor} />
      <CTA {...ctaProps} />
      <Footer {...footerProps} />
    </div>
  );
}