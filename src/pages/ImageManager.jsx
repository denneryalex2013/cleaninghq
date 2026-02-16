import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader2, Trash2, Plus } from 'lucide-react';
import { createPageUrl } from '../utils';

export default function ImageManager() {
  const navigate = useNavigate();
  const [siteRequest, setSiteRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
  const fileInputs = useRef({});

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
          setSiteRequest(requests[0]);
        }
      } catch (error) {
        console.error('Error loading image manager:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [recordId, navigate]);

  const handleImageUpload = async (type, e, index = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      let updates = {};

      if (type === 'logo') {
        updates.logo_url = file_url;
      } else if (type === 'hero') {
        updates.hero_image_url = file_url;
      } else if (type === 'gallery') {
        const gallery = [...(siteRequest.gallery_images || [])];
        if (index !== null) {
          gallery[index] = file_url;
        } else {
          gallery.push(file_url);
        }
        updates.gallery_images = gallery;
      }

      await base44.entities.SiteRequest.update(recordId, updates);
      
      setSiteRequest(prev => ({ ...prev, ...updates }));
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} image updated successfully`);
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      alert(`Failed to upload ${type} image`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
      if (fileInputs.current[type]) {
        fileInputs.current[type].value = '';
      }
    }
  };

  const handleRemoveGalleryImage = async (index) => {
    const updatedGallery = siteRequest.gallery_images.filter((_, i) => i !== index);
    
    try {
      await base44.entities.SiteRequest.update(recordId, {
        gallery_images: updatedGallery
      });
      
      setSiteRequest(prev => ({
        ...prev,
        gallery_images: updatedGallery
      }));
    } catch (error) {
      console.error('Error removing gallery image:', error);
      alert('Failed to remove image');
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Images</h1>
          <div />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Logo */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Logo</h2>
            <div className="flex flex-col items-center gap-4">
              {siteRequest.logo_url ? (
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                  <img src={siteRequest.logo_url} alt="Logo" className="max-w-full max-h-full" />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-gray-400">No logo</span>
                </div>
              )}
              <input
                ref={(el) => (fileInputs.current['logo'] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('logo', e)}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputs.current['logo']?.click()}
                disabled={uploading.logo}
              >
                {uploading.logo ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Hero Image */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Image</h2>
            <div className="space-y-4">
              {siteRequest.hero_image_url && (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={siteRequest.hero_image_url} 
                    alt="Hero" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                ref={(el) => (fileInputs.current['hero'] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('hero', e)}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputs.current['hero']?.click()}
                disabled={uploading.hero}
              >
                {uploading.hero ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Hero Image
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Gallery Images */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h2>
            <div className="space-y-4">
              {siteRequest.gallery_images && siteRequest.gallery_images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {siteRequest.gallery_images.map((image, idx) => (
                    <div key={idx} className="relative group">
                      <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`Gallery ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveGalleryImage(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <input
                ref={(el) => (fileInputs.current['gallery'] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('gallery', e)}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputs.current['gallery']?.click()}
                disabled={uploading.gallery}
              >
                {uploading.gallery ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Gallery Image
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}