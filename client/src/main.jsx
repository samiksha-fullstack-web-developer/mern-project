// Import core React libraries and ReactDOM for rendering the application
import React from 'react'; 
import ReactDOM from 'react-dom/client';

// Import the main App component
import App from './App';

// Import BrowserRouter for routing support
import { BrowserRouter } from 'react-router-dom';

// Import context providers for global state management
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext'; // Provides wishlist context
import { UserProvider } from './context/UserContext'; // Provides user authentication and data context

// Render the root component into the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> {/* Enables additional checks and warnings during development */}
    <BrowserRouter>
      <CartProvider> {/* Provides cart context to the entire app */}
        <WishlistProvider> {/* Provides wishlist context to the entire app */}
          <UserProvider> {/* Provides user context to the entire app */}
            <App /> {/* Main application component */}
          </UserProvider>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
