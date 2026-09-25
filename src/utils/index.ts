function toKebabCase(input: string): string {
    return input
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

// Final SEO-migration slugs that differ from a plain kebab-case of the page
// name (renames, nesting under a parent path, or merges). Source: the .org →
// .com canonical URL map. Anything not listed here just falls back to generic
// kebab-casing.
// Note: 'Home' is deliberately NOT overridden to '/' here — the Pages map
// still needs createPageUrl('Home') to produce the distinct '/home' alias
// route (see pageSeo['/home'], noindexed, canonicalizing to '/'). Link to the
// homepage with a literal "/" instead of createPageUrl('Home').
const PATH_OVERRIDES: Record<string, string> = {
    About: '/what-we-do',
    MeetTheTeam: '/meet-our-team',
    Programs: '/programs-locations',
    MensCampus: '/programs-locations/mens-campus',
    WomensCampus: '/programs-locations/womens-campus',
    WomensCampusGallery: '/programs-locations/womens-campus/gallery',
    ComprehensiveApproach: '/faith-based-program',
    Testimonials: '/testimonies',
    RecurringDonation: '/donate/monthly',
    SponsorStudent: '/donate-sponsor-student',
    VehicleDonation: '/vehicle-donation-program',
    VehicleDonationForm: '/vehicle-donation-program/form',
    FreedomClassic: '/golf-tournament',
    MicroBusinesses: '/workforce-development',
    Volunteer: '/get-involved',
    Internship: '/get-involved/internship',
    MediaResources: '/media',
    IntakeForm: '/get-help-now',
    TermsConditions: '/terms-of-use',
};

export function createPageUrl(pageName: string) {
    const trimmed = pageName.trim();
    if (Object.prototype.hasOwnProperty.call(PATH_OVERRIDES, trimmed)) {
        return PATH_OVERRIDES[trimmed];
    }
    return '/' + toKebabCase(trimmed);
}