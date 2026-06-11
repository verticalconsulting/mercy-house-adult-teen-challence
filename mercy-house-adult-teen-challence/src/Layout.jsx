import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Menu, X, ChevronDown, MessageCircle, Facebook, ArrowLeft } from 'lucide-react';
import DarkModeToggle from './components/DarkModeToggle';
import DonateDropdown from './components/DonateDropdown';
import NonprofitLegitimacy from './components/NonprofitLegitimacy';

import ScrollToTop from './components/ScrollToTop';
import TrustBar from './components/TrustBar';
import ScrollRestoration from './components/ScrollRestoration';
import MobileBottomNav from './components/MobileBottomNav';
import FloatingAIChat from './components/FloatingAIChat';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const toggleSubmenu = (name) => setOpenSubmenu((prev) => prev === name ? null : name);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = React.useRef(null);

  const [canGoBack, setCanGoBack] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setCanGoBack(window.history.length > 1 && currentPageName !== 'Home');
  }, [currentPageName, location]);

  const menuItems = [
  { name: 'Home', path: 'Home' },
  { name: 'About', path: 'About', external: false, directPath: '/About' },
  {
    name: 'Programs',
    path: 'Programs',
    directPath: '/Programs',
    submenu: [
    { name: 'All Programs', directPath: '/Programs' },
    { name: "Women's Campus", path: 'WomensCampus' },
    { name: "Men's Campus", path: 'MensCampus' },
    { name: 'Help for Dependency', directPath: '/help-for-dependency-abuse' }]

  },
  {
    name: 'News/Events',
    path: 'Events',
    directPath: '/Events',
    submenu: [
      { name: 'All News/Events', directPath: '/Events' },
      { name: 'News', directPath: '/News' },
      { name: 'Freedom Classic Golf', directPath: '/FreedomClassic' },
    ]
  },
  {
    name: 'Workforce Development',
    path: 'MicroBusinesses',
    submenu: [
    { name: 'SuperTHRIFT', path: 'https://mercyhouseatc.superthriftdeals.org', external: true },
    { name: 'Vehicle Donation', path: 'https://mercyhouseatc.vehicledonationms.org', external: true },
    { name: 'Mercy House Auto Center', href: 'https://mercyhouseautocenter.com/' },
    { name: 'Product With A Purpose', path: 'ProductsPurpose' },
    { name: 'Elite Gutters', path: 'https://myelitegutters.com', external: true }]

  },
  { name: 'Volunteer', path: 'Volunteer' },
  {
    name: 'Team/Contact',
    path: 'Contact',
    directPath: '/Contact',
    submenu: [
      { name: 'Meet the Team', path: 'MeetTheTeam' },
      { name: 'Contact Us', path: 'Contact' }
    ]
  }];


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold focus:outline-none">
        
        Skip to main content
      </a>
      <ScrollToTop />
      <ScrollRestoration />
      <TrustBar />
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50 transition-colors duration-300" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Back Button (Mobile) */}
            {canGoBack &&
            <button
              onClick={() => navigate(-1)}
              className="lg:hidden text-slate-700 dark:text-slate-200 hover:text-navy dark:hover:text-gold transition-colors p-2 -ml-2"
              aria-label="Go back">
              
                <ArrowLeft className="w-7 h-7" />
              </button>
            }
            
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center group">
              <img
                src="https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/f6308df5-e751-45c6-6b95-9631b3eb7800/menulogo"
                alt="Mercy House"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) =>
              <div key={item.name} className="relative group">
                  {item.submenu ?
                <div>
                      <Link
                    to={item.directPath || createPageUrl(item.path)}
                    className="px-4 py-2 text-base md:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-navy dark:hover:text-gold transition-colors duration-200 flex items-center">
                    
                        {item.name}
                        <ChevronDown className="ml-1 w-5 h-5 md:w-4 md:h-4" />
                      </Link>
                      <div className="absolute left-0 mt-0 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-200 dark:border-slate-700">
                        {item.submenu.map((subItem) =>
                    (subItem.external || subItem.href) ?
                    <a
                      key={subItem.name}
                      href={subItem.href || subItem.path}
                      className="block px-4 py-3 text-lg md:text-sm text-slate-700 dark:text-slate-200 hover:bg-navy/5 dark:hover:bg-gold/10 hover:text-navy dark:hover:text-gold transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg">
                      
                              {subItem.name}
                            </a> :

                    <Link
                      key={subItem.name}
                      to={subItem.directPath || createPageUrl(subItem.path)}
                      className="block px-4 py-3 text-lg md:text-sm text-slate-700 dark:text-slate-200 hover:bg-navy/5 dark:hover:bg-gold/10 hover:text-navy dark:hover:text-gold transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg">
                      
                              {subItem.name}
                            </Link>

                    )}
                      </div>
                    </div> :

                <Link
                  to={item.directPath || createPageUrl(item.path)}
                  className={`px-4 py-2 text-lg md:text-sm font-medium transition-colors duration-200 ${
                  currentPageName === item.path ?
                  'text-navy dark:text-gold border-b-2 border-navy dark:border-gold' :
                  'text-slate-700 dark:text-slate-200 hover:text-navy dark:hover:text-gold'}`
                  }>
                  
                      {item.name}
                    </Link>
                }
                </div>
              )}
            </nav>

            {/* Right side buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <a
                href="https://www.facebook.com/mercyhouseteenchallenge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 dark:text-slate-200 hover:text-navy dark:hover:text-gold transition-colors p-2"
                aria-label="Visit our Facebook page">
                
                <Facebook className="w-6 h-6" />
              </a>
              <DarkModeToggle />
              <DonateDropdown size="sm" />
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <a
                href="https://www.facebook.com/mercyhouseteenchallenge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 dark:text-slate-200 hover:text-navy dark:hover:text-gold transition-colors p-2"
                aria-label="Visit our Facebook page">
                
                <Facebook className="w-7 h-7" />
              </a>
              <DarkModeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-700 dark:text-slate-200 hover:text-navy dark:hover:text-gold transition-colors p-2">
                
                {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen &&
        <div className="lg:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) =>
            <div key={item.name}>
                  {item.submenu ?
              <div>
                      <button
                  onClick={() => toggleSubmenu(item.name)}
                  className="w-full flex items-center justify-between px-4 py-4 text-lg md:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-navy/5 dark:hover:bg-gold/10 rounded-lg transition-colors">
                  
                        {item.name}
                        <ChevronDown className={`w-6 h-6 md:w-4 md:h-4 transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      {openSubmenu === item.name &&
                <div className="ml-4 mt-2 space-y-1">
                          {item.submenu.map((subItem) =>
                  (subItem.external || subItem.href) ?
                  <a
                    key={subItem.name}
                    href={subItem.href || subItem.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-lg md:text-sm text-slate-600 dark:text-slate-300 hover:bg-navy/5 dark:hover:bg-gold/10 rounded-lg transition-colors">
                    
                                {subItem.name}
                              </a> :

                  <Link
                    key={subItem.name}
                    to={subItem.directPath || createPageUrl(subItem.path)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-lg md:text-sm text-slate-600 dark:text-slate-300 hover:bg-navy/5 dark:hover:bg-gold/10 rounded-lg transition-colors">
                    
                                {subItem.name}
                              </Link>

                  )}
                        </div>
                }
                    </div> :

              <Link
                to={item.directPath || createPageUrl(item.path)}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-4 text-lg md:text-sm font-medium rounded-lg transition-colors ${
                currentPageName === item.path ?
                'bg-navy/10 dark:bg-gold/10 text-navy dark:text-gold' :
                'text-slate-700 dark:text-slate-200 hover:bg-navy/5 dark:hover:bg-gold/10'}`
                }>
                
                      {item.name}
                    </Link>
              }
                </div>
            )}
            </div>
          </div>
        }
      </header>

      {/* Floating Donate Button - Mobile Only */}
      <div className="lg:hidden fixed top-24 right-4 z-40" style={{ top: 'calc(6rem + env(safe-area-inset-top))' }}>
        <DonateDropdown onItemClick={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <main id="main-content" className="pb-20 lg:pb-0" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPageName}
            initial={prefersReducedMotion ? { opacity: 0 } : { x: 300, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: -300, opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 20 }}>
            
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />



      {/* Floating AI Chat */}
      <FloatingAIChat />

      {/* Footer */}
      <footer className="bg-navy dark:bg-slate-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl md:text-xl font-bold text-gold mb-4">Mercy House</h3>
              <p className="text-slate-300 text-lg md:text-sm leading-relaxed">
                Providing an effective and comprehensive Christian faith-based solution to life-controlling problems for over 15 years.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-xl md:text-base text-gold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-lg md:text-base">
                <li><Link to={createPageUrl('WomensCampus')} className="text-slate-300 hover:text-gold transition-colors">Women's Campus</Link></li>
                <li><Link to={createPageUrl('MensCampus')} className="text-slate-300 hover:text-gold transition-colors">Men's Campus</Link></li>
                <li><Link to={createPageUrl('Events')} className="text-slate-300 hover:text-gold transition-colors">Events</Link></li>
                <li><Link to={createPageUrl('MicroBusinesses')} className="text-slate-300 hover:text-gold transition-colors">Micro Businesses</Link></li>
                <li><Link to={createPageUrl('News')} className="text-slate-300 hover:text-gold transition-colors">News</Link></li>
                <li><Link to={createPageUrl('Volunteer')} className="text-slate-300 hover:text-gold transition-colors">Volunteer</Link></li>
                <li><Link to="/About" className="text-slate-300 hover:text-gold transition-colors">About Us</Link></li>
                <li><Link to="/Programs" className="text-slate-300 hover:text-gold transition-colors">Programs</Link></li>
                <li><Link to={createPageUrl('EmployeePortal')} className="text-slate-300 hover:text-gold transition-colors">Employee Portal</Link></li>
                <li><Link to="/MeetTheTeam" className="text-slate-300 hover:text-gold transition-colors">Meet the Team</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xl md:text-base text-gold mb-4">Contact</h4>
              <p className="text-slate-300 text-lg md:text-base leading-relaxed">
                Office: 855-893-7333<br />
                Intake: (601) 720-3718<br />
                Email: info@mercyhouseatc.com
              </p>
              <p className="text-slate-300 text-lg md:text-sm mt-2">
                Monday – Friday: 8am - 5pm
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <a
                    href="https://www.facebook.com/mercyhouseteenchallenge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gold transition-colors p-2"
                    aria-label="Visit our Facebook page">
                    
                    <Facebook className="w-8 h-8 md:w-6 md:h-6" />
                  </a>
                </div>
                <a
                  href="#main-content"
                  onClick={(e) => {e.preventDefault();window.scrollTo({ top: 0 });}}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-navy hover:bg-navy/90 text-white rounded-md transition-colors font-semibold text-lg md:text-base">
                  
                  <MessageCircle className="w-5 h-5 md:w-4 md:h-4" />
                  Ask Our AI Assistant
                </a>
                <DonateDropdown className="w-full" />
              </div>
            </div>
          </div>
          {/* Nonprofit Legitimacy — Footer */}
          <div className="border-t border-slate-700 mt-8 pt-8 mb-6">
            <NonprofitLegitimacy variant="compact" />
          </div>

          <div className="border-t border-slate-700 pt-6 text-center text-lg md:text-base text-slate-400">
            <p>&copy; {new Date().getFullYear()} Mercy House Adult &amp; Teen Challenge. All rights reserved.</p>
            <p className="mt-2">
              501(c)(3) Nonprofit &middot; Georgetown &amp; Learned, Mississippi &middot; Your gifts support housing, meals, program care, and ministry operations.
            </p>
            <div className="flex justify-center mt-4 mb-2">
              <a href="https://app.candid.org/profile/9237605/mercy-house-teen-challenge-45-4670832/?pkId=85b52dd6-b112-4838-af55-83779d6afa0f" target="_blank" rel="noopener">
                <img src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/9237605/svg" alt="Candid Seal of Transparency" className="h-16 w-auto" />
              </a>
            </div>
            <nav aria-label="Footer utility links" className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-3 text-sm text-slate-500">
              <Link to={createPageUrl('Contact')} className="hover:text-gold transition-colors">Contact</Link>
              <Link to={createPageUrl('Volunteer')} className="hover:text-gold transition-colors">Volunteer</Link>
              <Link to={createPageUrl('Events')} className="hover:text-gold transition-colors">Events &amp; News</Link>
              <Link to={createPageUrl('Donate')} className="hover:text-gold transition-colors">Donate</Link>
              <Link to={createPageUrl('IntakeForm')} className="hover:text-gold transition-colors">Apply for Program</Link>
              <Link to="/PrivacyPolicy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <Link to="/help-for-dependency-abuse" className="hover:text-gold transition-colors">Help for Dependency</Link>
              <Link to="/About" className="hover:text-gold transition-colors">About Us</Link>
              <Link to="/Programs" className="hover:text-gold transition-colors">Programs</Link>
              <a href="https://drive.google.com/file/d/1nXKBoDu9NBTjiLXgmkfHXEZwMIurUxRb/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">2024 Annual Report</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>);

}