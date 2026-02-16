import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Star } from "lucide-react";

export default function Step3Trust({ formData, setFormData, onNext, onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Build trust with visitors</h2>
        <p className="text-gray-600">Share your credentials and experience</p>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Industries You Serve (Optional)
          </Label>
          <p className="text-xs text-gray-500 mb-3">Select all industries you specialize in to make your website appeal to those customers</p>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {[
              { value: 'Medical & Healthcare', desc: 'Patient safety & infection control' },
              { value: 'Industrial & Manufacturing', desc: 'Heavy machinery & worker safety' },
              { value: 'Legal & Professional Offices', desc: 'Confidentiality & professional image' },
              { value: 'Food Service & Hospitality', desc: 'Sanitation & pest prevention' },
              { value: 'Retail & Showroom', desc: 'Aesthetics & high foot traffic' },
              { value: 'Educational (Schools/Daycare)', desc: 'Germ reduction & non-toxic chemicals' },
              { value: 'Data Centers & IT', desc: 'Dust-free environments' },
              { value: 'Post-Construction (Commercial)', desc: 'Debris removal & safety' },
              { value: 'Gym & Fitness', desc: 'Odor control & sweat removal' }
            ].map((industry) => (
              <label
                key={industry.value}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                  formData.industries_served?.includes(industry.value)
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.industries_served?.includes(industry.value) || false}
                  onChange={(e) => {
                    const current = formData.industries_served || [];
                    const updated = e.target.checked
                      ? [...current, industry.value]
                      : current.filter(i => i !== industry.value);
                    setFormData({ ...formData, industries_served: updated });
                  }}
                  className="mt-1 w-4 h-4 text-teal-600 rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">{industry.value}</div>
                  <div className="text-xs text-gray-500">{industry.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="years_in_business" className="text-sm font-medium text-gray-700">
            Years in Business
          </Label>
          <Input
            id="years_in_business"
            type="number"
            min="0"
            value={formData.years_in_business || ''}
            onChange={(e) => setFormData({ ...formData, years_in_business: parseInt(e.target.value) || 0 })}
            placeholder="5"
            className="mt-1.5 h-12 text-base"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Are you insured?
          </Label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, insured: true })}
              className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                formData.insured === true
                  ? 'border-teal-600 bg-teal-50 text-teal-700'
                  : 'border-gray-200 hover:border-teal-300'
              }`}
            >
              ✓ Yes, We're Insured
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, insured: false })}
              className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                formData.insured === false
                  ? 'border-teal-600 bg-teal-50 text-teal-700'
                  : 'border-gray-200 hover:border-teal-300'
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="google_rating" className="text-sm font-medium text-gray-700">
            Google Rating (Optional)
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="google_rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.google_rating || ''}
              onChange={(e) => setFormData({ ...formData, google_rating: parseFloat(e.target.value) || 0 })}
              placeholder="4.8"
              className="h-12 text-base pl-10"
            />
            <Star className="w-5 h-5 text-yellow-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">Enter your Google Business rating (1-5)</p>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full h-12 text-base font-semibold"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}