import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

// UI Components
import Loader from './components/ui/Loader';
import ProtectedRoute from './components/ui/ProtectedRoute';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';

// Lazy Loaded Components
const CustomerLayout = lazy(() => import('./components/layouts/CustomerLayout'));
const Home = lazy(() => import('./pages/customer/Home'));
const Collections = lazy(() => import('./pages/customer/Collections'));
const ProductDetail = lazy(() => import('./pages/customer/ProductDetail'));
const Wishlist = lazy(() => import('./pages/customer/Wishlist'));
const CartDrawer = lazy(() => import('./components/cart/CartDrawer'));
const Checkout = lazy(() => import('./pages/customer/Checkout'));
const Profile = lazy(() => import('./pages/customer/Profile'));
const Lookbook = lazy(() => import('./pages/customer/Lookbook'));
const Products = lazy(() => import('./pages/customer/Products'));
const TrackOrder = lazy(() => import('./pages/customer/TrackOrder'));
const JaipuriKurties = lazy(() => import('./pages/customer/JaipuriKurties'));

const AccountLayout = lazy(() => import('./components/layouts/AccountLayout'));
const ProfileInfo = lazy(() => import('./pages/customer/account/ProfileInfo'));
const AccountOrders = lazy(() => import('./pages/customer/account/AccountOrders'));
const Addresses = lazy(() => import('./pages/customer/account/Addresses'));
const Payments = lazy(() => import('./pages/customer/account/Payments'));
const AccountNotifications = lazy(() => import('./pages/customer/account/AccountNotifications'));
const AccountSettings = lazy(() => import('./pages/customer/account/AccountSettings'));

const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const OAuth2Callback = lazy(() => import('./pages/auth/OAuth2Callback'));

const AdminLayout = lazy(() => import('./components/layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminInventory = lazy(() => import('./pages/admin/Inventory'));
const NotFound = lazy(() => import('./pages/ui/NotFound'));

import { useAuthStore } from './store/useAuthStore';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [loading, setLoading] = useState(true);
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Toaster position="top-center" expand={false} richColors closeButton />
      <ThemeProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <AnimatePresence mode="wait">
              {loading && <Loader key="loader" setLoading={setLoading} />}
            </AnimatePresence>
            <CartDrawer />
            <AnimatePresence mode="wait">
              <Suspense fallback={<Loader key="suspense-loader" setLoading={() => {}} />}>
                <Routes>
                  {/* Customer Routes */}
                  <Route path="/" element={<CustomerLayout />}>
                    <Route index element={<Home />} />
                    <Route path="collections" element={<Collections />} />
                    <Route path="collections/kurties" element={<JaipuriKurties />} />
                    <Route path="products" element={<Products />} />
                    <Route path="lookbook" element={<Lookbook />} />
                    <Route path="product/:id" element={<ProductDetail />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="track/:orderId" element={<TrackOrder />} />

                    {/* Account Portal (Nested) */}
                    <Route
                      path="profile"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'admin']}>
                          <AccountLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<ProfileInfo />} />
                      <Route path="orders" element={<AccountOrders />} />
                      <Route path="addresses" element={<Addresses />} />
                      <Route path="payments" element={<Payments />} />
                      <Route path="notifications" element={<AccountNotifications />} />
                      <Route path="settings" element={<AccountSettings />} />
                    </Route>

                    {/* Legacy/Shortcut redirect for orders */}
                    <Route path="orders" element={<AccountOrders />} />
                  </Route>

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/oauth2/callback" element={<OAuth2Callback />} />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </Router>
        </WishlistProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
