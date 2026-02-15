import React from 'react';
import { Shield, MapPin, Star, Clock } from 'lucide-react';

export default function TrustBar({ primaryColor, tertiaryColor, items }) {
  const defaultItems = [
    { icon: Shield, text: 'Licensed & Insured' },
    { icon: MapPin, text: 'Locally Owned' },
    { icon: Star, text: '5-Star Rated' },
    { icon: Clock, text: 'Same-Day Service' }
  ];

  const trustItems = items || defaultItems;

  return (
    <section className="py-8" style={{ backgroundColor: tertiaryColor }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {trustItems.map((item, idx) => {
            const Icon = item.icon || Shield;
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <Icon className="w-10 h-10" style={{ color: primaryColor }} />
                <span className="font-bold text-gray-900">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}