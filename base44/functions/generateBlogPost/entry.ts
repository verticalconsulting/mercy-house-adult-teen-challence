import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';
import { chatJson } from '../../shared/aiGateway.ts';

// Generates a structured blog post (title/excerpt/content/tags/SEO metadata)
// for Mercy House from a free-form prompt. Admin-only; the model runs through
// the Cloudflare AI Gateway so generation is billed and logged there, and the
// prompt template stays server-side.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });

    const { prompt } = await req.json().catch(() => ({}));
    if (!prompt || !prompt.trim()) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = await chatJson({
      maxTokens: 3000,
      messages: [
        {
          role: 'system',
          content:
            'You write for Mercy House Adult Teen Challenge, a Christ-centered residential recovery ministry in Mississippi. ' +
            'Respond with a single JSON object and nothing else.',
        },
        {
          role: 'user',
          content: `${prompt}

Return ONLY a JSON object in exactly this shape:
{
  "title": "Compelling blog post title (50-60 characters)",
  "excerpt": "Brief summary for preview (120-160 characters)",
  "content": "Full blog post content in markdown format",
  "tags": ["tag1", "tag2", "tag3"],
  "meta_description": "SEO-friendly description (150-160 characters)",
  "meta_keywords": ["keyword1", "keyword2", "keyword3"]
}

Make the content engaging, SEO-optimized, and aligned with Christian faith-based recovery themes.`,
        },
      ],
    });

    return Response.json(result);
  } catch (error) {
    console.error('generateBlogPost error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}