import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Smartphone, XCircle, CheckCircle2, Zap, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50 to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Website Builder
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Get a Professional Cleaning Website in{' '}
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              60 Seconds
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            More booked jobs. More trust. No tech skills needed.
          </p>

          <Link to={createPageUrl('WebsiteGenerator')}>
            <Button className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-xl hover:shadow-2xl transition-all">
              🚀 Generate My Website
            </Button>
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Cancel anytime
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Built Instantly</h3>
            <p className="text-gray-600 text-sm">Your website is ready in under 60 seconds using AI</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Cleaning Industry Specific</h3>
            <p className="text-gray-600 text-sm">Designed specifically for cleaning companies</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Mobile Optimized</h3>
            <p className="text-gray-600 text-sm">Looks perfect on all devices and screen sizes</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">More Bookings</h3>
            <p className="text-gray-600 text-sm">Convert more visitors into paying customers</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-xl text-gray-600">
              Professional features included in every website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎨', title: 'Custom Branding', desc: 'Your colors, your logo, your style' },
              { icon: '📱', title: 'Contact Forms', desc: 'Capture leads 24/7 automatically' },
              { icon: '⭐', title: 'Trust Badges', desc: 'Show credentials and reviews' },
              { icon: '🚀', title: 'Fast Loading', desc: 'Optimized for speed and SEO' },
              { icon: '🔧', title: 'Easy Updates', desc: 'Change content anytime with AI chat' },
              { icon: '💰', title: 'Affordable', desc: 'Just $39/month, cancel anytime' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-8">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 md:py-28 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get More Clients?
          </h2>
          <p className="text-xl text-teal-100 mb-10">
            Join hundreds of cleaning companies growing with CleaningHQ
          </p>
          <Link to={createPageUrl('WebsiteGenerator')}>
            <Button className="h-16 px-12 text-lg font-semibold bg-white text-teal-600 hover:bg-gray-50 shadow-xl">
              Get Started Now — Free Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2026 CleaningHQ. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}