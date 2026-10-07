import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const LOGO_URL = 'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/8e4d016ac_logo.png';
const HERO_URL = 'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/12bfccec5_generated_image.png';
const SITE_URL = 'https://mercyhouseatc.com';

function buildLaunchAlertHtml(firstName: string): string {
  const name = firstName || 'friend';
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:24px 12px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e7eb;">
        <!-- Header band -->
        <tr>
          <td style="background-color:#cfa869;padding:24px 36px;text-align:center;">
            <img src="${LOGO_URL}" alt="Mercy House Adult Teen Challenge" width="40" style="display:block;margin:0 auto 12px;" />
            <p style="margin:0;font-size:12px;letter-spacing:4px;font-weight:700;text-transform:uppercase;color:#000000;">Mercy House Adult Teen Challenge</p>
          </td>
        </tr>
        <!-- Hero image -->
        <tr>
          <td style="padding:0;">
            <img src="${HERO_URL}" alt="The new Mercy House website homepage" width="600" style="display:block;width:100%;max-width:600px;height:auto;" />
          </td>
        </tr>
        <!-- Headline -->
        <tr>
          <td style="padding:44px 36px 20px;">
            <p style="margin:0 0 14px;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:#cfa869;">For Staff</p>
            <h1 style="margin:0 0 16px;font-size:32px;line-height:1.12;font-weight:700;color:#15273a;">Our new website is live, ${name}.</h1>
            <p style="margin:0;font-size:17px;line-height:1.6;color:#475569;">We have rebuilt mercyhouseatc.com from the ground up to better serve the people God brings to our door and to make your work easier behind the scenes. Here are five features worth knowing about.</p>
          </td>
        </tr>
        <tr><td style="padding:0 36px;"><hr style="border:0;border-top:1px solid #e5e7eb;margin:0;" /></td></tr>
        <!-- Features label -->
        <tr>
          <td style="padding:36px 36px 18px;">
            <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:#cfa869;">Top 5 Features</p>
          </td>
        </tr>
        <!-- Feature 1 -->
        <tr><td style="padding:0 36px 14px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;padding:22px 24px;">
            <tr><td>
              <h2 style="margin:0 0 6px;font-size:18px;font-weight:700;color:#15273a;">1. Online Intake Applications</h2>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">Applicants can now apply online for the men's or women's program. Each application auto-files to the shared staff Drive and appears in the Employee Portal for review, so nothing falls through the cracks.</p>
            </td></tr>
          </table>
        </td></tr>
        <!-- Feature 2 -->
        <tr><td style="padding:0 36px 14px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;padding:22px 24px;">
            <tr><td>
              <h2 style="margin:0 0 6px;font-size:18px;font-weight:700;color:#15273a;">2. Employee Portal</h2>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">A central dashboard to manage applications, bed counts, blog posts, events, media, testimonials, campaigns, analytics, and user access, all in one place. Log in from the footer link anytime.</p>
            </td></tr>
          </table>
        </td></tr>
        <!-- Feature 3 -->
        <tr><td style="padding:0 36px 14px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;padding:22px 24px;">
            <tr><td>
              <h2 style="margin:0 0 6px;font-size:18px;font-weight:700;color:#15273a;">3. Volunteer Management</h2>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">Volunteer applications, shift scheduling, automated SMS reminders, and Google Calendar sync, all managed from the portal. Coordinating help has never been this simple.</p>
            </td></tr>
          </table>
        </td></tr>
        <!-- Feature 4 -->
        <tr><td style="padding:0 36px 14px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;padding:22px 24px;">
            <tr><td>
              <h2 style="margin:0 0 6px;font-size:18px;font-weight:700;color:#15273a;">4. Student Sponsorship and Donations</h2>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">Stripe-powered recurring sponsorships and one-time donations, plus a public donor wall celebrating generosity. Every gift is tracked and synced automatically.</p>
            </td></tr>
          </table>
        </td></tr>
        <!-- Feature 5 -->
        <tr><td style="padding:0 36px 14px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;padding:22px 24px;">
            <tr><td>
              <h2 style="margin:0 0 6px;font-size:18px;font-weight:700;color:#15273a;">5. AI Assistant</h2>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">A floating AI chat on the site answers visitor questions around the clock and routes people to intake, donation, or help, so no one waits for office hours to take a first step.</p>
            </td></tr>
          </table>
        </td></tr>
        <!-- CTA -->
        <tr><td style="padding:36px 36px 16px;">
          <a href="${SITE_URL}" style="display:inline-block;background-color:#cfa869;color:#000000;font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:0px;">Explore the New Website</a>
        </td></tr>
        <tr><td style="padding:8px 36px 0;"><hr style="border:0;border-top:1px solid #e5e7eb;margin:0;" /></td></tr>
        <!-- Training callout -->
        <tr><td style="padding:32px 36px 14px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#15273a;padding:26px 28px;">
            <tr><td>
              <p style="margin:0 0 10px;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:#cfa869;">Staff Training</p>
              <h2 style="margin:0 0 10px;font-size:24px;font-weight:700;color:#ffffff;">Mark your calendar: October 15</h2>
              <p style="margin:0 0 6px;font-size:15px;color:#e2e8f0;"><strong style="color:#ffffff;">When:</strong> Wednesday, October 15, 2:00 PM to 3:00 PM CST</p>
              <p style="margin:0 0 14px;font-size:15px;color:#e2e8f0;"><strong style="color:#ffffff;">What:</strong> A live walkthrough of the new site and the Employee Portal.</p>
              <p style="margin:0;font-size:14px;color:#cbd5e1;">More info to come, including the meeting link and agenda. Watch your inbox.</p>
            </td></tr>
          </table>
        </td></tr>
        <!-- Footer band -->
        <tr>
          <td style="background-color:#cfa869;padding:26px 36px 30px;text-align:center;">
            <p style="margin:0 0 8px;font-size:17px;font-weight:700;color:#000000;">Mercy House Adult Teen Challenge</p>
            <p style="margin:0;font-size:13px;color:#000000;">Georgetown and Learned, Mississippi &middot; mercyhouseatc.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { email, full_name, automation_secret } = body;

    // Allow workflow automation calls (no user session) via shared secret.
    const isAutomation = automation_secret && Deno.env.get('AUTOMATION_SECRET') &&
      automation_secret === Deno.env.get('AUTOMATION_SECRET');

    if (!isAutomation) {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const firstName = full_name ? String(full_name).split(' ')[0] : '';
    const subject = `Our new website is live${firstName ? ', ' + firstName : ''}`;
    const htmlBody = buildLaunchAlertHtml(firstName);

    const mimeMessage = [
      `To: ${email}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=UTF-8',
      'MIME-Version: 1.0',
      '',
      htmlBody,
    ].join('\r\n');

    const raw = base64UrlEncode(mimeMessage);

    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw }),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gmail API error:', response.status, errorText);
      return Response.json({ error: `Gmail API error: ${errorText}` }, { status: 502 });
    }

    const result = await response.json();
    return Response.json({ sent: true, messageId: result.id, to: email });
  } catch (error) {
    console.error('sendLaunchAlertViaGmail error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}