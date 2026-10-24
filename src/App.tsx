import { Routes, Route } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import Books from './pages/Books'
import Category from './pages/Category'
import BookDetail from './pages/BookDetail'
import Search from './pages/Search'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Account from './pages/Account'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import About from './pages/support/About'
import Contact from './pages/support/Contact'
import FAQ from './pages/support/FAQ'
import ShippingPolicy from './pages/support/ShippingPolicy'
import ReturnsPolicy from './pages/support/ReturnsPolicy'
import PrivacyPolicy from './pages/support/PrivacyPolicy'
import Terms from './pages/support/Terms'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="books" element={<Books />} />
          <Route path="books/:slug" element={<BookDetail />} />
          <Route path="categories/:slug" element={<Category />} />
          <Route path="search" element={<Search />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="account" element={<Account />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="returns-policy" element={<ReturnsPolicy />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </StoreProvider>
  )
}
