import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  // If accessing a service page route directly, redirect to Preview page
  React.useEffect(() => {
    // Service page patterns: service-name-city format
    const path = location.pathname;
    const isServicePage = path.match(/^\/[a-z-]+-[a-z-]+$/);
    const isSpecialPage = path.match(/^\/(get-a-quote|contact)$/);
    
    if ((isServicePage || isSpecialPage) && currentPageName === 'PageNotFound') {
      // Redirect to Preview page with the route
      const siteId = localStorage.getItem('default_site_id');
      if (siteId) {
        window.location.href = `/Preview?id=${siteId}#${path}`;
      }
    }
  }, [location.pathname, currentPageName]);

  return <>{children}</>;
}