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
import Home from './pages/Home';
import WomensCampus from './pages/WomensCampus';
import MensCampus from './pages/MensCampus';
import IntakeForm from './pages/IntakeForm';
import MicroBusinesses from './pages/MicroBusinesses';
import ThriftStore from './pages/ThriftStore';
import VehicleDonation from './pages/VehicleDonation';
import MercyAutoAcademy from './pages/MercyAutoAcademy';
import ProductsPurpose from './pages/ProductsPurpose';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import EmployeePortal from './pages/EmployeePortal';
import Support from './pages/Support';
import SponsorStudent from './pages/SponsorStudent';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "WomensCampus": WomensCampus,
    "MensCampus": MensCampus,
    "IntakeForm": IntakeForm,
    "MicroBusinesses": MicroBusinesses,
    "ThriftStore": ThriftStore,
    "VehicleDonation": VehicleDonation,
    "MercyAutoAcademy": MercyAutoAcademy,
    "ProductsPurpose": ProductsPurpose,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "EmployeePortal": EmployeePortal,
    "Support": Support,
    "SponsorStudent": SponsorStudent,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};