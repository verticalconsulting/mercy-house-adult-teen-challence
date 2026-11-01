import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const STAFF_RECIPIENTS = [
  'corey@verticalconsulting.net',
  'mmilliman@mercyhouseatc.com',
  'khardin@mercyhouseatc.com',
];

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);

    // One-only-workflow call: authenticate as the workflow creator (an admin).
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const question = (body.question || '').trim();
    if (!question) return Response.json({ error: 'question is required' }, { status: 400 });

    // Capture an email the visitor may have left in the message for later follow-up.
    const emailMatch = question.match(EMAIL_RE);
    const userEmail = emailMatch ? emailMatch[0] : (body.user_email || '');

    // Research the question via web search on other Adult & Teen Challenge sites.
    const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt:
        'You are researching a question asked to the Mercy House Adult & Teen Challenge website assistant in Mississippi.\n\n' +
        'Search the web, especially other Adult & Teen Challenge organization websites (such as teenchallenge.com and local Teen Challenge chapter sites), to find how similar faith-based residential recovery programs answer this question.\n\n' +
        'First decide needs_escalation: set it true if this is a substantive question about recovery programs, admissions, policies, costs, donations, volunteering, events, or Mercy House operations that the assistant does not already answer from its standard knowledge; set it false if it is a greeting, small talk, or a question the assistant already handles.\n\n' +
        'If needs_escalation is true, write proposed_answer as a concise, helpful 2 to 4 sentence answer in a warm, faith-friendly tone that staff can approve and publish. Write research_summary as a short summary of what you found across other Teen Challenge sites. Write sources as a list of the URLs you used.\n\n' +
        'Question: """' + question + '"""',
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          needs_escalation: { type: 'boolean' },
          proposed_answer: { type: 'string' },
          research_summary: { type: 'string' },
          sources: { type: 'array', items: { type: 'string' } },
        },
        required: ['needs_escalation', 'proposed_answer', 'research_summary', 'sources'],
      },
    });

    if (llm.needs_escalation === false) {
      return Response.json({ escalated: false, reason: 'not_substantive' });
    }

    const approvalToken = crypto.randomUUID();
    const record = await base44.asServiceRole.entities.UnansweredQuestion.create({
      question,
      research_summary: llm.research_summary || '',
      proposed_answer: llm.proposed_answer || '',
      sources: Array.isArray(llm.sources) ? llm.sources : [],
      user_email: userEmail,
      status: 'pending_review',
      approval_token: approvalToken,
      conversation_id: body.conversation_id || '',
      app_user_id: body.app_user_id || '',
    });

    // Build the approval link from the server-set public app origin.
    const appUrl = req.headers.get('X-Base44-App-Url') || 'https://mercy-house-hope.base44.app';
    const approveUrl = `${appUrl}/functions/approveUnansweredQuestion?question_id=${record.id}&token=${approvalToken}`;
    const sourcesList = (record.sources || []).map((s) => `- ${s}`).join('\n');

    // Email each staff member for review. A non-registered external address may be
    // refused by the platform; log failures without failing the whole run.
    const sendResults = await Promise.allSettled(
      STAFF_RECIPIENTS.map((to) =>
        base44.asServiceRole.integrations.Core.SendEmail({
          to,
          template_name: 'UnansweredQuestionReview',
          subject: 'Review a new Mercy House question',
          variables: {
            question: record.question,
            research_summary: record.research_summary,
            proposed_answer: record.proposed_answer,
            sources: sourcesList,
            approve_url: approveUrl,
          },
          category: 'transactional',
        })
      )
    );
    const failed = sendResults.filter((r) => r.status === 'rejected').length;
    if (failed > 0) console.warn(`${failed} staff email(s) failed to send`);

    return Response.json({ escalated: true, question_id: record.id });
  } catch (error) {
    console.error('researchUnansweredQuestion error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}