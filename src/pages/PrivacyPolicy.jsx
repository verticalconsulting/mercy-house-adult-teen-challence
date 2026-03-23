import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="w-full bg-white dark:bg-slate-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-navy dark:text-gold mb-3">Privacy Policy</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 text-sm">Last updated: March 2025</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-gold mb-3">1. Who We Are</h2>
            <p>
              Mercy House Adult &amp; Teen Challenge of Mississippi ("Mercy House," "we," "our," or "us") is a
              501(c)(3) nonprofit, faith-based ministry organization headquartered in Georgetown, Mississippi.
              This Privacy Policy describes how we collect, use, and protect information you provide when you
              interact with our website at <strong>mercyhouseworks.org</strong> and any related forms or services.
            </p>
            <p className="mt-3">
              Contact us regarding privacy concerns at:{' '}
              <a href="mailto:info@mercyhouseatc.com" className="text-navy dark:text-gold hover:underline">
                info@mercyhouseatc.com
              </a>{' '}
              | 855-893-7333 | 1110 Mary St, PO Box 266, Georgetown, MS 39078
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-gold mb-3">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Contact Information:</strong> Name, email address, phone number, and mailing address when
                you fill out a contact form, intake application, or volunteer application.
              </li>
              <li>
                <strong>Program Application Information:</strong> For intake applications, we collect personal and
                health-related information necessary to evaluate program eligibility. This information is treated as
                strictly confidential.
              </li>
              <li>
                <strong>Donation Information:</strong> When you make a donation, payment is processed by Stripe, a
                third-party payment processor. We store your name and email for donation records; full payment card
                details are never stored on our servers.
              </li>
              <li>
                <strong>Usage Data:</strong> We may collect anonymous analytics data (pages visited, browser type,
                referring URL) to improve the website experience. This data is not personally identifiable.
              </li>
              <li>
                <strong>Cookies:</strong> Our website may use cookies or similar tracking technologies to improve
                site functionality. You may disable cookies through your browser settings; however, this may affect
                some site features.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-gold mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Process and respond to intake applications and inquiries</li>
              <li>Contact you regarding your inquiry, application, or donation</li>
              <li>Send ministry updates, newsletters, and event information (with your consent)</li>
              <li>Process donations and issue tax receipts</li>
              <li>Improve our website and ministry communications</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-4">
              We do <strong>not</strong> sell, rent, or trade your personal information to third parties for commercial
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-gold mb-3">4. Confidentiality of Application Information</h2>
            <p>
              Information submitted through our intake application is treated with the highest level of
              confidentiality. It is used solely for the purpose of evaluating program eligibility and coordinating
              admissions. Staff who handle application data are trained and expected to maintain confidentiality in
              accordance with applicable laws and ethical standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-gold mb-3">5. Third-Party Services</h2>
            <p>We may use the following third-party services that have their own privacy practices:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Stripe</strong> — Payment processing for donations. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-navy dark:text-gold hover:underline">stripe.com/privacy</a>.</li>
              <li><strong>Google Analytics</strong> — Anonymous website usage analytics. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-navy dark:text-gold hover:underline">policies.google.com/privacy</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-gold mb-3">6. Data Retention</h2>
            <p>
              We retain personal information for as long as necessary to fulfill the purposes described in this
              policy, or as required by applicable law. Donation records are retained for a minimum of seven years
              for financial accountability and IRS compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-gold mb-3">7. Your Rights</h2>
            <p>
              You may contact us at any time to request access to, correction of, or deletion of your personal
              information. To opt out of ministry communications, you may reply "unsubscribe" to any email or
              contact us directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-gold mb-3">8. Children's Privacy</h2>
            <p>
              Our website is not directed at children under 13. We do not knowingly collect personal information
              from children under 13. If you believe we have inadvertently collected such information, please contact
              us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-gold mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated
              effective date. Continued use of our website following any changes constitutes your acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy dark:text-gold mb-3">10. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <div className="mt-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <p><strong>Mercy House Adult &amp; Teen Challenge of Mississippi</strong></p>
              <p>1110 Mary St, PO Box 266</p>
              <p>Georgetown, MS 39078</p>
              <p className="mt-2">
                Email:{' '}
                <a href="mailto:info@mercyhouseatc.com" className="text-navy dark:text-gold hover:underline">
                  info@mercyhouseatc.com
                </a>
              </p>
              <p>Phone: 855-893-7333</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}