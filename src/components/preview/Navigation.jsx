import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Phone, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation({ companyName, logo, phone, primaryColor, services = [] }) {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceRoutes = {
    'Commercial Cleaning': '/commercial-cleaning',
    'Residential Cleaning': '/residential-cleaning',
    'Post-Construction Cleaning': '/post-construction-cleaning',
    'Office Cleaning': '/office-cleaning',
    'Medical Cleaning': '/medical-cleaning',
    'Janitorial Services': '/janitorial-services',
    'Airbnb Cleaning': '/airbnb-cleaning',
    'Move-In / Move-Out Cleaning': '/move-in-move-out-cleaning',
    'Floor Care': '/floor-care',
    'Carpet Cleaning': '/carpet-cleaning',
    'Pressure Washing': '/pressure-washing',
    'Window Cleaning': '/window-cleaning'
  };

  return (
    <header className={`fixed top-12 left-0 right-0 z-40 transition-all duration-300 ${
      isSticky ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {logo ? (
            <img src={logo} alt={companyName} className="h-12 w-auto" />
          ) : (
            <div className="text-2xl font-bold" style={{ color: isSticky ? primaryColor : 'white' }}>
              {companyName}
            </div>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`font-semibold hover:opacity-70 transition-opacity ${
              isSticky ? 'text-gray-900' : 'text-white'
            }`}
          >
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className={`font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity ${
              isSticky ? 'text-gray-900' : 'text-white'
            }`}>
              Services <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {services.map((service) => (
                <DropdownMenuItem key={service} asChild>
                  <Link to={serviceRoutes[service] || '#'}>
                    {service}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            to="/contact" 
            className={`font-semibold hover:opacity-70 transition-opacity ${
              isSticky ? 'text-gray-900' : 'text-white'
            }`}
          >
            Contact
          </Link>

          <a href={`tel:${phone}`} className={`hidden lg:flex items-center gap-2 font-semibold ${
            isSticky ? 'text-gray-900' : 'text-white'
          }`}>
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        </nav>

        <Link to="/get-a-quote">
          <Button 
            className="font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            Get a Quote
          </Button>
        </Link>
      </div>
    </header>
  );
}