import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This function is called by an entity automation (no user context) and
    // also supports manual invocation from the admin portal. The client-
    // supplied `data` object is NEVER trusted — the testimonial is always
    // fetched from the database so an unauthenticated caller cannot post
    // arbitrary content to the organization's Facebook page (CWE-306).
    const body = await req.json().catch(() => ({}));

    let testimonialId;

    if (body?.event) {
      // Entity-automation trigger: validate the event shape and use its id.
      const ev = body.event;
      if ((ev.type !== 'create' && ev.type !== 'update') ||
          ev.entity_name !== 'Testimonial' || !ev.entity_id) {
        return Response.json({ error: 'Invalid automation payload' }, { status: 400 });
      }
      testimonialId = ev.entity_id;
    } else {
      // Manual invocation from the admin portal — require an admin session.
      let user;
      try {
        user = await base44.auth.me();
      } catch {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }
      testimonialId = body?.testimonial_id;
      if (!testimonialId) {
        return Response.json({ error: 'testimonial_id is required' }, { status: 400 });
      }
    }

    // Always read the testimonial from the database — never from the payload.
    const testimonial = await base44.asServiceRole.entities.Testimonial.get(testimonialId);
    if (!testimonial) {
      return Response.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    // Only share published women's success stories
    if (!testimonial.published) {
      return Response.json({ skipped: true, reason: 'Testimonial not published' });
    }

    // Skip if already shared
    if (testimonial.shared_to_facebook) {
      return Response.json({ skipped: true, reason: 'Already shared to Facebook', facebook_post_id: testimonial.facebook_post_id });
    }

    const pageAccessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');
    const pageId = Deno.env.get('FACEBOOK_PAGE_ID');

    if (!pageAccessToken || !pageId) {
      console.error('Facebook credentials not configured. Set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID as secrets.');
      return Response.json({
        error: 'Facebook credentials not configured. Set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID in app secrets.'
      }, { status: 400 });
    }

    // Build the Facebook post message
    const name = testimonial.graduate_name || 'A Mercy House graduate';
    const yearText = testimonial.graduation_year ? ` (${testimonial.graduation_year})` : '';
    const text = testimonial.testimonial_text || '';

    const message = `🌟 Volunteer Success Story${yearText}\n\n"${text}"\n\n— ${name}, Mercy House Adult Teen Challenge\n\n#MercyHouse #TeenChallenge #ChangedLives #Recovery`;

    const payload = {
      message,
      access_token: pageAccessToken
    };

    // If photo exists, try to post with photo
    if (testimonial.photo_url) {
      payload.url = testimonial.photo_url;
    }

    const fbResponse = await fetch(`https://graph.facebook.com/v25.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const fbData = await fbResponse.json();

    if (!fbResponse.ok) {
      console.error('Facebook API error:', fbData);
      return Response.json({
        error: fbData?.error?.message || 'Failed to post to Facebook'
      }, { status: fbResponse.status });
    }

    // Mark the testimonial as shared
    if (testimonialId) {
      await base44.asServiceRole.entities.Testimonial.update(testimonialId, {
        shared_to_facebook: true,
        facebook_post_id: fbData.id
      });
    }

    return Response.json({
      success: true,
      postId: fbData.id,
      message: 'Success story shared to Facebook!'
    });
  } catch (error) {
    console.error('shareStoryToFacebook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});