import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createPageUrl } from './utils';
import PageNotFound from './lib/PageNotFound';
const MeetTheTeam = lazy(() => import('./pages/MeetTheTeam'));
const WomensCampusGallery = lazy(() => import('./pages/WomensCampusGallery'));
const FreedomClassic = lazy(() => import('./pages/FreedomClassic'));
const FreedomGala = lazy(() => import('./pages/FreedomGala'));
const TeenChallengeStory = lazy(() => import('./pages/TeenChallengeStory'));
const WomensCenterCalendar = lazy(() => import('./pages/WomensCenterCalendar'));
const NewsAndUpdates = lazy(() => import('./pages/NewsAndUpdates'));
const SearchPerformance = lazy(() => import('./pages/SearchPerformance'));
const About = lazy(() => import('./pages/About'));
const Financials = lazy(() => import('./pages/Financials'));
const Programs = lazy(() => import('./pages/Programs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const HelpForDependency = lazy(() => import('./pages/HelpForDependency'));
const MicroBusinesses = lazy(() => import('./pages/MicroBusinesses'));
const ComprehensiveApproach = lazy(() => import('./pages/ComprehensiveApproach'));
const Careers = lazy(() => import('./pages/Careers'));
const Internship = lazy(() => import('./pages/Internship'));
const MediaResources = lazy(() => import('./pages/MediaResources'));
const FAQ = lazy(() => import('./pages/FAQ'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const TestimonyPage = lazy(() => import('./pages/TestimonyPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const Files = lazy(() => import('./pages/Files'));
const Connect = lazy(() => import('./pages/Connect'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const VehicleDonation = lazy(() => import('./pages/VehicleDonation'));
const VehicleDonationForm = lazy(() => import('./pages/VehicleDonationForm'));
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// Fills the viewport so the footer can't jump up while a page chunk loads.
const RouteFallback = () => (
  <div className="flex min-h-screen items-start justify-center pt-32" role="status" aria-label="Loading page">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" aria-hidden="true"></div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app. Every page except Home is its own chunk, so a visitor
  // only downloads the code for the page they open (the old single bundle was
  // ~3 MB and held the whole site, the employee portal included).
  return (
    <Suspense fallback={<RouteFallback />}>
    <Routes caseSensitive>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages)
        .filter(([path]) => path !== 'MicroBusinesses')
        .map(([path, Page]) => (
        <Route
          key={path}
          path={createPageUrl(path)}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path={createPageUrl('MeetTheTeam')} element={<LayoutWrapper currentPageName="MeetTheTeam"><MeetTheTeam /></LayoutWrapper>} />
      <Route path={createPageUrl('WomensCampusGallery')} element={<LayoutWrapper currentPageName="WomensCampusGallery"><WomensCampusGallery /></LayoutWrapper>} />
      <Route path={createPageUrl('SearchPerformance')} element={<LayoutWrapper currentPageName="SearchPerformance"><SearchPerformance /></LayoutWrapper>} />
      <Route path={createPageUrl('About')} element={<LayoutWrapper currentPageName="About"><About /></LayoutWrapper>} />
      <Route path={createPageUrl('Financials')} element={<LayoutWrapper currentPageName="Financials"><Financials /></LayoutWrapper>} />
      <Route path={createPageUrl('Programs')} element={<LayoutWrapper currentPageName="Programs"><Programs /></LayoutWrapper>} />
      <Route path={createPageUrl('PrivacyPolicy')} element={<LayoutWrapper currentPageName="PrivacyPolicy"><PrivacyPolicy /></LayoutWrapper>} />
      <Route path={createPageUrl('TermsConditions')} element={<LayoutWrapper currentPageName="TermsConditions"><TermsConditions /></LayoutWrapper>} />
      <Route path="/freedom-from-addiction-starts-here" element={<LayoutWrapper currentPageName="HelpForDependency"><HelpForDependency /></LayoutWrapper>} />
      <Route path={createPageUrl('FreedomClassic')} element={<LayoutWrapper currentPageName="FreedomClassic"><FreedomClassic /></LayoutWrapper>} />
      <Route path={createPageUrl('FreedomGala')} element={<LayoutWrapper currentPageName="FreedomGala"><FreedomGala /></LayoutWrapper>} />
      <Route path={createPageUrl('TeenChallengeStory')} element={<LayoutWrapper currentPageName="TeenChallengeStory"><TeenChallengeStory /></LayoutWrapper>} />
      <Route path={createPageUrl('NewsAndUpdates')} element={<LayoutWrapper currentPageName="NewsAndUpdates"><NewsAndUpdates /></LayoutWrapper>} />
      <Route path={createPageUrl('WomensCenterCalendar')} element={<LayoutWrapper currentPageName="WomensCenterCalendar"><WomensCenterCalendar /></LayoutWrapper>} />
      <Route path={createPageUrl('MicroBusinesses')} element={<LayoutWrapper currentPageName="MicroBusinesses"><MicroBusinesses /></LayoutWrapper>} />
      <Route path={createPageUrl('ComprehensiveApproach')} element={<LayoutWrapper currentPageName="ComprehensiveApproach"><ComprehensiveApproach /></LayoutWrapper>} />
      <Route path={createPageUrl('Careers')} element={<LayoutWrapper currentPageName="Careers"><Careers /></LayoutWrapper>} />
      <Route path={createPageUrl('Internship')} element={<LayoutWrapper currentPageName="Internship"><Internship /></LayoutWrapper>} />
      <Route path={createPageUrl('MediaResources')} element={<LayoutWrapper currentPageName="MediaResources"><MediaResources /></LayoutWrapper>} />
      <Route path={createPageUrl('FAQ')} element={<LayoutWrapper currentPageName="FAQ"><FAQ /></LayoutWrapper>} />
      <Route path={createPageUrl('Files')} element={<LayoutWrapper currentPageName="Files"><Files /></LayoutWrapper>} />
      <Route path="/events/event/:id" element={<LayoutWrapper currentPageName="EventDetailPage"><EventDetailPage /></LayoutWrapper>} />
      <Route path="/testimonies/:slug" element={<LayoutWrapper currentPageName="TestimonyPage"><TestimonyPage /></LayoutWrapper>} />
      <Route path="/news/:slug" element={<LayoutWrapper currentPageName="BlogPostPage"><BlogPostPage /></LayoutWrapper>} />
      <Route path="/connect" element={<LayoutWrapper currentPageName="Connect"><Connect /></LayoutWrapper>} />
      <Route path="/thank-you" element={<LayoutWrapper currentPageName="ThankYou"><ThankYou /></LayoutWrapper>} />
      <Route path={createPageUrl('VehicleDonation')} element={<LayoutWrapper currentPageName="VehicleDonation"><VehicleDonation /></LayoutWrapper>} />
      <Route path={createPageUrl('VehicleDonationForm')} element={<LayoutWrapper currentPageName="VehicleDonationForm"><VehicleDonationForm /></LayoutWrapper>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </Suspense>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App