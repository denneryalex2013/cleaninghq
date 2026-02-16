import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { siteRequestId, editRequest } = await req.json();

        if (!siteRequestId || !editRequest) {
            return Response.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Load site request
        const sites = await base44.asServiceRole.entities.SiteRequest.filter({ id: siteRequestId });
        if (sites.length === 0) {
            return Response.json({ error: 'Site not found' }, { status: 404 });
        }
        const site = sites[0];

        // Parse edit request with AI
        const editPlan = await parseEditWithAI(base44, editRequest, site);

        // Apply the edit to generated_content
        const updatedContent = applyEdit(site.generated_content, editPlan, site);

        // Save updated content
        await base44.asServiceRole.entities.SiteRequest.update(siteRequestId, {
            generated_content: updatedContent
        });

        return Response.json({
            success: true,
            updatedContent: updatedContent
        });

    } catch (error) {
        console.error('Edit error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});

async function parseEditWithAI(base44, editRequest, site) {
    const prompt = `Parse this website edit request and extract the action.

Request: "${editRequest}"
Available services: ${site.service_types?.join(', ') || 'None'}

Return JSON with:
{
  "action": "add_service" | "change_text" | "change_color" | "other",
  "serviceName": "service name if adding service",
  "fieldName": "field name if changing text",
  "newValue": "new value",
  "confidence": 0-1
}

Only return valid JSON, nothing else.`;

    const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
            type: "object",
            properties: {
                action: { type: "string" },
                serviceName: { type: "string" },
                fieldName: { type: "string" },
                newValue: { type: "string" },
                confidence: { type: "number" }
            }
        }
    });

    return result;
}

function applyEdit(generatedContent, editPlan, site) {
    const content = JSON.parse(JSON.stringify(generatedContent)); // Deep copy

    if (editPlan.action === 'add_service' && editPlan.serviceName) {
        const citySlug = site.city.toLowerCase().replace(/\s+/g, '-');
        const serviceSlug = editPlan.serviceName.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '');

        const newService = {
            slug: `${serviceSlug}-${citySlug}`,
            service_name: editPlan.serviceName,
            seo: {
                title: `${editPlan.serviceName} in ${site.city} | ${site.company_name}`,
                description: `Professional ${editPlan.serviceName.toLowerCase()} in ${site.city}`,
                keywords: [editPlan.serviceName.toLowerCase(), site.city.toLowerCase(), "cleaning"]
            },
            hero: {
                h1: `Professional ${editPlan.serviceName} in ${site.city}, ${site.state}`,
                subheadline: `Trusted ${editPlan.serviceName.toLowerCase()} services`,
                cta_text: "Get Free Quote"
            },
            intro: {
                headline: `About Our ${editPlan.serviceName}`,
                text: `We provide professional ${editPlan.serviceName.toLowerCase()} services tailored to meet your specific needs in ${site.city}, ${site.state}.`
            },
            benefits: [
                { title: "Expert Team", description: "Trained and certified professionals" },
                { title: "Quality Assurance", description: "Guaranteed satisfaction on every job" },
                { title: "Fast & Reliable", description: "On-time service, every time" }
            ],
            why_choose: [
                { title: "Experience", description: "Years of industry expertise" },
                { title: "Affordable", description: "Competitive pricing without compromises" },
                { title: "Licensed & Insured", description: "Full coverage and protection" }
            ],
            process: {
                headline: "Our Process",
                steps: [
                    { title: "Assessment", description: "We evaluate your specific needs" },
                    { title: "Custom Plan", description: "We create a tailored solution" },
                    { title: "Execution", description: "Professional service delivery" }
                ]
            },
            cta: {
                headline: "Ready to Get Started?",
                text: "Contact us for a free quote"
            }
        };

        if (!content.pages) content.pages = {};
        if (!content.pages.services) content.pages.services = [];
        content.pages.services.push(newService);

    } else if (editPlan.action === 'change_text' && editPlan.fieldName && editPlan.newValue) {
        // Simple text replacement in homepage
        if (editPlan.fieldName === 'headline' && content.pages?.homepage?.hero) {
            content.pages.homepage.hero.headline = editPlan.newValue;
        } else if (editPlan.fieldName === 'subheadline' && content.pages?.homepage?.hero) {
            content.pages.homepage.hero.subheadline = editPlan.newValue;
        }
    } else if (editPlan.action === 'change_color') {
        if (!content.brand) content.brand = {};
        content.brand.primary_color = editPlan.newValue;
    }

    return content;
}