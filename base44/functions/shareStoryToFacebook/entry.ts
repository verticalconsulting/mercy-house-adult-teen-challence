import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This function is called by an entity automation (no user context)
    // and also supports manual invocation from the admin portal.
    const body = await req.json().catch(() => ({}));

    // Automation payload: { event: { type, entity_name, entity_id }, data: {...} }
    // Manual payload: { testimonial_id: "..." }
    let testimonialId = body?.testimonial_id || body?.event?.entity_id;
    let testimonial = body?.data;

    // If called manually or data is missing, fetch from DB
    if (!testimonial && testimonialId) {
      testimonial = await base44.asServiceRole.entities.Testimonial.get(testimonialId);
    }
    if (!testimonialId && testimonial) {
      testimonialId = testimonial.id;
    }

    if (!testimonial) {
      return Response.json({ error: 'No testimonial data provided' }, { status: 400 });
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

    const message = `🌟 Volunteer Success Story${yearText}\n\n"${text}"\n\n— ${name}, Mercy House Adult & Teen Challenge\n\n#MercyHouse #TeenChallenge #ChangedLives #Recovery`;

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