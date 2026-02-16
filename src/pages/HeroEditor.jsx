import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import { createPageUrl } from '../utils';

export default function HeroEditor() {
  const navigate = useNavigate();
  const [siteRequest, setSiteRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    ctaText: ''
  });
  const fileInputRef = useRef(null);

  const urlParams = new URLSearchParams(window.location.search);
  const recordId = urlParams.get('id');

  useEffect(() => {
    const loadData = async () => {
      if (!recordId) {
        navigate(createPageUrl('CustomerDashboard'));
        return;
      }

      try {
        const user = await base44.auth.me();
        if (!user) {
          navigate(createPageUrl('Auth'));
          return;
        }

        const requests = await base44.entities.SiteRequest.filter({ id: recordId });
        if (requests.length > 0) {
          const req = requests[0];
          setSiteRequest(req);
          const content = req.generated_content || {};
          setFormData({
            headline: content.hero?.headline || '',
            subheadline: content.hero?.subheadline || '',
            ctaText: content.hero?.cta_text || 'Get Free Quote'
          });
        }
      } catch (error) {
        console.error('Error loading hero editor:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [recordId, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      await base44.entities.SiteRequest.update(recordId, {
        hero_image_url: file_url
      });

      setSiteRequest(prev => ({ ...prev, hero_image_url: file_url }));
      alert('Hero image updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedContent = {
        ...(siteRequest.generated_content || {}),
        hero: {
          headline: formData.headline,
          subheadline: formData.subheadline,
          cta_text: formData.ctaText
        }
      };

      await base44.entities.SiteRequest.update(recordId, {
        generated_content: updatedContent
      });

      alert('Hero section saved successfully');
    } catch (error) {
      console.error('Error saving hero:', error);
      alert('Failed to save hero section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!siteRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Button onClick={() => navigate(createPageUrl('CustomerDashboard'))}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl('CustomerDashboard'))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Hero Section</h1>
          <div />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Hero Content</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headline
                </label>
                <Input
                  placeholder="e.g., Professional Commercial Cleaning Services"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subheadline
                </label>
                <Textarea
                  placeholder="e.g., Trusted cleaning company serving the entire city..."
                  value={formData.subheadline}
                  onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Button Text
                </label>
                <Input
                  placeholder="Get Free Quote"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Hero Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
                {siteRequest.hero_image_url && (
                  <div className="mt-4">
                    <img 
                      src={siteRequest.hero_image_url} 
                      alt="Hero" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full h-12 bg-teal-600 hover:bg-teal-700 font-semibold"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Preview</h2>
            <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg p-8 text-white min-h-[400px] flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                {formData.headline || 'Your headline here'}
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {formData.subheadline || 'Your subheadline here'}
              </p>
              <Button className="w-fit bg-white text-teal-600 hover:bg-gray-100 font-semibold">
                {formData.ctaText || 'Get Free Quote'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}