import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';
import { chat } from '../../shared/aiGateway.ts';

// Writes a first-person graduate testimonial from a set of themes. Admin-only;
// the model runs through the Cloudflare AI Gateway.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });

    const { keywords } = await req.json().catch(() => ({}));
    if (!keywords || keywords.trim().length === 0) {
      return Response.json({ error: 'Keywords are required' }, { status: 400 });
    }

    const testimonial = await chat({
      maxTokens: 900,
      messages: [
        {
          role: 'user',
          content: `Write a powerful, authentic testimonial for a Mercy House Adult Teen Challenge graduate.

Based on these keywords/themes: ${keywords}

Guidelines:
- Write in first person (as if the graduate is speaking)
- Be authentic and heartfelt, not overly dramatic
- Keep it 2-3 paragraphs (150-200 words)
- Focus on transformation, hope, and new life
- Mention faith and the program's impact
- Make it inspiring but genuine
- End on a hopeful note about the future

Return only the testimonial text, with no preamble or heading.`,
        },
      ],
    });

    return Response.json({ testimonial });
  } catch (error) {
    console.error('Generate testimonial error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}