import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Service role to process all pending sites
        const pendingSites = await base44.asServiceRole.entities.SiteRequest.filter({ status: 'pending' });
        
        if (pendingSites.length === 0) {
            return Response.json({ message: 'No pending sites to process' });
        }

        const results = [];

        for (const site of pendingSites) {
            try {
                // Update status to generating
                await base44.asServiceRole.entities.SiteRequest.update(site.id, { status: 'generating' });

                const citySlug = site.city.toLowerCase().replace(/\s+/g, '-');

                // Determine tone based on service types
                const residentialServices = ['Residential Cleaning', 'Airbnb Cleaning', 'Move-In / Move-Out Cleaning'];
                const commercialServices = ['Commercial Cleaning', 'Office Cleaning', 'Medical Cleaning', 'Janitorial Services', 'Post-Construction Cleaning'];
                
                const hasResidential = site.service_types.some(s => residentialServices.includes(s));
                const hasCommercial = site.service_types.some(s => commercialServices.includes(s));
                const isHybrid = hasResidential && hasCommercial;

                let tone = '';
                if (isHybrid) {
                    tone = 'Use a dual-tone approach: warm for residential, professional for commercial';
                } else if (hasResidential) {
                    tone = 'Use a warm, lifestyle-oriented tone focusing on "reclaiming time," "safety," and family';
                } else {
                    tone = 'Use a professional, logic-driven tone focusing on "compliance," "efficiency," and "risk mitigation"';
                }

                const industryContext = site.industries_served?.length > 0 ? `
                    INDUSTRIES SERVED: ${site.industries_served.join(', ')}
                    Include industry-specific pain points and solutions throughout all content.
                ` : '';

                const aiPrompt = `Generate a complete website content structure for ${site.company_name}, a cleaning business in ${site.city}, ${site.state}.

COMPANY INFO:
- Services: ${site.service_types.join(', ')}
- Industries: ${site.industries_served?.join(', ') || 'General'}
- Years: ${site.years_in_business || 'New'}
- Insured: ${site.insured ? 'Yes' : 'No'}
- Rating: ${site.google_rating || 'N/A'}

TONE: ${tone}
${industryContext}

Generate JSON with this EXACT structure:

{
  "pages": {
    "homepage": {
      "seo": {
        "title": "60-char title with ${site.city}",
        "description": "150-char description",
        "keywords": ["keyword1", "keyword2"]
      },
      "hero": {
        "headline": "Benefit-driven headline mentioning ${site.city}",
        "subheadline": "Trust-building subheadline",
        "cta_text": "Get Free Quote"
      },
      "trust_bar": ["Trust element 1", "Trust element 2", "Trust element 3", "Trust element 4"],
      "services_section": {
        "headline": "Our Services",
        "subheadline": "Professional cleaning solutions"
      },
      "about": {
        "headline": "Why Choose ${site.company_name}?",
        "text": "3-4 sentences establishing authority"
      },
      "benefits": [
        {"title": "Benefit 1", "description": "Detail", "icon": "shield"},
        {"title": "Benefit 2", "description": "Detail", "icon": "clock"},
        {"title": "Benefit 3", "description": "Detail", "icon": "star"}
      ],
      "testimonials": [
        {"name": "Customer Name", "text": "Detailed testimonial", "rating": 5, "service": "${site.service_types[0]}"}
      ],
      "cta": {
        "headline": "Ready for a Spotless Space?",
        "subheadline": "Get your free quote today"
      }
    },
    "services": [
${site.service_types.map(service => {
    const serviceSlug = service.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '');
    return `      {
        "slug": "${serviceSlug}-${citySlug}",
        "service_name": "${service}",
        "seo": {
          "title": "${service} in ${site.city} | ${site.company_name}",
          "description": "Professional ${service.toLowerCase()} in ${site.city}",
          "keywords": ["${service.toLowerCase()}", "${site.city.toLowerCase()}", "cleaning"]
        },
        "hero": {
          "h1": "Professional ${service} in ${site.city}, ${site.state}",
          "subheadline": "Trusted ${service.toLowerCase()} services",
          "cta_text": "Get Free Quote"
        },
        "intro": {
          "headline": "About Our ${service}",
          "text": "4-5 sentences describing the service with industry focus"
        },
        "benefits": [
          {"title": "Benefit 1", "description": "Industry-specific benefit"},
          {"title": "Benefit 2", "description": "Industry-specific benefit"},
          {"title": "Benefit 3", "description": "Industry-specific benefit"}
        ],
        "why_choose": [
          {"title": "Reason 1", "description": "Detail"},
          {"title": "Reason 2", "description": "Detail"},
          {"title": "Reason 3", "description": "Detail"}
        ],
        "process": {
          "headline": "Our Process",
          "steps": [
            {"title": "Step 1", "description": "Detail"},
            {"title": "Step 2", "description": "Detail"},
            {"title": "Step 3", "description": "Detail"}
          ]
        },
        "cta": {
          "headline": "Ready to Get Started?",
          "text": "Contact us for a free quote"
        }
      }`;
}).join(',\n')}
    ],
    "contact": {
      "seo": {
        "title": "Contact ${site.company_name} | ${site.city}",
        "description": "Get in touch with ${site.company_name}"
      },
      "headline": "Get in Touch",
      "subheadline": "We're here to help with your cleaning needs"
    }
  }
}

CRITICAL: Generate complete, detailed content for ALL pages. Each service page must be fully populated.`;

                const generatedContent = await base44.asServiceRole.integrations.Core.InvokeLLM({
                    prompt: aiPrompt,
                    add_context_from_internet: !!site.existing_website_url,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            pages: {
                                type: "object",
                                properties: {
                                    homepage: { type: "object" },
                                    services: { 
                                        type: "array",
                                        items: { type: "object" }
                                    },
                                    contact: { type: "object" }
                                }
                            }
                        }
                    }
                });

                // Validate that pages structure exists
                if (!generatedContent?.pages) {
                    throw new Error('LLM response missing pages structure');
                }

                // Update site request with generated content
                await base44.asServiceRole.entities.SiteRequest.update(site.id, {
                    generated_content: generatedContent,
                    status: 'generated'
                });

                results.push({ id: site.id, company: site.company_name, status: 'success' });

            } catch (error) {
                console.error(`Error processing site ${site.id}:`, error);
                results.push({ id: site.id, company: site.company_name, status: 'failed', error: error.message });
                
                // Reset status to pending so it can be retried
                await base44.asServiceRole.entities.SiteRequest.update(site.id, { status: 'pending' });
            }
        }

        return Response.json({ 
            processed: results.length,
            results 
        });

    } catch (error) {
        console.error('Process pending sites error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});