/**
 * Mercy House workforce development businesses.
 *
 * Each entry renders as a card on the Workforce Development page. `tile` picks
 * the logo plate behind the mark: 'navy' for light-on-dark logos, 'white' for
 * dark-on-light logos. Businesses without a published logo file are shown as a
 * typographic wordmark on the same plate so all five cards stay consistent.
 */
export const workforceBusinesses = [
  {
    title: 'SuperThrift',
    tagline: 'Mercy House social enterprise',
    tile: 'navy',
    description:
      'Community thrift stores in Pearl and Byram offering quality secondhand goods while training residents in retail operations, customer service, and inventory management.',
    href: 'https://superthriftdeals.org',
  },
  {
    title: 'Vehicle Donation',
    logo: 'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/e08f3c597_MercyHouseVDP_White_Square.png',
    tile: 'navy',
    description:
      'Accepting vehicle donations to support our mission. Provides tax benefits to donors and funding for our programs.',
    href: 'https://vehicledonationms.com',
  },
  {
    title: 'Mercy House Auto Center',
    logo: 'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/0bc3fc63c_MercyHouseAuto_Black_SquareNEW.png',
    tile: 'white',
    description:
      'Professional automotive training center where residents learn mechanics, body work, and automotive technology — preparing them for well-paying careers upon graduation.',
    href: 'https://mercyhouseautocenter.com/',
  },
  {
    title: 'Products With A Purpose',
    logo: 'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/4e1c20dbb_ProductwithaPurpose1-023.png',
    tile: 'white',
    description:
      'Specialty products crafted by residents, combining quality craftsmanship with purpose. Every purchase directly supports the Mercy House mission and resident development.',
    href: 'https://www.productwithapurpose.org/',
  },
  {
    title: 'Mercy House Elite Gutters',
    tagline: 'Trade skills in action',
    tile: 'white',
    description:
      'A full-service seamless gutter, downspout, and leaf guard installation company serving Brandon, Madison, and central Mississippi. Residents receive hands-on job training in gutter system design, installation, cleaning, and maintenance — building real-world trade skills and work ethic. Backed by a 5-Year Craftsmanship Guarantee.',
    href: 'https://www.myelitegutters.com/',
  },
];

export const workforceStats = [
  { icon: 'TrendingUp', value: '100%', label: 'Donations to Mission' },
  { icon: 'Users', value: '500+', label: 'Residents Trained' },
  { icon: 'Heart', value: '15', label: 'Years of Impact' },
];