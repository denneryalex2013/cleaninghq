import React, { useEffect, useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles, Star, Shield, Phone, MapPin, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Preview() {
  const navigate = useNavigate();
  const [siteRequest, setSiteRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const recordId = urlParams.get('id');

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
  const secondaryColor = siteRequest.secondary_color || `${primaryColor}40`;
  const tertiaryColor = siteRequest.tertiary_color || '#f3f4f6';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Mode Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-gray-900" />
          <span className="font-bold text-gray-900">PREVIEW MODE</span>
          <span className="hidden md:inline text-gray-800">
            • This is how your website will look to visitors
          </span>
        </div>
      </div>

      {/* Preview URL Display */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ExternalLink className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Your website will be available at:</p>
                <p className="font-mono text-sm text-teal-600 font-semibold">
                  {siteRequest.preview_url}
                </p>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold px-8"
              onClick={() => navigate(createPageUrl('Dashboard') + `?id=${recordId}`)}
            >
              Activate My Website — $39/month
            </Button>
          </div>
        </div>
      </div>

      {/* Website Preview */}
      <div className="bg-white">
        {/* Hero Section */}
        <div 
          className="py-20 md:py-32 px-4"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 100%)` 
          }}
        >
          <div className="max-w-7xl mx-auto text-center">
            {siteRequest.logo && (
              <img 
                src={siteRequest.logo} 
                alt={siteRequest.company_name}
                className="h-16 md:h-20 w-auto mx-auto mb-6 object-contain"
              />
            )}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {siteRequest.company_name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional cleaning services you can trust. Serving {siteRequest.city}, {siteRequest.state}.
            </p>
            <Button 
              size="lg" 
              className="h-14 px-10 text-lg font-semibold"
              style={{ backgroundColor: primaryColor }}
            >
              Get a Free Quote
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        {(siteRequest.years_in_business || siteRequest.insured || siteRequest.google_rating) && (
          <div className="bg-gray-50 py-12 px-4 border-y border-gray-200">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {siteRequest.years_in_business > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                      <Sparkles className="w-8 h-8" style={{ color: primaryColor }} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{siteRequest.years_in_business}+</p>
                    <p className="text-gray-600">Years in Business</p>
                  </div>
                )}
                {siteRequest.insured && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                      <Shield className="w-8 h-8" style={{ color: primaryColor }} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">✓</p>
                    <p className="text-gray-600">Fully Insured</p>
                  </div>
                )}
                {siteRequest.google_rating > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                      <Star className="w-8 h-8" style={{ color: primaryColor }} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{siteRequest.google_rating} ★</p>
                    <p className="text-gray-600">Google Rating</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Services Section */}
        {siteRequest.service_types && siteRequest.service_types.length > 0 && (
          <div className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Our Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteRequest.service_types.map((service, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border-2 rounded-2xl p-8 hover:shadow-xl transition-all"
                    style={{ borderColor: tertiaryColor }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      <span className="text-2xl">✨</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service}</h3>
                    <p className="text-gray-600">
                      {siteRequest.generated_content?.services_descriptions?.[service] || 
                       `Professional ${service.toLowerCase()} services tailored to your needs.`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        <div className="py-20 px-4" style={{ backgroundColor: tertiaryColor }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose {siteRequest.company_name}?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {siteRequest.generated_content?.about?.text || 
               `We're a trusted cleaning company serving ${siteRequest.city}, ${siteRequest.state}. 
               Our team is dedicated to providing exceptional cleaning services with attention to 
               detail and customer satisfaction. We use professional-grade equipment and eco-friendly 
               products to ensure your space is spotless and safe.`}
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white text-center">
              <h2 className="text-4xl font-bold mb-4">Get Your Free Quote Today</h2>
              <p className="text-xl text-gray-300 mb-8">
                Ready to experience professional cleaning? Contact us now!
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold">{siteRequest.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">{siteRequest.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">{siteRequest.city}, {siteRequest.state}</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="h-14 px-10 text-lg font-semibold bg-white hover:bg-gray-100"
                style={{ color: primaryColor }}
              >
                Request a Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-teal-600 shadow-2xl py-4 px-4 md:hidden">
        <Button 
          className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold"
          onClick={() => navigate(createPageUrl('Dashboard') + `?id=${recordId}`)}
        >
          Activate — $39/month
        </Button>
      </div>
    </div>
  );
}