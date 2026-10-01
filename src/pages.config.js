/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import { lazy } from 'react';
const Contact = lazy(() => import('./pages/Contact'));
const Donate = lazy(() => import('./pages/Donate'));
const DonationFunnel = lazy(() => import('./pages/DonationFunnel'));
const EmployeePortal = lazy(() => import('./pages/EmployeePortal'));
const Events = lazy(() => import('./pages/Events'));
import Home from './pages/Home';
const IntakeForm = lazy(() => import('./pages/IntakeForm'));
const MensCampus = lazy(() => import('./pages/MensCampus'));
const MicroBusinesses = lazy(() => import('./pages/MicroBusinesses'));
const SponsorStudent = lazy(() => import('./pages/SponsorStudent'));
const RecurringDonation = lazy(() => import('./pages/RecurringDonation'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const ThriftStore = lazy(() => import('./pages/ThriftStore'));
const VehicleDonation = lazy(() => import('./pages/VehicleDonation'));
const VehicleDonationForm = lazy(() => import('./pages/VehicleDonationForm'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const WomensCampus = lazy(() => import('./pages/WomensCampus'));
import __Layout from './Layout.jsx';


export const PAGES = {
    "Contact": Contact,
    "Donate": Donate,
    "DonationFunnel": DonationFunnel,
    "EmployeePortal": EmployeePortal,
    "Events": Events,
    "Home": Home,
    "IntakeForm": IntakeForm,
    "MensCampus": MensCampus,
    "MicroBusinesses": MicroBusinesses,
    "SponsorStudent": SponsorStudent,
    "RecurringDonation": RecurringDonation,
    "Testimonials": Testimonials,
    "ThriftStore": ThriftStore,
    "VehicleDonation": VehicleDonation,
    "VehicleDonationForm": VehicleDonationForm,
    "Volunteer": Volunteer,
    "WomensCampus": WomensCampus,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};