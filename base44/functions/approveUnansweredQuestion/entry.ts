import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

export default async function (req: Request): Promise<Response> {
  const html = (title: string, message: string, status = 200) =>
    new Response(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>body{font-family:Roboto,Arial,sans-serif;background:#f8fafc;color:#334155;margin:0;padding:40px 20px;text-align:center}.card{max-width:480px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:40px}h1{color:#2f4d6f;font-size:22px;margin:0 0 12px}p{font-size:16px;line-height:1.6;margin:0}a{color:#2f4d6f}</style></head><body><div class="card"><h1>${title}</h1><p>${message}</p></div></body></html>`,
      { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );

  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    const questionId = url.searchParams.get('question_id');
    const token = url.searchParams.get('token');

    if (!questionId || !token) {
      return html('Invalid link', 'This approval link is missing required parameters.', 400);
    }

    // Token-gated public action: only the holder of the emailed token may approve.
    const record = await base44.asServiceRole.entities.UnansweredQuestion
      .get(questionId)
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!record) {
      return html('Not found', 'No question was found for this approval link.', 404);
    }
    if (record.approval_token !== token) {
      return html('Invalid approval', 'This approval link is not valid.', 403);
    }
    if (record.status === 'published') {
      return html('Already approved', 'This question has already been approved and published.');
    }

    // Publish the answer to the FAQ knowledge store.
    await base44.asServiceRole.entities.UnansweredQuestion.update(questionId, {
      status: 'published',
      final_answer: record.proposed_answer,
      reviewed_by: 'staff_approval_link',
    });

    // Follow up with the visitor if they left an email.
    if (record.user_email) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: record.user_email,
          template_name: 'UnansweredQuestionAnswer',
          subject: 'An answer to your Mercy House question',
          variables: {
            question: record.question,
            answer: record.proposed_answer || '',
          },
          category: 'transactional',
        });
      } catch (e) {
        console.warn('User follow-up email failed:', e.message);
      }
    }

    return html('Answer approved', "Thank you. The answer is now published on the FAQ page, and the visitor has been followed up with if they left an email.");
  } catch (error) {
    console.error('approveUnansweredQuestion error:', error.message);
    return html('Error', 'Something went wrong while processing your approval.', 500);
  }
}