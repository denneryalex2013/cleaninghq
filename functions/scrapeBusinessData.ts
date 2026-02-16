import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { site_request_id } = await req.json();

    if (!site_request_id) {
      return Response.json({ error: 'site_request_id required' }, { status: 400 });
    }

    // Fetch site request
    const siteRequests = await base44.asServiceRole.entities.SiteRequest.filter({ id: site_request_id });
    if (siteRequests.length === 0) {
      return Response.json({ error: 'Site request not found' }, { status: 404 });
    }

    const siteRequest = siteRequests[0];
    const updates = {};

    // STEP 1: Scrape images from existing website
    if (siteRequest.existing_website_url) {
      try {
        const prompt = `Extract image URLs from this website: ${siteRequest.existing_website_url}

Find:
- Logo image URL
- Hero/banner image URLs
- Gallery/portfolio image URLs

Return only real business photos, exclude:
- Icons
- Tiny images (<100px)
- Background patterns
- Stock photos

Return JSON with:
{
  "logo_url": "string or null",
  "hero_image_url": "string or null", 
  "gallery_images": ["array of URLs"]
}`;

        const scrapedImages = await base44.integrations.Core.InvokeLLM({
          prompt,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              logo_url: { type: "string" },
              hero_image_url: { type: "string" },
              gallery_images: { type: "array", items: { type: "string" } }
            }
          }
        });

        if (scrapedImages.logo_url && !siteRequest.logo_url) {
          updates.logo_url = scrapedImages.logo_url;
        }
        if (scrapedImages.hero_image_url && !siteRequest.hero_image_url) {
          updates.hero_image_url = scrapedImages.hero_image_url;
        }
        if (scrapedImages.gallery_images?.length > 0) {
          updates.gallery_images = [...(siteRequest.gallery_images || []), ...scrapedImages.gallery_images];
        }
      } catch (error) {
        console.error('Website scraping failed:', error);
      }
    }

    // STEP 2: Scrape Google Business Profile data
    if (siteRequest.google_business_url || (siteRequest.company_name && siteRequest.city)) {
      try {
        const searchQuery = siteRequest.google_business_url || 
          `${siteRequest.company_name} ${siteRequest.city} ${siteRequest.state} Google Business Profile`;

        const prompt = `Find Google Business Profile information for this cleaning business:
${searchQuery}

Extract:
- Business name
- Website URL
- Google rating (1-5)
- Review count
- Top 10 recent reviews with: reviewer name, rating, review text
- Business photos URLs

Return JSON:
{
  "business_name": "string",
  "website_url": "string or null",
  "rating": number,
  "review_count": number,
  "reviews": [{"name": "string", "rating": number, "text": "string"}],
  "photos": ["array of photo URLs"]
}`;

        const googleData = await base44.integrations.Core.InvokeLLM({
          prompt,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              business_name: { type: "string" },
              website_url: { type: "string" },
              rating: { type: "number" },
              review_count: { type: "number" },
              reviews: { type: "array" },
              photos: { type: "array" }
            }
          }
        });

        if (googleData.rating) {
          updates.google_rating = googleData.rating;
        }
        if (googleData.review_count) {
          updates.google_review_count = googleData.review_count;
        }
        if (googleData.reviews?.length > 0) {
          updates.google_reviews = googleData.reviews;
        }

        // STEP 3: Verify website match
        let websiteMatch = false;
        if (googleData.website_url) {
          const normalizeUrl = (url) => {
            return url?.toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
          };
          
          const googleWebsite = normalizeUrl(googleData.website_url);
          const userWebsite = normalizeUrl(siteRequest.existing_website_url);
          
          websiteMatch = googleWebsite === userWebsite;
        }
        
        updates.reviews_verified = websiteMatch;

        // STEP 4: Import Google Business photos if no gallery exists
        if (googleData.photos?.length > 0 && (!siteRequest.gallery_images || siteRequest.gallery_images.length === 0)) {
          updates.gallery_images = googleData.photos.slice(0, 6);
        }
      } catch (error) {
        console.error('Google Business scraping failed:', error);
      }
    }

    // Update site request with scraped data
    if (Object.keys(updates).length > 0) {
      await base44.asServiceRole.entities.SiteRequest.update(site_request_id, updates);
    }

    return Response.json({ 
      success: true,
      updates,
      message: 'Business data scraped successfully'
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});