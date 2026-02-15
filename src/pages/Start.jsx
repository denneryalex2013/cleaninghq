import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from "@/api/base44Client";
import { createPageUrl } from '../utils';
import ProgressBar from '../components/generator/ProgressBar';
import Step1Business from '../components/generator/Step1Business';
import Step2Services from '../components/generator/Step2Services';
import Step3Trust from '../components/generator/Step3Trust';
import Step4Branding from '../components/generator/Step4Branding';
import Step5Confirmation from '../components/generator/Step5Confirmation';

export default function Start() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    existing_website_url: '',
    service_types: [],
    services: [],
    years_in_business: 0,
    insured: undefined,
    google_rating: 0,
    primary_color: '',
    secondary_color: '',
    tertiary_color: '',
    style: '',
    logo: '',
    status: 'pending',
    generated_content: {},
    preview_url: '',
    subscription_status: 'inactive'
  });

  const totalSteps = 5;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const generatePreviewUrl = (companyName) => {
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `https://preview.cleaninghq.io/${slug}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const previewUrl = generatePreviewUrl(formData.company_name);
      
      // Generate enhanced content with AI if existing website provided
      let generatedContent = {
        generated_at: new Date().toISOString(),
        version: '2.0',
        brand: {
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color || null,
          tertiary_color: formData.tertiary_color || null
        }
      };

      if (formData.existing_website_url) {
        try {
          const aiPrompt = `Generate enhanced website content for a cleaning company.

Company Info:
- Name: ${formData.company_name}
- Location: ${formData.city}, ${formData.state}
- Services: ${formData.service_types.join(', ')}
- Reference Website: ${formData.existing_website_url}

Use the CleaningHQ proven template structure but draw content inspiration from their existing website.
Return JSON with: hero (headline, subheadline), about (text), services_descriptions (object mapping each service to description).`;

          const aiContent = await base44.integrations.Core.InvokeLLM({
            prompt: aiPrompt,
            add_context_from_internet: true,
            response_json_schema: {
              type: "object",
              properties: {
                hero: { type: "object" },
                about: { type: "object" },
                services_descriptions: { type: "object" }
              }
            }
          });

          generatedContent = { ...generatedContent, ...aiContent };
        } catch (error) {
          console.error('AI content generation failed, using defaults:', error);
        }
      }

      const requestData = {
        ...formData,
        preview_url: previewUrl,
        status: 'generated',
        generated_content: generatedContent
      };

      const newRequest = await base44.entities.SiteRequest.create(requestData);
      
      navigate(createPageUrl('Preview') + `?id=${newRequest.id}`);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            CleaningHQ Website Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create your professional cleaning website in minutes
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

          {currentStep === 1 && (
            <Step1Business
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <Step2Services
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <Step3Trust
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <Step4Branding
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <Step5Confirmation
              formData={formData}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 Your information is secure and will never be shared</p>
        </div>
      </div>
    </div>
  );
}