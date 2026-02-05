import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const user = await base44.auth.me();
        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const { message, link, imageUrl } = await req.json();

        const pageAccessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');
        const pageId = Deno.env.get('FACEBOOK_PAGE_ID');

        if (!pageAccessToken || !pageId) {
            return Response.json({ 
                error: 'Facebook credentials not configured. Please set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID in settings.' 
            }, { status: 400 });
        }

        // Prepare the post payload
        const payload = {
            message: message,
            access_token: pageAccessToken
        };

        // Add link if provided
        if (link) {
            payload.link = link;
        }

        // Post to Facebook
        const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Facebook API error:', data);
            return Response.json({ 
                error: data.error?.message || 'Failed to post to Facebook' 
            }, { status: response.status });
        }

        return Response.json({ 
            success: true, 
            postId: data.id,
            message: 'Successfully posted to Facebook!'
        });
    } catch (error) {
        console.error('Facebook posting error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});