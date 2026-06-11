import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (user?.role !== 'admin') {
            return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const { keywords } = await req.json();

        if (!keywords || keywords.trim().length === 0) {
            return Response.json({ error: 'Keywords are required' }, { status: 400 });
        }

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: `Write a powerful, authentic testimonial for a Mercy House Adult & Teen Challenge graduate. 
            
Based on these keywords/themes: ${keywords}

Guidelines:
- Write in first person (as if the graduate is speaking)
- Be authentic and heartfelt, not overly dramatic
- Keep it 2-3 paragraphs (150-200 words)
- Focus on transformation, hope, and new life
- Mention faith and the program's impact
- Make it inspiring but genuine
- End on a hopeful note about the future

Write the testimonial now:`,
        });

        return Response.json({ testimonial: response });
    } catch (error) {
        console.error('Generate testimonial error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});