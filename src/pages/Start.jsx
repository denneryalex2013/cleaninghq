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
      
      let generatedContent = {
        generated_at: new Date().toISOString(),
        version: '3.0',
        brand: {
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color || null,
          tertiary_color: formData.tertiary_color || null
        }
      };

      try {
        const residentialServices = ['Residential Cleaning', 'Airbnb Cleaning', 'Move-In / Move-Out Cleaning'];
        const commercialServices = ['Commercial Cleaning', 'Office Cleaning', 'Medical Cleaning', 'Janitorial Services', 'Post-Construction Cleaning'];

        const hasResidential = formData.service_types.some(s => residentialServices.includes(s));
        const hasCommercial = formData.service_types.some(s => commercialServices.includes(s));

        let tone = '';
        if (hasResidential && hasCommercial) {
          tone = 'Dual-tone: warm and lifestyle-oriented for residential sections, professional and logic-driven for commercial sections.';
        } else if (hasResidential) {
          tone = 'Warm, lifestyle-oriented. Focus on "reclaiming time," family safety, and peace of mind.';
        } else {
          tone = 'Professional, logic-driven. Focus on compliance, operational efficiency, and risk mitigation.';
        }

        const industryContext = formData.industries_served?.length > 0 
          ? `Industries served: ${formData.industries_served.join(', ')}. Integrate industry-specific pain points naturally throughout all content.`
          : '';

        const citySlug = formData.city.toLowerCase().replace(/\s+/g, '-');

        const serviceList = formData.service_types.map(s => {
          const slug = s.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '') + '-' + citySlug;
          return `{ name: "${s}", slug: "${slug}" }`;
        }).join(', ');

        const aiPrompt = `You are an elite website copywriter and CRO expert for the cleaning industry. Generate ALL website content for ${formData.company_name} in ${formData.city}, ${formData.state}.

COMPANY DATA:
- Name: ${formData.company_name}
- City: ${formData.city}, State: ${formData.state}
- Services: ${formData.service_types.join(', ')}
- Years in Business: ${formData.years_in_business || 'New'}
- Insured: ${formData.insured ? 'Yes' : 'Not specified'}
- Google Rating: ${formData.google_rating || 'Not specified'}
- Industries: ${formData.industries_served?.join(', ') || 'General'}
${formData.existing_website_url ? `- Reference site: ${formData.existing_website_url}` : ''}

TONE: ${tone}
${industryContext}

SERVICE SLUGS (use these exact values):
${formData.service_types.map(s => {
  const slug = s.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '') + '-' + citySlug;
  return `- "${s}" → slug: "${slug}"`;
}).join('\n')}

=== CONTENT RULES ===

1. HERO: Write a benefit-driven headline (what the customer GETS, not what you do).
   - Format: [Desired Outcome] + [Location] + [Objection Handle]
   - Example: "Spotless Spaces, Zero Hassle. Serving ${formData.city} Businesses Since ${formData.years_in_business > 0 ? (new Date().getFullYear() - formData.years_in_business) : '2024'}."
   - Subheadline: 1 sentence that builds trust and mentions coverage area.

2. SERVICES: Each service needs a unique 2-sentence description that sells the BENEFIT.
   - Bad: "We offer commercial cleaning services"
   - Good: "Walk into a workspace that energizes your team every morning. We handle everything from daily maintenance to deep sanitization so you can focus on growing your business."

3. ABOUT: Write 3-4 sentences establishing authority. Mention ${formData.city}, years of experience, and what makes the company different. Do NOT be generic.

4. BENEFITS: 6 items for the homepage. Each needs a title, description (1-2 sentences), and an icon name from this list: shield, clock, star, users, leaf, thumbsup, award, check, badge, sparkles, zap, heart.

5. TESTIMONIALS: Generate 3 realistic testimonials. Each must mention a specific detail (square footage, frequency, industry). Use realistic first names with last initial. Include the service they used.

6. SERVICE PAGES: For EACH service, generate a complete page with:
   - service_name (display name)
   - slug (URL slug - use the exact slugs provided above)
   - hero.headline and hero.subheadline (unique per service, SEO-optimized with ${formData.city})
   - intro.headline and intro.text (3-4 sentences about this specific service)
   - benefits: 3-5 items with title and description
   - process.headline and process.steps: exactly 3 steps (title + description each)
   - faq: 3-4 questions and answers specific to this service
   - cta.headline and cta.text

7. FAQ: Each answer should be 2-3 conversational sentences. Address real buyer objections.

8. Weave ${formData.city} and ${formData.state} naturally into headlines and descriptions. Do NOT force it into every sentence.

9. All content must sound like it was written by a human copywriter, NOT an AI. No buzzwords like "leverage," "cutting-edge," or "state-of-the-art."

=== OUTPUT FORMAT ===

Return a JSON object with this EXACT structure:

{
  "hero": {
    "headline": "string",
    "subheadline": "string"
  },
  "trust_bar": ["string", "string", "string", "string"],
  "services": {
    "Service Name": "2-sentence benefit description"
  },
  "about": {
    "title": "string",
    "text": "string (3-4 sentences, can include newlines)"
  },
  "benefits": [
    { "title": "string", "description": "string", "icon": "shield|clock|star|users|leaf|thumbsup|award|check|badge|sparkles|zap|heart" }
  ],
  "testimonials": [
    { "name": "string", "text": "string (2-3 sentences)", "rating": 5, "service": "string", "business": "string or empty" }
  ],
  "cta": {
    "headline": "string",
    "subheadline": "string"
  },
  "footer": {
    "tagline": "string"
  },
  "pages": {
    "services": [
      {
        "service_name": "string",
        "slug": "exact-slug-from-above",
        "hero": {
          "headline": "string with ${formData.city}",
          "subheadline": "string"
        },
        "intro": {
          "headline": "string",
          "text": "string (3-4 sentences)"
        },
        "benefits": [
          { "title": "string", "description": "string" }
        ],
        "process": {
          "headline": "How It Works",
          "steps": [
            { "title": "string", "description": "string" },
            { "title": "string", "description": "string" },
            { "title": "string", "description": "string" }
          ]
        },
        "faq": [
          { "question": "string", "answer": "string (2-3 sentences)" }
        ],
        "cta": {
          "headline": "string",
          "text": "string"
        }
      }
    ]
  }
}

CRITICAL: The "pages.services" array MUST contain one entry for EACH of these services: ${formData.service_types.join(', ')}. Use the exact slugs provided above.`;

        const aiContent = await base44.integrations.Core.InvokeLLM({
          prompt: aiPrompt,
          add_context_from_internet: formData.existing_website_url || formData.google_business_url ? true : false,
          response_json_schema: {
            type: "object",
            properties: {
              hero: {
                type: "object",
                properties: {
                  headline: { type: "string" },
                  subheadline: { type: "string" }
                }
              },
              trust_bar: { type: "array", items: { type: "string" } },
              services: { type: "object" },
              about: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  text: { type: "string" }
                }
              },
              benefits: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    icon: { type: "string" }
                  }
                }
              },
              testimonials: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    text: { type: "string" },
                    rating: { type: "number" },
                    service: { type: "string" },
                    business: { type: "string" }
                  }
                }
              },
              cta: {
                type: "object",
                properties: {
                  headline: { type: "string" },
                  subheadline: { type: "string" }
                }
              },
              footer: {
                type: "object",
                properties: {
                  tagline: { type: "string" }
                }
              },
              pages: {
                type: "object",
                properties: {
                  services: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        service_name: { type: "string" },
                        slug: { type: "string" },
                        hero: {
                          type: "object",
                          properties: {
                            headline: { type: "string" },
                            subheadline: { type: "string" }
                          }
                        },
                        intro: {
                          type: "object",
                          properties: {
                            headline: { type: "string" },
                            text: { type: "string" }
                          }
                        },
                        benefits: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              title: { type: "string" },
                              description: { type: "string" }
                            }
                          }
                        },
                        process: {
                          type: "object",
                          properties: {
                            headline: { type: "string" },
                            steps: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  title: { type: "string" },
                                  description: { type: "string" }
                                }
                              }
                            }
                          }
                        },
                        faq: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              question: { type: "string" },
                              answer: { type: "string" }
                            }
                          }
                        },
                        cta: {
                          type: "object",
                          properties: {
                            headline: { type: "string" },
                            text: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              }
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