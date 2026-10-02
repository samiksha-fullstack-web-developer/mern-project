// Layout for the Shopping (user-facing) section of the app
import { Outlet } from 'react-router-dom';
import Shoppingheader from './Shoppingheader';
import Footer from './Footer';

export default function ShoppingLayout() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-white overflow-hidden">
      {/* Header/Navbar for user pages */}
      <Shoppingheader />

      {/* Main content area (injects child routes here) */}
      <main className="d-flex flex-column flex-grow-1 w-100">
        <Outlet />
      </main>

      {/* Footer section */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
