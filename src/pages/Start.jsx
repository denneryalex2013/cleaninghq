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
    industries_served: [],
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
        // Determine if residential, commercial, or hybrid
        const residentialServices = ['Residential Cleaning', 'Airbnb Cleaning', 'Move-In / Move-Out Cleaning'];
        const commercialServices = ['Commercial Cleaning', 'Office Cleaning', 'Medical Cleaning', 'Janitorial Services', 'Post-Construction Cleaning'];

        const hasResidential = formData.service_types.some(s => residentialServices.includes(s));
        const hasCommercial = formData.service_types.some(s => commercialServices.includes(s));
        const isHybrid = hasResidential && hasCommercial;

        let tone = '';
        if (isHybrid) {
          tone = 'Use a dual-tone approach: warm and lifestyle-oriented for residential, professional and logic-driven for commercial';
        } else if (hasResidential) {
          tone = 'Use a warm, lifestyle-oriented tone focusing on "reclaiming time," "safety," and family';
        } else {
          tone = 'Use a professional, logic-driven tone focusing on "compliance," "operational efficiency," and "risk mitigation"';
        }

        // Industry-specific messaging
        const industryContext = formData.industries_served?.length > 0 ? `
      INDUSTRIES SERVED: ${formData.industries_served.join(', ')}

      INDUSTRY-SPECIFIC REQUIREMENTS:
      ${formData.industries_served.includes('Medical & Healthcare') ? '- Medical: Emphasize infection control, hospital-grade disinfectants, HIPAA/OSHA compliance, bloodborne pathogen protocols' : ''}
      ${formData.industries_served.includes('Industrial & Manufacturing') ? '- Industrial: Highlight heavy machinery safety, degreasing, pressure washing, hazardous waste handling' : ''}
      ${formData.industries_served.includes('Legal & Professional Offices') ? '- Legal: Focus on confidentiality, professional image, background-checked staff for data security' : ''}
      ${formData.industries_served.includes('Food Service & Hospitality') ? '- Food Service: Stress sanitation, pest prevention, grease trap cleaning, FDA/Health Dept. standards' : ''}
      ${formData.industries_served.includes('Retail & Showroom') ? '- Retail: Emphasize aesthetics, high foot traffic handling, floor buffing, window polishing, brand image maintenance' : ''}
      ${formData.industries_served.includes('Educational (Schools/Daycare)') ? '- Educational: Focus on germ reduction, non-toxic "green" cleaners safe for children, high-touch surface sanitization' : ''}
      ${formData.industries_served.includes('Data Centers & IT') ? '- Data Centers: Highlight dust-free environments, anti-static cleaning, HEPA vacuuming, delicate hardware care' : ''}
      ${formData.industries_served.includes('Post-Construction (Commercial)') ? '- Post-Construction: Emphasize debris removal, safety, drywall dust clearing, paint overspray cleanup' : ''}
      ${formData.industries_served.includes('Gym & Fitness') ? '- Gym: Focus on odor control, sweat removal, equipment sanitization, fungi and staph infection prevention' : ''}

      IMPORTANT: Integrate these industry-specific pain points and solutions naturally throughout ALL content - headlines, descriptions, benefits, and testimonials.
      ` : '';

        // Image handling logic
        const hasUserImages = formData.logo_url || formData.hero_image_url || (formData.gallery_images && formData.gallery_images.length > 0);
        const hasGoogleBusiness = formData.google_business_url;
        
        const imageInstructions = `
IMAGE SOURCING PRIORITY:
${hasUserImages ? '1. PRIORITY: Use user-uploaded images provided in the data' : ''}
${hasGoogleBusiness ? '2. Extract high-quality images from Google Business Profile' : ''}
${!hasUserImages ? '3. Generate or suggest high-resolution, professional stock images relevant to:' : '4. Supplement with professional stock images for:'}
   - ${formData.service_types.join(', ')}
   ${formData.industries_served?.length > 0 ? `- ${formData.industries_served.join(', ')} industry settings` : ''}
   - ${formData.city}, ${formData.state} location context

IMAGE REQUIREMENTS:
- All images must be HD quality (min 1920x1080)
- Show real cleaning professionals in action
- Industry-specific settings (${formData.industries_served?.join(', ') || 'general commercial/residential'})
- Diverse representation
- Professional equipment and attire
- Before/after shots where applicable

For each image, provide descriptive alt text that includes:
- Service type
- Location (${formData.city})
- Industry context if applicable
- Action being performed
`;

        const aiPrompt = `You are a Senior Conversion Rate Optimization (CRO) Expert and B2B SaaS Designer specialized in the cleaning industry.

        Generate a high-performance website for ${formData.company_name} based in ${formData.city}, ${formData.state}.

        COMPANY INFO:
        - Name: ${formData.company_name}
        - Location: ${formData.city}, ${formData.state}
        - Services: ${formData.service_types.join(', ')}
        - Years in Business: ${formData.years_in_business || 'New'}
        - Insured: ${formData.insured ? 'Yes' : 'Not specified'}
        - Google Rating: ${formData.google_rating || 'Not specified'}
        ${formData.existing_website_url ? `- Reference Website: ${formData.existing_website_url}` : ''}

        TONE: ${tone}
        ${industryContext}
        ${imageInstructions}

CRITICAL RULES:
1. Hero Section must use "Benefit-First" headline formula: [Desired Outcome] + [Timeframe] + [Objection Handle]
${hasResidential ? `- Residential Example: "A Sparkling Home Every Week. Book in 60 Seconds. No Contracts."` : ''}
${hasCommercial ? `- Commercial Example: "Reliable Facility Management in ${formData.city}. OSHA-Compliant & Fully Insured."` : ''}

2. Trust Bar must include: Google Rating, Insurance Status, Years in Business, Safety credentials

3. Service Descriptions must be benefit-driven, NOT feature lists:
- Airbnb: "5-star guest reviews guaranteed with 4-hour turnarounds"
- Medical: "Strict sanitization protocols meeting all ${formData.state} healthcare regulations"
- Floor Care: "Industrial-grade restoration to protect your facility's investment"
- Each service needs unique value proposition

4. FAQ must address 2026 buyer objections:
- "Are your cleaners background checked?" (Yes, 100% vetted)
- "What if I'm not satisfied?" (24-hour re-clean guarantee)
- "Do you provide your own supplies?" (Yes, EPA-approved and eco-friendly)

5. Inject ${formData.city} and ${formData.state} naturally throughout content

6. Social Proof phrasing:
${hasResidential ? `- Residential: "Join 500+ happy families in ${formData.city}"` : ''}
${hasCommercial ? `- Commercial: "The reliable partner for ${formData.city} businesses"` : ''}

Generate content following this exact structure:

seo: {
  homepage: {
    meta_title: "60-character SEO title with primary keyword and ${formData.city}",
    meta_description: "150-character description with benefits and location",
    focus_keyword: "primary service + ${formData.city}"
  }
}

hero: {
  headline: (48-64px size, benefit-driven, mentions location and industry pain points if applicable),
  subheadline: (20-28px, builds trust, mentions coverage area and industry credentials),
  image_alt: "Descriptive alt text for hero image mentioning service and location"
}

trust_bar: [4 short trust statements including industry certifications if applicable]

services: {
  [service_name]: "2-3 sentence description incorporating industry-specific requirements"
}

about: {
  title: "Compelling headline",
  text: "3-4 sentences establishing authority and industry expertise",
  image_alt: "Alt text for about section image"
}

overall_business_benefits: [
  {title: "Overall benefit 1", description: "Core value proposition", icon_alt: "Icon description"}
] (3-5 company-wide benefits that apply across all services)

service_specific_benefits: {
  [service_name]: [
    {title: "Benefit title", description: "Service-specific benefit with industry focus", icon_alt: "Icon description"}
  ] (3-5 benefits per service)
}

benefits: [
  {title: "Benefit title", description: "Benefit description with industry focus", icon_alt: "Icon description"}
] (6 benefits for homepage - can mix overall and service-specific)

why_choose_us: [
  {
    title: "Key Differentiator 1",
    description: "Detailed explanation of what sets you apart",
    industry_relevance: "How this applies to ${formData.industries_served?.join(', ') || 'target industries'}"
  },
  {
    title: "Key Differentiator 2",
    description: "Unique competitive advantage",
    industry_relevance: "Industry-specific application"
  },
  {
    title: "Key Differentiator 3",
    description: "Core strength or credential",
    industry_relevance: "Why this matters to ${formData.industries_served?.join(', ') || 'your clients'}"
  }
] (3 key differentiators tailored to selected industries)

testimonials: [
  {
    name: "Realistic customer name",
    business: "Business name (optional)",
    industry: "${formData.industries_served?.[0] || 'General'}",
    text: "Detailed testimonial quote (2-3 sentences) mentioning specific results, service quality, and industry-relevant outcomes",
    rating: 5,
    service_used: "${formData.service_types[0]}"
  }
] (3-5 unique, realistic testimonials based on company's services and industries served)

cta: {
  headline: "Action headline",
  subheadline: "Supporting text",
  image_alt: "CTA section image alt text"
}

footer: {
  tagline: "Company tagline"
}

pages: {
  ${formData.service_types.map(service => {
    const key = service.toLowerCase().replace(/\s+/g, '_').replace(/\//g, '');
    return `"${key}": {
    seo: {
      meta_title: "60-char SEO title: ${service} in ${formData.city} | ${formData.company_name}",
      meta_description: "150-char description with benefits, location, and industry focus",
      focus_keyword: "${service.toLowerCase()} ${formData.city.toLowerCase()}"
    },
    headline: "SEO-optimized headline with ${formData.city} and industry pain point",
    subheadline: "Compelling subheadline addressing industry concerns",
    description_title: "About This Service",
    description: "4-5 sentences, benefit-driven, mentions ${formData.city}, ${formData.state}, and industry-specific solutions",
    benefits: [
      {title: "Benefit 1", description: "Industry-specific benefit detail", icon_alt: "Icon description"},
      {title: "Benefit 2", description: "Industry-specific benefit detail", icon_alt: "Icon description"},
      {title: "Benefit 3", description: "Industry-specific benefit detail", icon_alt: "Icon description"},
      {title: "Benefit 4", description: "Industry-specific benefit detail", icon_alt: "Icon description"},
      {title: "Benefit 5", description: "Industry-specific benefit detail", icon_alt: "Icon description"}
    ] (3-5 unique benefits for THIS specific service),
    why_choose_us: [
      {title: "Reason 1 (industry-focused)", desc: "Detail with credentials"},
      {title: "Reason 2 (industry-focused)", desc: "Detail with compliance"},
      {title: "Reason 3 (industry-focused)", desc: "Detail with results"}
    ],
    service_images: [
      {url: "Suggest HD image URL or description", alt: "Detailed alt text"},
      {url: "Suggest HD image URL or description", alt: "Detailed alt text"}
    ],
    hero_image_alt: "Alt text: Professional ${service.toLowerCase()} service in ${formData.city}",
    section_image_alts: ["Alt text 1", "Alt text 2", "Alt text 3"]
  }`;
  }).join(',\n  ')}
}

IMPORTANT: Generate detailed, unique content for each service page. Each service must have its own entry in the pages object using underscore-separated lowercase keys (e.g., "residential_cleaning", "commercial_cleaning").

Services to generate pages for: ${formData.service_types.join(', ')}

${formData.existing_website_url ? 'Use the reference website for content inspiration but create fresh, professional copy.' : 'Create compelling, professional copy that converts.'}`;

        const aiContent = await base44.integrations.Core.InvokeLLM({
          prompt: aiPrompt,
          add_context_from_internet: formData.existing_website_url || formData.google_business_url ? true : false,
          response_json_schema: {
            type: "object",
            properties: {
              seo: { type: "object" },
              hero: { type: "object" },
              trust_bar: { type: "array" },
              services: { type: "object" },
              about: { type: "object" },
              overall_business_benefits: { type: "array" },
              service_specific_benefits: { type: "object" },
              benefits: { type: "array" },
              why_choose_us: { type: "array" },
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