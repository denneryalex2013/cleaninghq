import React, { useEffect, useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Navigation from '../components/preview/Navigation';
import Hero from '../components/preview/Hero';
import TrustBar from '../components/preview/TrustBar';
import Services from '../components/preview/Services';
import About from '../components/preview/About';
import Benefits from '../components/preview/Benefits';
import Testimonials from '../components/preview/Testimonials';
import CTA from '../components/preview/CTA';
import Footer from '../components/preview/Footer';
import ServicePage from '../components/preview/ServicePage';
import QuotePage from '../components/preview/QuotePage';
import ContactPage from '../components/preview/ContactPage';

export default function Preview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [siteRequest, setSiteRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const recordId = urlParams.get('id');
  const pageParam = urlParams.get('page');

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

  // Handle ?page= query parameter routing
  useEffect(() => {
    if (pageParam && location.pathname === '/Preview') {
      navigate(`/Preview/${pageParam}`, { replace: true });
    }
  }, [pageParam, location.pathname, navigate]);

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
  const pages = content.pages || {};

  // Prepare component props
  const heroProps = {
    headline: content.hero?.headline || `Professional ${siteRequest.service_types?.[0] || 'Cleaning'} Services in ${siteRequest.city}`,
    subheadline: content.hero?.subheadline || `Trusted by homeowners and businesses across ${siteRequest.city}, ${siteRequest.state}`,
    phone: siteRequest.phone,
    primaryColor,
    insured: siteRequest.insured,
    yearsInBusiness: siteRequest.years_in_business,
    googleRating: siteRequest.google_rating,
    reviewCount: siteRequest.google_review_count,
    reviewsVerified: siteRequest.reviews_verified,
    backgroundImage: siteRequest.hero_image_url || siteRequest.gallery_images?.[0]
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
    logo: siteRequest.logo_url || siteRequest.logo,
    tagline: content.footer?.tagline,
    services: siteRequest.service_types || [],
    phone: siteRequest.phone,
    email: siteRequest.email,
    city: siteRequest.city,
    state: siteRequest.state
  };

  const citySlug = siteRequest.city.toLowerCase().replace(/\s+/g, '-');
  
  const getServiceRoute = (service) => {
    const serviceSlug = service.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '');
    return `${serviceSlug}-${citySlug}`;
  };

  // Check if new multi-page structure exists
  const servicePages = content.pages?.services || [];
  const hasNewStructure = servicePages.length > 0;

  const HomePage = () => (
    <>
      <Hero {...heroProps} />
      <TrustBar primaryColor={primaryColor} tertiaryColor={tertiaryColor} />
      <Services {...servicesProps} />
      <About {...aboutProps} image={siteRequest.gallery_images?.[1]} />
      <Benefits benefits={content.benefits} primaryColor={primaryColor} />
      <Testimonials 
        testimonials={content.testimonials} 
        googleReviews={siteRequest.google_reviews}
        reviewsVerified={siteRequest.reviews_verified}
        tertiaryColor={tertiaryColor} 
      />
      <CTA {...ctaProps} />
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* PREVIEW MODE BANNER */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 py-3 px-4 text-center sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
          <span className="font-bold text-gray-900">✨ PREVIEW MODE</span>
          <span className="text-gray-800 text-sm">This is how your website will look</span>
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant="outline"
              className="font-semibold bg-white"
              onClick={() => navigate(createPageUrl('Editor') + `?id=${recordId}`)}
            >
              Edit with AI
            </Button>
            <Button 
              size="sm"
              className="font-semibold"
              style={{ backgroundColor: primaryColor }}
              onClick={() => navigate(createPageUrl('Dashboard') + `?id=${recordId}`)}
            >
              Activate — $39/month
            </Button>
          </div>
        </div>
      </div>

      <Navigation 
        companyName={siteRequest.company_name}
        logo={siteRequest.logo_url || siteRequest.logo}
        phone={siteRequest.phone}
        primaryColor={primaryColor}
        services={siteRequest.service_types || []}
        city={siteRequest.city}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* New structure: service pages with slugs */}
        {hasNewStructure && servicePages.map((servicePage) => {
          const slug = servicePage.slug?.startsWith('/') ? servicePage.slug.slice(1) : servicePage.slug;
          
          return (
            <Route 
              key={servicePage.slug}
              path={`/${slug}`} 
              element={
                <ServicePage
                  service={servicePage.seo?.title || servicePage.hero?.headline || 'Service'}
                  content={servicePage}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  tertiaryColor={tertiaryColor}
                  city={siteRequest.city}
                  state={siteRequest.state}
                  companyName={siteRequest.company_name}
                  heroImage={servicePage.hero?.image || siteRequest.hero_image_url || siteRequest.gallery_images?.[0]}
                  testimonials={content.testimonials}
                  reviewsVerified={siteRequest.reviews_verified}
                  googleReviews={siteRequest.google_reviews}
                />
              } 
            />
          );
        })}

        {/* Legacy structure: generate routes from service_types */}
        {!hasNewStructure && siteRequest.service_types?.map((service) => {
          const route = getServiceRoute(service);
          const contentKey = service.toLowerCase().replace(/\s+/g, '_').replace(/\//g, '');
          
          return (
            <Route 
              key={service}
              path={`/${route}`} 
              element={
                <ServicePage
                  service={service}
                  content={pages[contentKey]}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  tertiaryColor={tertiaryColor}
                  city={siteRequest.city}
                  state={siteRequest.state}
                  companyName={siteRequest.company_name}
                  heroImage={siteRequest.hero_image_url || siteRequest.gallery_images?.[0]}
                  testimonials={content.testimonials}
                  reviewsVerified={siteRequest.reviews_verified}
                  googleReviews={siteRequest.google_reviews}
                />
              } 
            />
          );
        })}

        <Route 
          path="/get-a-quote" 
          element={
            <QuotePage
              siteRequestId={siteRequest.id}
              services={siteRequest.service_types || []}
              primaryColor={primaryColor}
              tertiaryColor={tertiaryColor}
              companyName={siteRequest.company_name}
              phone={siteRequest.phone}
            />
          } 
        />

        <Route 
          path="/contact" 
          element={
            <ContactPage
              companyName={siteRequest.company_name}
              phone={siteRequest.phone}
              email={siteRequest.email}
              city={siteRequest.city}
              state={siteRequest.state}
              primaryColor={primaryColor}
              tertiaryColor={tertiaryColor}
            />
          } 
        />
      </Routes>

      <Footer {...footerProps} />
    </div>
  );
}