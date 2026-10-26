import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { Layout } from './components/layout/Layout'
import { PageSkeleton } from './components/ui/PageSkeleton'

const Home = lazy(() => import('./pages/Home'))
const Books = lazy(() => import('./pages/Books'))
const Category = lazy(() => import('./pages/Category'))
const BookDetail = lazy(() => import('./pages/BookDetail'))
const Search = lazy(() => import('./pages/Search'))
const Cart = lazy(() => import('./pages/Cart'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const Account = lazy(() => import('./pages/Account'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const About = lazy(() => import('./pages/support/About'))
const Contact = lazy(() => import('./pages/support/Contact'))
const FAQ = lazy(() => import('./pages/support/FAQ'))
const ShippingPolicy = lazy(() => import('./pages/support/ShippingPolicy'))
const ReturnsPolicy = lazy(() => import('./pages/support/ReturnsPolicy'))
const PrivacyPolicy = lazy(() => import('./pages/support/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/support/Terms'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <StoreProvider>
      <Suspense fallback={<PageSkeleton />}>
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
            <Route path="orders/:orderId" element={<OrderConfirmation />} />
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
      </Suspense>
    </StoreProvider>
  )
}
