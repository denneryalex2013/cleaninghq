import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ 
  companyName, 
  logo, 
  tagline, 
  services, 
  phone, 
  email, 
  city, 
  state 
}) {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Info */}
          <div>
            {logo ? (
              <img src={logo} alt={companyName} className="h-12 w-auto mb-4" />
            ) : (
              <div className="text-2xl font-bold mb-4">{companyName}</div>
            )}
            <p className="text-gray-400">
              {tagline || `Professional cleaning services in ${city}, ${state}`}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              {services.slice(0, 5).map((service, idx) => (
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
                {phone}
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                {email}
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                {city}, {state}
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-lg font-bold mb-4">Service Areas</h3>
            <p className="text-gray-400">
              Proudly serving {city} and surrounding areas
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}