/**
 * Plain-text FAQ questions and answers for the FAQPage JSON-LD schema.
 *
 * The visible FAQ component renders richer JSX (links, bold, etc.), but
 * structured data must be plain text. This is a curated subset of the most
 * search-relevant Q&As — enough for Google to surface rich results without
 * duplicating every answer verbatim.
 */
export const FAQ_SCHEMA_ENTRIES = [
  {
    question: 'Is Mercy House a rehab or a medical treatment center?',
    answer: 'No. Mercy House is a Christ-centered, faith-based residential recovery ministry, not a medical or clinical rehab. We rely on the teachings of Christ, the work of the Holy Spirit, and the practical application of biblical principles as the core of transformation. We approach life-controlling issues from a spiritual perspective and call our process discipleship, not treatment.',
  },
  {
    question: 'How long is the program?',
    answer: 'The residential program is 12 months. Progression through the phases depends on each student\'s determination and growth rather than a fixed calendar — it\'s about real change, not just time served.',
  },
  {
    question: 'How do I apply for the program?',
    answer: 'You can start by calling our intake coordinator at (601) 720-3718 or by completing our secure online Intake Application. Our intake staff will walk you through admission requirements and answer any questions.',
  },
  {
    question: 'Is the program voluntary? Can someone be forced to attend?',
    answer: 'Yes — entrance is completely voluntary. We are not a lock-down facility and cannot take someone against their will. A person must genuinely want help and agree to participate in every aspect of the program, including its faith-based elements.',
  },
  {
    question: 'Do I need to detox before coming to Mercy House?',
    answer: 'Yes. Most students need to detox — preferably a medically supervised detox — before entering. Our program is not a medical detox facility. Your intake coordinator can help recommend local resources to complete detox safely before admission.',
  },
  {
    question: 'How much does the program cost?',
    answer: 'There is a $1,000 intake fee that helps offset initial program costs. Beyond that, students are not charged monthly tuition — much of the program is funded through donations and our student-participating micro-businesses. No one is turned away for inability to pay; payment plans and scholarships are available.',
  },
  {
    question: 'Does Mercy House take insurance or Medicaid?',
    answer: 'No. Because we are a faith-based ministry and not a licensed medical treatment center, we do not bill insurance or Medicaid. Our program is funded through the modest intake fee and the generosity of donors. No one is turned away solely for inability to pay — payment plans and scholarships are available.',
  },
  {
    question: 'Where are Mercy House\'s campuses located?',
    answer: 'Mercy House Adult & Teen Challenge operates two campuses in Mississippi: a men\'s campus in Georgetown and a women\'s campus in Learned. Both offer Christ-centered residential recovery programs.',
  },
];

const SITE_ORIGIN = import.meta.env.VITE_SITE_URL || 'https://mercyhouseatc.com';

export function buildFaqPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_ORIGIN}/faq/#faqpage`,
    url: `${SITE_ORIGIN}/faq`,
    mainEntity: FAQ_SCHEMA_ENTRIES.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  };
}