import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import MeetTheTeam from './pages/MeetTheTeam';
import WomensCampusGallery from './pages/WomensCampusGallery';
import FreedomClassic from './pages/FreedomClassic';
import TeenChallengeStory from './pages/TeenChallengeStory';
import WomensCenterCalendar from './pages/WomensCenterCalendar';
import News from './pages/News';
import SearchPerformance from './pages/SearchPerformance';
import About from './pages/About';
import Financials from './pages/Financials';
import Programs from './pages/Programs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import HelpForDependency from './pages/HelpForDependency';
import MicroBusinesses from './pages/MicroBusinesses';
import ComprehensiveApproach from './pages/ComprehensiveApproach';
import Careers from './pages/Careers';
import Internship from './pages/Internship';
import MediaResources from './pages/MediaResources';
import FAQ from './pages/FAQ';
import BlogPostPage from './pages/BlogPostPage';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

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

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/MeetTheTeam" element={<LayoutWrapper currentPageName="MeetTheTeam"><MeetTheTeam /></LayoutWrapper>} />
      <Route path="/WomensCampusGallery" element={<LayoutWrapper currentPageName="WomensCampusGallery"><WomensCampusGallery /></LayoutWrapper>} />
      <Route path="/SearchPerformance" element={<LayoutWrapper currentPageName="SearchPerformance"><SearchPerformance /></LayoutWrapper>} />
      <Route path="/About" element={<LayoutWrapper currentPageName="About"><About /></LayoutWrapper>} />
      <Route path="/Financials" element={<LayoutWrapper currentPageName="Financials"><Financials /></LayoutWrapper>} />
      <Route path="/Programs" element={<LayoutWrapper currentPageName="Programs"><Programs /></LayoutWrapper>} />
      <Route path="/PrivacyPolicy" element={<LayoutWrapper currentPageName="PrivacyPolicy"><PrivacyPolicy /></LayoutWrapper>} />
      <Route path="/TermsConditions" element={<LayoutWrapper currentPageName="TermsConditions"><TermsConditions /></LayoutWrapper>} />
      <Route path="/help-for-dependency-abuse" element={<LayoutWrapper currentPageName="HelpForDependency"><HelpForDependency /></LayoutWrapper>} />
      <Route path="/DependancyHelp" element={<LayoutWrapper currentPageName="HelpForDependency"><HelpForDependency /></LayoutWrapper>} />
      <Route path="/FreedomClassic" element={<LayoutWrapper currentPageName="FreedomClassic"><FreedomClassic /></LayoutWrapper>} />
      <Route path="/TeenChallengeStory" element={<LayoutWrapper currentPageName="TeenChallengeStory"><TeenChallengeStory /></LayoutWrapper>} />
      <Route path="/News" element={<LayoutWrapper currentPageName="News"><News /></LayoutWrapper>} />
      <Route path="/WomensCenterCalendar" element={<LayoutWrapper currentPageName="WomensCenterCalendar"><WomensCenterCalendar /></LayoutWrapper>} />
      <Route path="/WorkforceDevelopment" element={<LayoutWrapper currentPageName="WorkforceDevelopment"><MicroBusinesses /></LayoutWrapper>} />
      <Route path="/ComprehensiveApproach" element={<LayoutWrapper currentPageName="ComprehensiveApproach"><ComprehensiveApproach /></LayoutWrapper>} />
      <Route path="/Careers" element={<LayoutWrapper currentPageName="Careers"><Careers /></LayoutWrapper>} />
      <Route path="/Internship" element={<LayoutWrapper currentPageName="Internship"><Internship /></LayoutWrapper>} />
      <Route path="/MediaResources" element={<LayoutWrapper currentPageName="MediaResources"><MediaResources /></LayoutWrapper>} />
      <Route path="/FAQ" element={<LayoutWrapper currentPageName="FAQ"><FAQ /></LayoutWrapper>} />
      <Route path="/Events/:slug" element={<LayoutWrapper currentPageName="BlogPostPage"><BlogPostPage /></LayoutWrapper>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
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