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
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import DonationFunnel from './pages/DonationFunnel';
import EmployeePortal from './pages/EmployeePortal';
import Events from './pages/Events';
import Home from './pages/Home';
import IntakeForm from './pages/IntakeForm';
import MensCampus from './pages/MensCampus';
import MercyAutoAcademy from './pages/MercyAutoAcademy';
import MicroBusinesses from './pages/MicroBusinesses';
import ProductsPurpose from './pages/ProductsPurpose';
import SponsorStudent from './pages/SponsorStudent';
import Support from './pages/Support';
import Testimonials from './pages/Testimonials';
import ThriftStore from './pages/ThriftStore';
import VehicleDonation from './pages/VehicleDonation';
import VehicleDonationForm from './pages/VehicleDonationForm';
import Volunteer from './pages/Volunteer';
import WomensCampus from './pages/WomensCampus';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Blog": Blog,
    "BlogPost": BlogPost,
    "Contact": Contact,
    "Donate": Donate,
    "DonationFunnel": DonationFunnel,
    "EmployeePortal": EmployeePortal,
    "Events": Events,
    "Home": Home,
    "IntakeForm": IntakeForm,
    "MensCampus": MensCampus,
    "MercyAutoAcademy": MercyAutoAcademy,
    "MicroBusinesses": MicroBusinesses,
    "ProductsPurpose": ProductsPurpose,
    "SponsorStudent": SponsorStudent,
    "Support": Support,
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