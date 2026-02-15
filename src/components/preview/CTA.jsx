import React from 'react';
import { Button } from "@/components/ui/button";

export default function CTA({ headline, subheadline, primaryColor, secondaryColor }) {
  return (
    <section 
      className="py-24 px-4 text-white text-center"
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          {headline}
        </h2>
        <p className="text-2xl mb-10 text-white/90">
          {subheadline}
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
  );
}