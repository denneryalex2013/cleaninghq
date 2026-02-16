import React from 'react';
import { Button } from "@/components/ui/button";
import { Star, Shield, Award } from 'lucide-react';

export default function Hero({ 
  headline, 
  subheadline, 
  phone, 
  primaryColor,
  insured,
  yearsInBusiness,
  googleRating,
  reviewCount,
  reviewsVerified,
  backgroundImage
}) {
  // Image priority: user uploaded > scraped > fallback
  const heroImage = backgroundImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80';
  return (
    <section 
      className="relative h-screen flex items-center justify-center text-white"
      style={{ 
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {headline}
        </h1>
        <p className="text-xl md:text-3xl mb-10 text-gray-200">
          {subheadline}
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
            Call {phone}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-8 flex-wrap">
          {insured && (
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              <span className="font-semibold">Fully Insured</span>
            </div>
          )}
          {yearsInBusiness > 0 && (
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6" />
              <span className="font-semibold">{yearsInBusiness}+ Years</span>
            </div>
          )}
          {googleRating >= 4.5 && reviewsVerified && (
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{googleRating} Stars{reviewCount ? ` (${reviewCount} reviews)` : ''}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}