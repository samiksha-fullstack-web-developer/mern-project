import { Routes, Route, Navigate } from 'react-router-dom'
import Authlayout from './components/Authlayout'
import Register from './pages/Register'
import Login from './pages/Login'
import Admindashboard from './pages/Admindashboard'
import AdminRoute from './components/AdminRoutes'
import Adminproducts from './pages/Adminproducts'
import Adminorders from './pages/Adminorders'
import Adminlayout from './components/Adminlayout'
import Shoppinglayout from './components/Shoppinglayout'
import Notfound from './pages/Notfound'
import Shoppinghome from './pages/Shoppinghome'
import Shoppinglisting from './pages/Shoppinglisting'
import Shoppingcheckout from './pages/Shoppingcheckout'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/Wishlist';
import Useraccount from './pages/Useraccount'
import Orderdetail from './pages/Orderdetail'
import About from './pages/ShoppingAbout'
import Contact from './pages/ShoppingContact'
import SearchResults from './pages/SearchResults'
import Forgotpassword from './pages/Forgotpassword'
import PrivacyPolicy from './pages/PrivacyPolicy'

function App() {
  return (
    <div className="w-100 m-0 p-0 bg-white">
      <Routes>

        {/* Redirect root path to shop home */}
        <Route path="/" element={<Navigate to="/shop/home" replace />} />

        {/* Auth Routes */}
        <Route path='/auth' element={<Authlayout />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path="forgot-password" element={<Forgotpassword />} />
        </Route>

        {/* Admin Routes with protection */}
        <Route path='/admin' element={
          <AdminRoute>
            <Adminlayout />
          </AdminRoute>
        }>
          <Route index element={<Admindashboard />} /> {/* Default admin dashboard */}
          <Route path='dashboard' element={<Admindashboard />} />
          <Route path='products' element={<Adminproducts />} />
          <Route path='orders' element={<Adminorders />} />
        </Route>

        {/* Public Shopping Routes */}
        <Route path='/shop' element={<Shoppinglayout />}>
          <Route path='home' element={<Shoppinghome />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='listing' element={<Shoppinglisting />} />
          <Route path='search' element={<SearchResults />} />
          <Route path='checkout' element={<Shoppingcheckout />} />
          <Route path=':id' element={<ProductDetail />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="account" element={<Useraccount />} />
        </Route>

        {/* Order detail (outside of layout) */}
        <Route path="/order/:id" element={<Orderdetail />} />

        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<Notfound />} />

      </Routes>
    </div>
  )
}

export default App
