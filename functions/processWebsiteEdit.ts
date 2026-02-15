import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { site_request_id, message, file_url } = await req.json();

        if (!site_request_id || !message) {
            return Response.json({ error: 'site_request_id and message are required' }, { status: 400 });
        }

        // Get site request and verify ownership & subscription
        const siteRequests = await base44.entities.SiteRequest.filter({ id: site_request_id, created_by: user.email });
        
        if (siteRequests.length === 0) {
            return Response.json({ error: 'Site request not found' }, { status: 404 });
        }

        const siteRequest = siteRequests[0];

        if (siteRequest.subscription_status !== 'active') {
            return Response.json({ error: 'Active subscription required' }, { status: 403 });
        }

        // Use AI to interpret the request and generate changes
        const prompt = `You are a website content editor. The user wants to edit their cleaning company website.

Current website data:
${JSON.stringify(siteRequest, null, 2)}

User request: "${message}"
${file_url ? `User uploaded file: ${file_url}` : ''}

Parse this request and return a JSON object with:
1. "edit_type": one of ["text", "image", "layout", "color", "service", "general"]
2. "changes": an object with the specific fields to update in the site request
3. "response": a friendly confirmation message to show the user

Example responses:
- If user says "change headline to X" → {"edit_type": "text", "changes": {"headline": "X"}, "response": "I've updated your headline to 'X'"}
- If user says "change primary color to blue" → {"edit_type": "color", "changes": {"primary_color": "#3B82F6"}, "response": "I've changed your primary color to blue"}
- If user uploads logo → {"edit_type": "image", "changes": {"logo": "url"}, "response": "I've updated your logo"}
- If user says "add office cleaning to services" → {"edit_type": "service", "changes": {"services": ["existing", "Office Cleaning"]}, "response": "I've added Office Cleaning to your services"}

Only return valid JSON, no other text.`;

        const aiResponse = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    edit_type: { type: "string" },
                    changes: { type: "object" },
                    response: { type: "string" }
                }
            }
        });

        // Apply the changes
        const updatedGeneratedContent = {
            ...siteRequest.generated_content,
            ...aiResponse.changes,
            last_edited: new Date().toISOString()
        };

        // Update site request with new data
        const updateData = { generated_content: updatedGeneratedContent };
        
        // Handle direct field updates
        if (aiResponse.changes.company_name) updateData.company_name = aiResponse.changes.company_name;
        if (aiResponse.changes.email) updateData.email = aiResponse.changes.email;
        if (aiResponse.changes.phone) updateData.phone = aiResponse.changes.phone;
        if (aiResponse.changes.city) updateData.city = aiResponse.changes.city;
        if (aiResponse.changes.state) updateData.state = aiResponse.changes.state;
        if (aiResponse.changes.primary_color) updateData.primary_color = aiResponse.changes.primary_color;
        if (aiResponse.changes.services) updateData.services = aiResponse.changes.services;
        if (aiResponse.changes.logo) updateData.logo = aiResponse.changes.logo;
        if (aiResponse.changes.style) updateData.style = aiResponse.changes.style;

        await base44.entities.SiteRequest.update(site_request_id, updateData);

        // Save the edit record
        await base44.entities.WebsiteEdit.create({
            user_id: user.id,
            site_request_id: site_request_id,
            message: message,
            role: 'user',
            status: 'completed',
            edit_type: aiResponse.edit_type,
            applied_changes: aiResponse.changes
        });

        await base44.entities.WebsiteEdit.create({
            user_id: user.id,
            site_request_id: site_request_id,
            message: aiResponse.response,
            role: 'assistant',
            status: 'completed',
            edit_type: aiResponse.edit_type,
            applied_changes: aiResponse.changes
        });

        return Response.json({
            success: true,
            response: aiResponse.response,
            changes: aiResponse.changes,
            edit_type: aiResponse.edit_type
        });

    } catch (error) {
        console.error('Website edit error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});