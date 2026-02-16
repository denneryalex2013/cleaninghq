import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from "lucide-react";

const colorOptions = [
  { name: 'Ocean Blue', value: '#0ea5e9' },
  { name: 'Emerald Green', value: '#10b981' },
  { name: 'Violet Purple', value: '#8b5cf6' },
  { name: 'Sunset Orange', value: '#f97316' },
  { name: 'Ruby Red', value: '#ef4444' },
  { name: 'Slate Gray', value: '#475569' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Indigo', value: '#6366f1' }
];

const styleOptions = [
  { 
    value: 'Modern', 
    description: 'Clean, contemporary design with smooth animations',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80'
  },
  { 
    value: 'Corporate', 
    description: 'Professional and trustworthy appearance',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80'
  },
  { 
    value: 'Luxury', 
    description: 'Premium feel with elegant typography',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80'
  },
  { 
    value: 'Bold', 
    description: 'Eye-catching with vibrant elements',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80'
  },
  { 
    value: 'Minimal', 
    description: 'Simple and focused on content',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80'
  }
];

export default function Step4Branding({ formData, setFormData, onNext, onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.primary_color || !formData.style) {
      alert('Please select both a primary color and style');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Customize your brand</h2>
        <p className="text-gray-600">Choose colors and style that represent your business</p>
      </div>

      <div className="space-y-8">
        {/* Primary Color */}
        <div>
          <Label className="text-base font-semibold text-gray-900 mb-3 block">
            Primary Brand Color *
          </Label>
          <div className="grid grid-cols-4 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, primary_color: color.value })}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  formData.primary_color === color.value
                    ? 'border-gray-900 scale-105'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div
                  className="w-full h-12 rounded-lg"
                  style={{ backgroundColor: color.value }}
                />
                <p className="text-xs font-medium text-gray-700 mt-2 text-center">
                  {color.name}
                </p>
                {formData.primary_color === color.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Color */}
        <div>
          <Label className="text-base font-semibold text-gray-900 mb-3 block">
            Secondary Brand Color (Optional)
          </Label>
          <div className="grid grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, secondary_color: '' })}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                !formData.secondary_color
                  ? 'border-gray-900 scale-105'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="w-full h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-500 font-medium">None</span>
              </div>
              {!formData.secondary_color && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, secondary_color: color.value })}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  formData.secondary_color === color.value
                    ? 'border-gray-900 scale-105'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div
                  className="w-full h-12 rounded-lg"
                  style={{ backgroundColor: color.value }}
                />
                <p className="text-xs font-medium text-gray-700 mt-2 text-center">
                  {color.name}
                </p>
                {formData.secondary_color === color.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tertiary Color */}
        <div>
          <Label className="text-base font-semibold text-gray-900 mb-3 block">
            Tertiary Brand Color (Optional)
          </Label>
          <div className="grid grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tertiary_color: '' })}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                !formData.tertiary_color
                  ? 'border-gray-900 scale-105'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="w-full h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-500 font-medium">None</span>
              </div>
              {!formData.tertiary_color && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, tertiary_color: color.value })}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  formData.tertiary_color === color.value
                    ? 'border-gray-900 scale-105'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div
                  className="w-full h-12 rounded-lg"
                  style={{ backgroundColor: color.value }}
                />
                <p className="text-xs font-medium text-gray-700 mt-2 text-center">
                  {color.name}
                </p>
                {formData.tertiary_color === color.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <Label className="text-base font-semibold text-gray-900 mb-3 block">
            Website Style *
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {styleOptions.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => setFormData({ ...formData, style: style.value })}
                className={`rounded-xl border-2 text-left transition-all hover:shadow-lg overflow-hidden ${
                  formData.style === style.value
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300'
                }`}
              >
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={style.image} 
                    alt={style.value}
                    className="w-full h-full object-cover"
                  />
                  {formData.style === style.value && (
                    <div className="absolute top-2 right-2 bg-teal-600 text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-bold text-lg text-gray-900 mb-1">{style.value}</div>
                  <div className="text-sm text-gray-600">{style.description}</div>
                </div>
              </button>
            ))}
          </div>
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
          Review & Submit
        </Button>
      </div>
    </form>
  );
}