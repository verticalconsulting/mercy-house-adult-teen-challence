import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';

// Analyzes an already-uploaded image (by file_url) and returns a quality
// score plus a suggested title/caption for the Women's Campus gallery.
// Admin-only; InvokeLLM runs under the service role so vision credits are
// billed to the app. UploadFile itself stays client-side.
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });

    const { file_url } = await req.json();
    if (!file_url) return Response.json({ error: 'file_url is required' }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are an image optimization assistant. Analyze this image and return a JSON object with:
- quality_score: number 1-10 rating the image quality
- suggested_title: a short descriptive title for a women's campus gallery
- description: a 1-2 sentence caption suitable for a ministry gallery

Keep the response concise and appropriate for a Christian women's recovery program.`,
      file_urls: [file_url],
      response_json_schema: {
        type: 'object',
        properties: {
          quality_score: { type: 'number' },
          suggested_title: { type: 'string' },
          description: { type: 'string' },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error('analyzeMediaImage error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}