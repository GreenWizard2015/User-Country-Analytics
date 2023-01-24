// Layout view - This view contains the common layout that is used across all pages. The layout includes a header, a main content area, a footer, and a notification area. The header and footer are common across all pages and the main content area changes depending on the route. The notification area is used to display any notifications or warnings to the user.
// Use Outlet to render the main content area.

import React from 'react';
import { Outlet } from 'react-router-dom';
import Notifications from 'components/Notifications';
import Header from 'components/Header';
import Footer from 'components/Footer';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      {/* <Header /> */}
      <div className="flex-grow">
        <Outlet />
      </div>
      <Notifications />
      {/* <Footer /> */}
    </div>
  );
}

// Command line create components: touch src/components/Header.js src/components/Footer.js src/components/Notifications.js