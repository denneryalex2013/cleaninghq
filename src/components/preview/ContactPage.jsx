import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage({ 
  companyName, 
  phone, 
  email, 
  city, 
  state,
  primaryColor,
  tertiaryColor
}) {
  return (
    <div className="min-h-screen pt-24 px-4" style={{ backgroundColor: tertiaryColor }}>
      <div className="max-w-7xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4" itemProp="headline">Contact Us</h1>
          <p className="text-xl text-gray-600">Get in touch with our team today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Phone className="w-7 h-7" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
                  <a 
                    href={`tel:${phone}`}
                    className="text-lg hover:opacity-70 transition-opacity"
                    style={{ color: primaryColor }}
                  >
                    {phone}
                  </a>
                  <p className="text-gray-600 text-sm mt-1">Mon-Fri 8am-6pm</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Mail className="w-7 h-7" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                  <a 
                    href={`mailto:${email}`}
                    className="text-lg hover:opacity-70 transition-opacity"
                    style={{ color: primaryColor }}
                  >
                    {email}
                  </a>
                  <p className="text-gray-600 text-sm mt-1">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <MapPin className="w-7 h-7" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Service Area</h3>
                  <p className="text-lg text-gray-700">{city}, {state}</p>
                  <p className="text-gray-600 text-sm mt-1">& surrounding areas</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Clock className="w-7 h-7" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Business Hours</h3>
                  <div className="space-y-1 text-gray-700">
                    <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Request a free quote and let us show you why {companyName} is the best choice for your cleaning needs.
            </p>
            <Link to="/get-a-quote">
              <Button 
                size="lg" 
                className="w-full text-lg px-10 py-7 font-bold rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                Get a Free Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}