import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Contact from './pages/Contact';
import BulkOrder from './pages/BulkOrder';
import TrackOrder from './pages/TrackOrder';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import GenericPage from './components/GenericPage';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/product/:slug" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/bulk" element={<Layout><BulkOrder /></Layout>} />
          <Route path="/track-order" element={<Layout><TrackOrder /></Layout>} />
          
          {/* Blog Routes */}
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          
          {/* Static Pages */}
          <Route path="/about" element={<Layout><GenericPage title="Our Story" content="SEWA Goatique was born from a desire to create pure, effective skincare while empowering the women of rural India. Our journey began in..." /></Layout>} />
          <Route path="/impact" element={<Layout><GenericPage title="Our Impact" content="We believe in business as a force for good. Every bar of soap you buy helps provide sustainable livelihoods for women artisans..." /></Layout>} />
          <Route path="/shipping-policy" element={<Layout><GenericPage title="Shipping Policy" content="We ship across India. Orders are typically processed within 24-48 hours." /></Layout>} />
          <Route path="/returns" element={<Layout><GenericPage title="Returns & Refunds" content="We offer a 7-day return policy for damaged or incorrect items." /></Layout>} />
          <Route path="/privacy" element={<Layout><GenericPage title="Privacy Policy" content="Your privacy is important to us. We do not share your data with third parties." /></Layout>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
