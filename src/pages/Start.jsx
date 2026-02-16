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
      
      // Generate enhanced content with AI
      let generatedContent = {
        generated_at: new Date().toISOString(),
        version: '2.0',
        brand: {
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color || null,
          tertiary_color: formData.tertiary_color || null
        }
      };

      try {
        const aiPrompt = `Generate professional website content for a cleaning company following a premium agency template structure.

Company Info:
- Name: ${formData.company_name}
- Location: ${formData.city}, ${formData.state}
- Services: ${formData.service_types.join(', ')}
- Years in Business: ${formData.years_in_business || 'New'}
${formData.existing_website_url ? `- Reference Website: ${formData.existing_website_url}` : ''}

Generate content following this exact structure:

hero: {
  headline: (48-64px size, benefit-driven, mentions location),
  subheadline: (20-28px, builds trust, mentions coverage area)
}

trust_bar: [4 short trust statements]

services: {
  [service_name]: "2-3 sentence description"
}

about: {
  title: "Compelling headline",
  text: "3-4 sentences establishing authority"
}

benefits: [
  {title: "Benefit title", description: "Benefit description"}
] (6 benefits)

testimonials: [
  {name: "Customer name", text: "Testimonial quote", rating: 5}
] (3 testimonials)

cta: {
  headline: "Action headline",
  subheadline: "Supporting text"
}

footer: {
  tagline: "Company tagline"
}

pages: {
  [service_route]: {
    headline: "Service page headline",
    subheadline: "Service page subheadline",
    description_title: "About section title",
    description: "Detailed service description",
    benefits: ["benefit 1", "benefit 2", "benefit 3", "benefit 4"],
    why_choose_us: [
      {title: "Title", desc: "Description"}
    ]
  }
}

Generate unique content for each service in service_types: ${formData.service_types.join(', ')}

${formData.existing_website_url ? 'Use the reference website for content inspiration but create fresh, professional copy.' : 'Create compelling, professional copy that converts.'}`;

        const aiContent = await base44.integrations.Core.InvokeLLM({
          prompt: aiPrompt,
          add_context_from_internet: formData.existing_website_url ? true : false,
          response_json_schema: {
            type: "object",
            properties: {
              hero: { type: "object" },
              trust_bar: { type: "array" },
              services: { type: "object" },
              about: { type: "object" },
              benefits: { type: "array" },
              testimonials: { type: "array" },
              cta: { type: "object" },
              footer: { type: "object" },
              pages: { type: "object" }
            }
          }
        });

        generatedContent = { ...generatedContent, ...aiContent };
      } catch (error) {
        console.error('AI content generation failed, using defaults:', error);
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