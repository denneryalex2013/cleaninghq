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

export default function Navigation({ companyName, logo, phone, primaryColor, services = [], city = '' }) {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const recordId = urlParams.get('id');

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  
  const getServiceRoute = (service) => {
    const serviceSlug = service.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '');
    return `#${serviceSlug}-${citySlug}`;
  };

  return (
    <header className={`fixed top-12 left-0 right-0 z-40 transition-all duration-300 ${
      isSticky ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href={recordId ? `?id=${recordId}` : '/'} className="flex items-center gap-3">
          {logo ? (
            <img src={logo} alt={companyName} className="h-12 w-auto" />
          ) : (
            <div className="text-2xl font-bold" style={{ color: isSticky ? primaryColor : 'white' }}>
              {companyName}
            </div>
          )}
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <a 
            href={recordId ? `?id=${recordId}` : '/'} 
            className={`font-semibold hover:opacity-70 transition-opacity ${
              isSticky ? 'text-gray-900' : 'text-white'
            }`}
          >
            Home
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger className={`font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity ${
              isSticky ? 'text-gray-900' : 'text-white'
            }`}>
              Services <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {services.map((service) => (
                <DropdownMenuItem key={service} asChild>
                  <a href={getServiceRoute(service)}>
                    {service}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <a 
            href={recordId ? `?id=${recordId}&page=contact` : '?page=contact'} 
            className={`font-semibold hover:opacity-70 transition-opacity ${
              isSticky ? 'text-gray-900' : 'text-white'
            }`}
          >
            Contact
          </a>

          <a href={`tel:${phone}`} className={`hidden lg:flex items-center gap-2 font-semibold ${
            isSticky ? 'text-gray-900' : 'text-white'
          }`}>
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        </nav>

        <a href={recordId ? `?id=${recordId}&page=get-a-quote` : '?page=get-a-quote'}>
          <Button 
            className="font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            Get a Quote
          </Button>
        </a>
      </div>
    </header>
  );
}