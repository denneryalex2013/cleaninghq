import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { site_request_id } = await req.json();

    if (!site_request_id) {
      return Response.json({ error: 'site_request_id required' }, { status: 400 });
    }

    const siteRequests = await base44.asServiceRole.entities.SiteRequest.filter({ id: site_request_id });
    if (siteRequests.length === 0) {
      return Response.json({ error: 'Site request not found' }, { status: 404 });
    }

    const siteRequest = siteRequests[0];
    const baseUrl = siteRequest.preview_url || `https://preview.cleaninghq.com/${site_request_id}`;
    const citySlug = siteRequest.city.toLowerCase().replace(/\s+/g, '-');

    const urls = [
      { loc: baseUrl, priority: '1.0' },
      { loc: `${baseUrl}/contact`, priority: '0.8' },
      { loc: `${baseUrl}/get-a-quote`, priority: '0.9' }
    ];

    // Add service pages
    if (siteRequest.service_types) {
      siteRequest.service_types.forEach(service => {
        const serviceSlug = service.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '');
        urls.push({
          loc: `${baseUrl}/${serviceSlug}-${citySlug}`,
          priority: '0.8'
        });
      });
    }

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml'
      }
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});