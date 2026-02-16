import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from 'lucide-react';

export default function QuotePage({ siteRequestId, services, primaryColor, tertiaryColor, companyName, phone }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service_needed: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await base44.entities.Lead.create({
        ...formData,
        site_request_id: siteRequestId
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Lead submission error:', error);
      alert('Failed to submit. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center" style={{ backgroundColor: tertiaryColor }}>
        <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <CheckCircle2 className="w-12 h-12" style={{ color: primaryColor }} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-xl text-gray-700 mb-8">
            We've received your quote request. Our team will contact you within 24 hours.
          </p>
          <p className="text-gray-600">
            Need immediate assistance? Call us at{' '}
            <a href={`tel:${phone}`} className="font-bold" style={{ color: primaryColor }}>
              {phone}
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4" style={{ backgroundColor: tertiaryColor }}>
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get a Free Quote</h1>
          <p className="text-xl text-gray-600 mb-8">
            Fill out the form below and we'll get back to you with a custom quote within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Smith"
                className="mt-1.5 h-12"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="mt-1.5 h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="mt-1.5 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="service">Service Needed *</Label>
              <Select
                value={formData.service_needed}
                onValueChange={(value) => setFormData({ ...formData, service_needed: value })}
                required
              >
                <SelectTrigger className="mt-1.5 h-12">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Additional Details</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your cleaning needs..."
                className="mt-1.5 min-h-32"
              />
            </div>

            <Button 
              type="submit"
              className="w-full h-14 text-lg font-bold"
              style={{ backgroundColor: primaryColor }}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Get My Free Quote'}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              By submitting this form, you agree to be contacted by {companyName}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}