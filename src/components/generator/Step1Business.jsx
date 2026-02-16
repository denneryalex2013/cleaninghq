import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Building2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Step1Business({ formData, setFormData, onNext }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, logo_url: file_url, logo: file_url });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company_name || !formData.email || !formData.phone || !formData.city || !formData.state) {
      alert('Please fill in all required fields');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's start with the basics</h2>
        <p className="text-gray-600">Tell us about your cleaning company</p>
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">
            Company Name *
          </Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            placeholder="ABC Cleaning Company"
            className="mt-1.5 h-12 text-base"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@abccleaning.com"
              className="mt-1.5 h-12 text-base"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="mt-1.5 h-12 text-base"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              City *
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Los Angeles"
              className="mt-1.5 h-12 text-base"
              required
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              State *
            </Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="CA"
              className="mt-1.5 h-12 text-base"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="existing_website_url" className="text-sm font-medium text-gray-700">
            Enter your current website (optional)
          </Label>
          <Input
            id="existing_website_url"
            type="url"
            value={formData.existing_website_url || ''}
            onChange={(e) => setFormData({ ...formData, existing_website_url: e.target.value })}
            placeholder="https://yourwebsite.com"
            className="mt-1.5 h-12 text-base"
          />
          <p className="text-xs text-gray-500 mt-1">
            We will use this to improve your new website automatically
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Company Logo (Optional)
          </Label>
          <div className="mt-1.5">
            {formData.logo_url ? (
              <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <img src={formData.logo_url} alt="Logo" className="w-16 h-16 object-contain" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium">Logo uploaded</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({ ...formData, logo_url: '' })}
                    className="text-red-600 hover:text-red-700 px-0"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload your logo'}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Google Business Profile Link (Optional)
          </Label>
          <Input
            type="url"
            value={formData.google_business_url || ''}
            onChange={(e) => setFormData({ ...formData, google_business_url: e.target.value })}
            placeholder="https://g.page/your-business"
            className="mt-1.5 h-12 text-base"
          />
          <p className="text-xs text-gray-500 mt-1">
            We'll automatically import your rating and reviews
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700"
      >
        Continue
      </Button>
    </form>
  );
}