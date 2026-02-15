import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';

export default function About({ 
  title, 
  text, 
  primaryColor, 
  tertiaryColor,
  image = 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80'
}) {
  const features = [
    'EPA-Approved Cleaning Products',
    'Background-Checked Staff',
    'Satisfaction Guaranteed',
    'Flexible Scheduling'
  ];

  return (
    <section className="py-32 px-4" style={{ backgroundColor: tertiaryColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src={image}
              alt="About us"
              className="rounded-3xl shadow-2xl w-full h-[600px] object-cover"
            />
          </div>
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              {title}
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {text}
            </p>
            <ul className="space-y-4 mb-8">
              {features.map((item, idx) => (
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
  );
}