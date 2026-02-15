import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Building2, Mail, Phone, MapPin, Briefcase, Shield, Palette } from "lucide-react";

export default function Step5Confirmation({ formData, onSubmit, onBack, isSubmitting }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review your information</h2>
        <p className="text-gray-600">Everything look good? Let's generate your website!</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
        <div className="flex gap-4">
          <Building2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Company</p>
            <p className="text-base font-semibold text-gray-900 mt-1">{formData.company_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <Mail className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base font-semibold text-gray-900 mt-1">{formData.email}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Phone className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-base font-semibold text-gray-900 mt-1">{formData.phone}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <MapPin className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {formData.city}, {formData.state}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Briefcase className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Services</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.service_types?.map((service) => (
                <span
                  key={service}
                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        {(formData.years_in_business || formData.insured !== undefined || formData.google_rating) && (
          <div className="flex gap-4">
            <Shield className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Trust & Credentials</p>
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                {formData.years_in_business > 0 && (
                  <p>• {formData.years_in_business} years in business</p>
                )}
                {formData.insured !== undefined && (
                  <p>• {formData.insured ? 'Insured' : 'Not insured'}</p>
                )}
                {formData.google_rating > 0 && (
                  <p>• {formData.google_rating} ⭐ Google rating</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Palette className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Brand Colors</p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: formData.primary_color }}
                />
                <div>
                  <p className="text-xs text-gray-500">Primary</p>
                  <p className="text-sm font-medium text-gray-900">{formData.primary_color}</p>
                </div>
              </div>
              {formData.secondary_color && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: formData.secondary_color }}
                  />
                  <div>
                    <p className="text-xs text-gray-500">Secondary</p>
                    <p className="text-sm font-medium text-gray-900">{formData.secondary_color}</p>
                  </div>
                </div>
              )}
              {formData.tertiary_color && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: formData.tertiary_color }}
                  />
                  <div>
                    <p className="text-xs text-gray-500">Tertiary</p>
                    <p className="text-sm font-medium text-gray-900">{formData.tertiary_color}</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Style:</strong> {formData.style}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full h-12 text-base font-semibold"
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600"
        >
          {isSubmitting ? 'Generating...' : '🚀 Generate My Website'}
        </Button>
      </div>
    </div>
  );
}