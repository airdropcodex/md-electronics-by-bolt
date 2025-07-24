import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { CategoryProducts } from './pages/CategoryProducts';
import { ProductDetail } from './pages/ProductDetail';
import { Products } from './pages/Products';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Account } from './pages/Account';
import { About } from './pages/About';
import { Wishlist } from './pages/Wishlist';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/Admin/Login';
import { AdminLayout } from './components/Admin/AdminLayout';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { AdminProducts } from './pages/Admin/Products';
import { AdminCategories } from './pages/Admin/Categories';
import { AdminOrders } from './pages/Admin/Orders';
import { AdminStaff } from './pages/Admin/Staff';
import { ProtectedRoute } from './components/Admin/ProtectedRoute';
import { Unauthorized } from './pages/Unauthorized';

// Import Google Fonts
const GoogleFonts = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Pacifico&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
    rel="stylesheet"
  />
);

function App() {
  return (
    <>
      <GoogleFonts />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<CategoryProducts />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/about" element={<About />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="staff" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminStaff />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;