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
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Preview Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find that website. It may have been deleted or the link is incorrect.</p>
          <Button onClick={() => navigate(createPageUrl('Home'))}>
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  // Check if content is ready - prevent crashes from missing data
  const content = siteRequest.generated_content || {};
  const pages = content.pages || {};
  


  const primaryColor = siteRequest.primary_color || '#14b8a6';
  const secondaryColor = siteRequest.secondary_color || '#0ea5e9';
  const tertiaryColor = siteRequest.tertiary_color || '#f3f4f6';

  // Check service pages structure FIRST
  const servicePages = content.pages?.services || [];
  const hasNewStructure = servicePages.length > 0;

  // Prepare component props
  const heroProps = {
    headline: pages.homepage?.hero?.headline || content.hero?.headline || `Professional ${siteRequest.service_types?.[0] || 'Cleaning'} Services in ${siteRequest.city}`,
    subheadline: pages.homepage?.hero?.subheadline || content.hero?.subheadline || `Trusted by homeowners and businesses across ${siteRequest.city}, ${siteRequest.state}`,
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
    services: hasNewStructure 
      ? servicePages.map(sp => ({
          title: sp.service_name,
          description: sp.intro?.text?.substring(0, 150) + '...' || `Expert ${sp.service_name.toLowerCase()} solutions for your property.`,
          slug: sp.slug
        }))
      : siteRequest.service_types?.map(service => {
          const citySlug = siteRequest.city.toLowerCase().replace(/\s+/g, '-');
          const serviceSlug = service.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '');
          return {
            title: service,
            description: content.services?.[service] || `Expert ${service.toLowerCase()} solutions for your property.`,
            slug: `${serviceSlug}-${citySlug}`
          };
        }) || [],
    primaryColor
  };

  const aboutProps = {
    title: pages.homepage?.about?.headline || content.about?.title || `Why Choose ${siteRequest.company_name}?`,
    text: pages.homepage?.about?.text || content.about?.text || `We're a trusted cleaning company serving ${siteRequest.city}, ${siteRequest.state}. Our team is dedicated to providing exceptional cleaning services with attention to detail and customer satisfaction.`,
    primaryColor,
    tertiaryColor
  };

  const ctaProps = {
    headline: pages.homepage?.cta?.headline || content.cta?.headline || 'Ready for a Spotless Space?',
    subheadline: pages.homepage?.cta?.subheadline || content.cta?.subheadline || `Get your free quote today and experience the ${siteRequest.company_name} difference`,
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

  const HomePage = () => (
    <>
      <Hero {...heroProps} />
      <TrustBar primaryColor={primaryColor} tertiaryColor={tertiaryColor} />
      <Services {...servicesProps} />
      <About {...aboutProps} image={siteRequest.gallery_images?.[1]} />
      <Benefits benefits={pages.homepage?.benefits || content.benefits} primaryColor={primaryColor} />
      <Testimonials 
        testimonials={pages.homepage?.testimonials || content.testimonials} 
        googleReviews={siteRequest.google_reviews}
        reviewsVerified={siteRequest.reviews_verified}
        tertiaryColor={tertiaryColor} 
      />
      <CTA {...ctaProps} />
    </>
  );

  // Determine which page to show based on ?page= parameter
  const renderPage = () => {
    if (!pageParam) return <HomePage />;

    // Check if it's a service page
    if (hasNewStructure) {
      const servicePage = servicePages.find(sp => sp.slug === pageParam);
      if (servicePage) {
        return (
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
        );
      }
    }

    // Contact page
    if (pageParam === 'contact') {
      return (
        <ContactPage
          companyName={siteRequest.company_name}
          phone={siteRequest.phone}
          email={siteRequest.email}
          city={siteRequest.city}
          state={siteRequest.state}
          primaryColor={primaryColor}
          tertiaryColor={tertiaryColor}
        />
      );
    }

    // Quote page
    if (pageParam === 'get-a-quote') {
      return (
        <QuotePage
          siteRequestId={siteRequest.id}
          services={siteRequest.service_types || []}
          primaryColor={primaryColor}
          tertiaryColor={tertiaryColor}
          companyName={siteRequest.company_name}
          phone={siteRequest.phone}
        />
      );
    }

    // 404 - unknown page
    return <HomePage />;
  };

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

      {renderPage()}

      <Footer {...footerProps} />
    </div>
  );
}