import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet';
import { Sparkles, Clock, Smartphone, AlertCircle, CheckCircle2, Zap, TrendingUp, Phone, ArrowRight, Star, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1587538159239642');
            fbq('track', 'PageView');
          `}
        </script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=1587538159239642&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </Helmet>
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSticky ? 'bg-[#002147] shadow-lg py-3' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="text-white font-bold text-xl">CleaningHQ</div>
          <div className="flex items-center gap-4">
            <a href="tel:+16168280705" className="flex items-center gap-2 text-white hover:text-[#28A745] transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-semibold">(616) 828-0705</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#002147] via-[#003366] to-[#002147] pt-32 pb-20 md:pt-40 md:pb-32 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#28A745] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#28A745] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Get a Professional Cleaning Website That Books Jobs While You Sleep
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                Built for cleaners by pros. Launch in 60 seconds. No tech skills, no big fees, just more customers.
              </p>
              
              <Link to={createPageUrl('Start')}>
                <Button className="h-16 px-10 text-lg font-bold bg-[#28A745] hover:bg-[#218838] text-white shadow-2xl hover:shadow-[#28A745]/50 transition-all hover:scale-105 rounded-full">
                  🚀 Generate My Website
                </Button>
              </Link>
              <p className="text-sm text-gray-400 mt-3">
                No credit card required
              </p>

              {/* Social Proof */}
              <div className="mt-10 flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-[#28A745] border-2 border-white flex items-center justify-center text-white font-bold">J</div>
                    <div className="w-10 h-10 rounded-full bg-[#28A745] border-2 border-white flex items-center justify-center text-white font-bold">M</div>
                    <div className="w-10 h-10 rounded-full bg-[#28A745] border-2 border-white flex items-center justify-center text-white font-bold">S</div>
                  </div>
                  <p className="text-gray-300 font-semibold">Join 500+ Cleaning Companies</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-[#28A745] text-[#28A745]" />
                  ))}
                  <span className="ml-2 text-gray-300 font-semibold">5-Star Trustpilot</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Mockup */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80" 
                    alt="Cleaning professional with website dashboard"
                    className="rounded-2xl w-full h-auto shadow-xl"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl">
                    <p className="text-sm text-gray-600 mb-1">Bookings This Week</p>
                    <p className="text-3xl font-bold text-[#002147]">+47</p>
                    <p className="text-sm text-[#28A745] font-semibold mt-1">↑ 32% increase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pain Points Section */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#002147] mb-4">
            Sound Familiar?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Most cleaning businesses struggle with the same problems
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-red-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Tech Frustration</h3>
              <p className="text-gray-600 leading-relaxed">
                Wrestling with complicated website builders that take weeks to figure out. You're a cleaner, not a web developer.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-orange-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Missed Leads</h3>
              <p className="text-gray-600 leading-relaxed">
                Potential customers find you on Google but bounce because you don't have a professional website. Money walking away.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-yellow-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Looking Unprofessional</h3>
              <p className="text-gray-600 leading-relaxed">
                Your Facebook page isn't cutting it anymore. Customers expect a real website before they trust you with their space.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#002147] mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Get your professional website in 3 simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Pick Your Niche',
                description: 'Select your cleaning specialty — commercial, residential, or post-construction.',
                icon: '🏢'
              },
              {
                step: '2',
                title: 'AI Generates Your Content',
                description: 'Our AI creates professional copy, images, and layout tailored to your business.',
                icon: '✨'
              },
              {
                step: '3',
                title: 'Go Live & Get Booked',
                description: 'Your website is live instantly. Start accepting bookings and watch your business grow.',
                icon: '🚀'
              }
            ].map((item) => (
              <div key={item.step} className="relative">
                {/* Glassmorphism Card */}
                <div className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-6xl mb-6">{item.icon}</div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-[#002147] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#002147] mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to={createPageUrl('Start')}>
              <Button className="h-14 px-10 text-lg font-bold bg-[#28A745] hover:bg-[#218838] text-white shadow-xl rounded-full">
                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section with Glassmorphism */}
      <div className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#002147] mb-16">
            Everything You Need to Succeed
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📱', title: 'Mobile Ready', desc: 'Perfect on every device' },
              { icon: '⚡', title: 'Instant Bookings', desc: 'Capture leads 24/7' },
              { icon: '🎨', title: 'Your Branding', desc: 'Custom colors & logo' },
              { icon: '🔍', title: 'SEO Optimized', desc: 'Get found on Google' },
              { icon: '💬', title: 'AI Chat Editor', desc: 'Update anytime in seconds' },
              { icon: '🔒', title: 'Secure & Fast', desc: 'Enterprise-grade hosting' }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-2xl hover:bg-white/80 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#002147] mb-2 group-hover:text-[#28A745] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
                <CheckCircle2 className="w-6 h-6 text-[#28A745] mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#002147] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Everything included. No hidden fees. Cancel anytime.
          </p>

          <div className="bg-gradient-to-br from-[#002147] to-[#003366] rounded-3xl p-12 shadow-2xl border-4 border-[#28A745] relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-[#28A745] text-white px-4 py-2 rounded-full text-sm font-bold">
              BEST VALUE
            </div>
            
            <div className="text-white">
              <p className="text-xl font-semibold mb-4">All-Inclusive</p>
              <div className="flex items-baseline justify-center mb-6">
                <span className="text-6xl md:text-7xl font-bold">$39</span>
                <span className="text-2xl text-gray-300 ml-2">/month</span>
              </div>
              
              <div className="space-y-3 mb-8 text-left max-w-sm mx-auto">
                {[
                  'AI-Generated Professional Website',
                  'Unlimited Updates with AI Chat',
                  'Mobile-Optimized Design',
                  'SEO & Fast Hosting',
                  'Contact Forms & Lead Capture',
                  'Custom Domain Included',
                  'No Setup Fees',
                  'Cancel Anytime'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#28A745] flex-shrink-0" />
                    <span className="text-gray-200">{item}</span>
                  </div>
                ))}
              </div>

              <Link to={createPageUrl('Start')}>
                <Button className="h-16 px-12 text-lg font-bold bg-[#28A745] hover:bg-[#218838] text-white shadow-2xl hover:shadow-[#28A745]/50 transition-all hover:scale-105 rounded-full w-full md:w-auto">
                  🚀 Generate My Website
                </Button>
              </Link>
              <p className="text-sm text-gray-400 mt-4">
                No credit card required • 60-second setup
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#002147] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Everything you need to know
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-2xl px-6 border-none shadow-md">
              <AccordionTrigger className="text-lg font-semibold text-[#002147] hover:text-[#28A745]">
                Is it hard to change my website later?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Not at all! Our AI Chat Editor lets you make changes by simply typing what you want. 
                Say "change my phone number to 555-1234" or "add carpet cleaning to my services" and it happens instantly. 
                No technical skills needed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-2xl px-6 border-none shadow-md">
              <AccordionTrigger className="text-lg font-semibold text-[#002147] hover:text-[#28A745]">
                Is it SEO friendly?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Yes! Every website is built with SEO best practices. Fast loading speeds, mobile optimization, 
                clean code, and proper meta tags. We make sure Google can find you and your customers can too.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-2xl px-6 border-none shadow-md">
              <AccordionTrigger className="text-lg font-semibold text-[#002147] hover:text-[#28A745]">
                What if I already have a website?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Perfect! You can enter your existing website URL during setup and our AI will use it as inspiration 
                to create an even better version. We'll keep what works and upgrade the rest.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-2xl px-6 border-none shadow-md">
              <AccordionTrigger className="text-lg font-semibold text-[#002147] hover:text-[#28A745]">
                Can I cancel anytime?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Absolutely. No contracts, no cancellation fees. If you decide CleaningHQ isn't right for you, 
                you can cancel with one click from your dashboard. We only want happy customers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white rounded-2xl px-6 border-none shadow-md">
              <AccordionTrigger className="text-lg font-semibold text-[#002147] hover:text-[#28A745]">
                Do you provide support?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Yes! Our support team is here to help via email and chat. Plus, the AI editor makes most 
                questions unnecessary — just tell it what you want and it handles the technical stuff.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-[#002147] to-[#003366]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Grow Your Cleaning Business?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join 500+ cleaning companies already booking more jobs with CleaningHQ
          </p>
          <Link to={createPageUrl('Start')}>
            <Button className="h-16 px-12 text-lg font-bold bg-[#28A745] hover:bg-[#218838] text-white shadow-2xl hover:shadow-[#28A745]/50 transition-all hover:scale-105 rounded-full">
              🚀 Generate My Website — Free Preview
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required • 60-second setup
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#001529] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2026 CleaningHQ. All rights reserved. Built for cleaning professionals who want to grow.</p>
        </div>
      </div>
      </div>
      </>
      );
      }