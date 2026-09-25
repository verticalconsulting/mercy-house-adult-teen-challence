/**
 * Per-route SEO metadata for Mercy House Adult & Teen Challenge.
 *
 * Titles follow the pattern: "Primary Keyword | Mercy House Adult & Teen Challenge".
 * Each route has a unique title (~50–60 chars) and description (~150–160 chars).
 * Admin/internal routes are marked `noindex: true`.
 *
 * Keys/paths match the .org → .com canonical URL map final slugs so the SEO
 * migration audit and the routing stay in lockstep.
 *
 * Consumed by <SeoManager /> in Layout, which looks up the current pathname.
 * Dynamic routes (e.g. /news/:slug, /events/event/:id) have no entry here —
 * those pages set their own meta via useShareMeta.
 */
export const pageSeo = {
  '/': {
    title: 'Faith-Based Recovery Program | Mercy House Adult & Teen Challenge',
    description:
      'Christ-centered residential recovery program in Mississippi helping men and women overcome addiction through faith, structure, and community. Get help today.',
    path: '/',
  },
  '/what-we-do': {
    title: 'Our Mission & Story | Mercy House Adult & Teen Challenge',
    description:
      'Discover the mission behind Mercy House Adult & Teen Challenge — a Christ-centered 12-month residential recovery ministry bringing hope to men and women in Mississippi.',
    path: '/what-we-do',
  },
  '/contact': {
    title: 'Contact & Admissions | Mercy House Adult & Teen Challenge',
    description:
      "Reach Mercy House Adult & Teen Challenge for admissions, intake, and campus info in Georgetown and Learned, MS. Call (601) 720-3718. Take the first step today.",
    path: '/contact',
  },
  '/donate': {
    title: 'Donate to Recovery | Mercy House Adult & Teen Challenge',
    description:
      'Your gift funds housing, meals, and Christ-centered care for men and women in residential recovery at Mercy House Adult & Teen Challenge. Give today and change a life.',
    path: '/donate',
  },
  '/get-help-now': {
    title: 'Admissions Application | Mercy House Adult & Teen Challenge',
    description:
      'Apply for residential recovery at Mercy House Adult & Teen Challenge. Start your faith-based addiction recovery journey in Mississippi today. Take the first step.',
    path: '/get-help-now',
    noindex: true,
  },
  '/programs-locations/mens-campus': {
    title: "Men's Recovery Program | Mercy House Adult & Teen Challenge",
    description:
      "Our men's campus offers a Christ-centered residential recovery program for men seeking freedom from drug and alcohol addiction in Mississippi. Get help today.",
    path: '/programs-locations/mens-campus',
  },
  '/programs-locations/womens-campus': {
    title: "Women's Recovery Program | Mercy House Adult & Teen Challenge",
    description:
      "Our women's campus provides a Christ-centered residential recovery program for women and mothers overcoming addiction and life-controlling issues. Get help today.",
    path: '/programs-locations/womens-campus',
  },
  '/programs-locations': {
    title: 'Recovery Programs | Mercy House Adult & Teen Challenge',
    description:
      'Explore the residential recovery programs at Mercy House Adult & Teen Challenge — faith-based addiction recovery for men and women in Mississippi. Find your path.',
    path: '/programs-locations',
  },
  '/faith-based-program': {
    title: 'Our Comprehensive Approach | Mercy House Adult & Teen Challenge',
    description:
      "Discover Mercy House's comprehensive approach to recovery — faith, counseling, education, and workforce development for lasting life change. Take the first step.",
    path: '/faith-based-program',
  },
  '/workforce-development': {
    title: 'Workforce Development | Mercy House Adult & Teen Challenge',
    description:
      'Mercy House Adult & Teen Challenge equips residents with job skills and work experience through social enterprises that fund recovery. Build a new future today.',
    path: '/workforce-development',
  },
  '/testimonies': {
    title: 'Stories of Hope | Mercy House Adult & Teen Challenge',
    description:
      'Read testimonies from graduates whose lives were transformed by Christ-centered residential recovery at Mercy House Adult & Teen Challenge. Find hope in their stories.',
    path: '/testimonies',
  },
  '/get-involved': {
    title: 'Volunteer With Us | Mercy House Adult & Teen Challenge',
    description:
      'Lend your time and talents to Mercy House Adult & Teen Challenge — mentor, teach, and support faith-based recovery in Mississippi. Volunteer today and change a life.',
    path: '/get-involved',
  },
  '/donate-sponsor-student': {
    title: 'Sponsor a Student | Mercy House Adult & Teen Challenge',
    description:
      "Sponsor a student through Mercy House Adult & Teen Challenge and directly fund a man or woman's Christ-centered residential recovery. Change a life today.",
    path: '/donate-sponsor-student',
  },
  '/donate/monthly': {
    title: 'Recurring Giving | Mercy House Adult & Teen Challenge',
    description:
      'Become a monthly giver to Mercy House Adult & Teen Challenge and provide steady support for faith-based addiction recovery. Set up your recurring gift today.',
    path: '/donate/monthly',
  },
  '/golf-tournament': {
    title: 'Freedom Classic Golf Tournament | Mercy House Adult & Teen Challenge',
    description:
      'Join the Freedom Classic golf tournament benefiting Mercy House Adult & Teen Challenge. Sponsor or register a team and support faith-based recovery. Sign up today.',
    path: '/golf-tournament',
  },
  '/teen-challenge-story': {
    title: 'The Teen Challenge Story | Mercy House Adult & Teen Challenge',
    description:
      'Learn the history of Adult & Teen Challenge and how Mercy House carries the legacy of Christ-centered addiction recovery to Mississippi. Discover our roots.',
    path: '/teen-challenge-story',
  },
  '/news': {
    title: 'News & Updates | Mercy House Adult & Teen Challenge',
    description:
      'Read the latest news, events, and stories from Mercy House Adult & Teen Challenge — a faith-based recovery ministry in Mississippi. Stay connected and get help.',
    path: '/news',
  },
  '/events': {
    title: 'Events & News | Mercy House Adult & Teen Challenge',
    description:
      'Browse upcoming events and news from Mercy House Adult & Teen Challenge — fundraisers, graduations, and community gatherings supporting recovery. Join us.',
    path: '/events',
  },
  '/womens-center-calendar': {
    title: "Women's Center Calendar | Mercy House Adult & Teen Challenge",
    description:
      "View the Women's Center calendar for Mercy House Adult & Teen Challenge — upcoming events, chapel services, and recovery program milestones. Plan your visit.",
    path: '/womens-center-calendar',
  },
  '/careers': {
    title: 'Careers & Open Roles | Mercy House Adult & Teen Challenge',
    description:
      'Explore career opportunities at Mercy House Adult & Teen Challenge. Join a Christ-centered team serving men and women in residential recovery. Apply today.',
    path: '/careers',
  },
  '/get-involved/internship': {
    title: 'Internship Program | Mercy House Adult & Teen Challenge',
    description:
      'Apply for the internship program at Mercy House Adult & Teen Challenge and grow in ministry, service, and Christ-centered leadership. Take the first step today.',
    path: '/get-involved/internship',
  },
  '/media': {
    title: 'Media Resources | Mercy House Adult & Teen Challenge',
    description:
      'Access photos, videos, and press resources from Mercy House Adult & Teen Challenge — a faith-based recovery ministry in Mississippi. Download and share.',
    path: '/media',
  },
  '/faq': {
    title: 'Frequently Asked Questions | Mercy House Adult & Teen Challenge',
    description:
      'Get answers about Mercy House Adult & Teen Challenge — admissions, program length, costs, and what to expect from faith-based residential recovery. Get help today.',
    path: '/faq',
  },
  '/meet-our-team': {
    title: 'Our Leadership & Board | Mercy House Adult & Teen Challenge',
    description:
      'Meet the leadership team and board of directors guiding Mercy House Adult & Teen Challenge in its Christ-centered recovery mission in Mississippi. Learn more.',
    path: '/meet-our-team',
  },
  '/financials': {
    title: 'Financials & Transparency | Mercy House Adult & Teen Challenge',
    description:
      'Review the financials and accountability of Mercy House Adult & Teen Challenge, a 501(c)(3) nonprofit (EIN 45-4670832) stewarding gifts for recovery. Learn more.',
    path: '/financials',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Mercy House Adult & Teen Challenge',
    description:
      'Read the privacy policy for Mercy House Adult & Teen Challenge — how we collect, use, and protect your information on our faith-based recovery website.',
    path: '/privacy-policy',
  },
  '/terms-of-use': {
    title: 'Terms & Conditions | Mercy House Adult & Teen Challenge',
    description:
      'Review the terms and conditions for using the Mercy House Adult & Teen Challenge website and supporting our faith-based recovery ministry. Read the details.',
    path: '/terms-of-use',
  },
  '/freedom-from-addiction-starts-here': {
    title: 'Help for Dependency & Abuse | Mercy House Adult & Teen Challenge',
    description:
      'Find help for drug and alcohol dependency at Mercy House Adult & Teen Challenge, a Christ-centered residential recovery program in Mississippi. Get help today.',
    path: '/freedom-from-addiction-starts-here',
  },
  '/thrift-store': {
    title: 'SuperThrift Store | Mercy House Adult & Teen Challenge',
    description:
      'Shop at SuperThrift, a social enterprise of Mercy House Adult & Teen Challenge where every purchase funds faith-based recovery. Shop with purpose today.',
    path: '/thrift-store',
  },
  '/vehicle-donation-program': {
    title: 'Donate Your Vehicle | Mercy House Adult & Teen Challenge',
    description:
      'Donate your car, truck, or boat to Mercy House Adult & Teen Challenge and turn an unused vehicle into housing and care for someone in recovery. Donate today.',
    path: '/vehicle-donation-program',
  },
  '/vehicle-donation-program/form': {
    title: 'Vehicle Donation Form | Mercy House Adult & Teen Challenge',
    description:
      'Start your vehicle donation to Mercy House Adult & Teen Challenge — free pickup, tax-deductible receipt, and support for faith-based recovery. Donate today.',
    path: '/vehicle-donation-program/form',
    noindex: true,
  },
  '/programs-locations/womens-campus/gallery': {
    title: "Women's Campus Gallery | Mercy House Adult & Teen Challenge",
    description:
      "View photos of the women's campus at Mercy House Adult & Teen Challenge — a Christ-centered residential recovery home in Mississippi. See our community.",
    path: '/programs-locations/womens-campus/gallery',
  },

  // ---- Admin / internal routes: indexed off, simple titles ----
  '/employee-portal': {
    title: 'Employee Portal | Mercy House Adult & Teen Challenge',
    description: 'Staff portal for Mercy House Adult & Teen Challenge volunteers and employees.',
    path: '/employee-portal',
    noindex: true,
  },
  '/donation-funnel': {
    title: 'Donation Analytics | Mercy House Adult & Teen Challenge',
    description: 'Internal donation analytics for Mercy House Adult & Teen Challenge staff.',
    path: '/donation-funnel',
    noindex: true,
  },
  '/search-performance': {
    title: 'Search Performance | Mercy House Adult & Teen Challenge',
    description: 'Internal search performance dashboard for Mercy House Adult & Teen Challenge staff.',
    path: '/search-performance',
    noindex: true,
  },
  '/home': {
    title: 'Faith-Based Recovery Program | Mercy House Adult & Teen Challenge',
    description:
      'Christ-centered residential recovery program in Mississippi helping men and women overcome addiction through faith, structure, and community. Get help today.',
    path: '/',
    noindex: true,
  },
};
