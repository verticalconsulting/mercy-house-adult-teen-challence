import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';

// Generates a structured blog post (title/excerpt/content/tags/SEO metadata)
// for Mercy House from a free-form prompt. Admin-only; runs InvokeLLM under
// the service role so integration credits are billed to the app, not the
// caller's user token, and the prompt template is controlled server-side.
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });

    const { prompt } = await req.json();
    if (!prompt || !prompt.trim()) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${prompt}\n\nIMPORTANT: Generate the response in the following JSON format:
{
  "title": "Compelling blog post title (50-60 characters)",
  "excerpt": "Brief summary for preview (120-160 characters)",
  "content": "Full blog post content in markdown format",
  "tags": ["tag1", "tag2", "tag3"],
  "meta_description": "SEO-friendly description (150-160 characters)",
  "meta_keywords": ["keyword1", "keyword2", "keyword3"]
}

Make the content engaging, SEO-optimized, and aligned with Christian faith-based recovery themes.`,
      response_json_schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          excerpt: { type: 'string' },
          content: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          meta_description: { type: 'string' },
          meta_keywords: { type: 'array', items: { type: 'string' } },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error('generateBlogPost error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}