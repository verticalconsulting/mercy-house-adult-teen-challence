import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Menu, X, ChevronDown } from 'lucide-react';
import DarkModeToggle from './components/DarkModeToggle';
import DonateButton from './components/DonateButton';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [microBusinessOpen, setMicroBusinessOpen] = useState(false);

  const menuItems = [
    { name: 'Home', path: 'Home' },
    { name: "Women's Campus", path: 'WomensCampus' },
    { name: "Men's Campus", path: 'MensCampus' },
    {
      name: 'Micro Businesses',
      path: 'MicroBusinesses',
      submenu: [
        { name: 'Thrift Store', path: 'ThriftStore' },
        { name: 'Vehicle Donation', path: 'VehicleDonation' },
        { name: 'Mercy Auto Academy', path: 'MercyAutoAcademy' },
        { name: 'Products & Purpose', path: 'ProductsPurpose' }
      ]
    },
    { name: 'News & Events', path: 'Blog' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center space-x-3 group">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-navy dark:text-gold transition-colors duration-300">
                  Mercy House
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 tracking-wider">
                  ADULT & TEEN CHALLENGE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.submenu ? (
                    <div>
                      <Link
                        to={createPageUrl(item.path)}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-navy dark:hover:text-gold transition-colors duration-200 flex items-center"
                      >
                        {item.name}
                        <ChevronDown className="ml-1 w-4 h-4" />
                      </Link>
                      <div className="absolute left-0 mt-0 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-200 dark:border-slate-700">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={createPageUrl(subItem.path)}
                            className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-navy/5 dark:hover:bg-gold/10 hover:text-navy dark:hover:text-gold transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={createPageUrl(item.path)}
                      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                        currentPageName === item.path
                          ? 'text-navy dark:text-gold border-b-2 border-navy dark:border-gold'
                          : 'text-slate-700 dark:text-slate-200 hover:text-navy dark:hover:text-gold'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <DarkModeToggle />
              <DonateButton size="sm" />
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-3">
              <DarkModeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-700 dark:text-slate-200 hover:text-navy dark:hover:text-gold transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => setMicroBusinessOpen(!microBusinessOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-navy/5 dark:hover:bg-gold/10 rounded-lg transition-colors"
                      >
                        {item.name}
                        <ChevronDown className={`w-4 h-4 transition-transform ${microBusinessOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {microBusinessOpen && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={createPageUrl(subItem.path)}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-navy/5 dark:hover:bg-gold/10 rounded-lg transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={createPageUrl(item.path)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        currentPageName === item.path
                          ? 'bg-navy/10 dark:bg-gold/10 text-navy dark:text-gold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-navy/5 dark:hover:bg-gold/10'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <DonateButton className="w-full" />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-navy dark:bg-slate-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gold mb-4">Mercy House</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Providing an effective and comprehensive Christian faith-based solution to life-controlling problems for over 15 years.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl('WomensCampus')} className="text-slate-300 hover:text-gold transition-colors">Women's Campus</Link></li>
                <li><Link to={createPageUrl('MensCampus')} className="text-slate-300 hover:text-gold transition-colors">Men's Campus</Link></li>
                <li><Link to={createPageUrl('MicroBusinesses')} className="text-slate-300 hover:text-gold transition-colors">Micro Businesses</Link></li>
                <li><Link to={createPageUrl('Blog')} className="text-slate-300 hover:text-gold transition-colors">News & Events</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gold mb-4">Contact</h4>
              <p className="text-slate-300 text-sm">
                Phone: (555) 123-4567<br />
                Email: info@mercyhouse.org
              </p>
              <div className="mt-4">
                <DonateButton className="w-full" />
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Mercy House Adult & Teen Challenge. All rights reserved.</p>
            <p className="mt-2">110% of individual donor proceeds go directly to our mission.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}