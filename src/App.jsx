import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/Shop/CartDrawer';

// Public pages
import Home from './pages/Public/Home';
import ProductDetail from './pages/Public/ProductDetail';
import ScienceHub from './pages/Public/ScienceHub';
import BlogList from './pages/Public/BlogList';
import BlogPost from './pages/Public/BlogPost';
import NotFound from './pages/Public/NotFound';
import Navbar from './components/Layout/Navbar';

// Admin pages
import Login from './pages/Admin/Login';
import AdminLayout from './components/Layout/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ProductManager from './pages/Admin/ProductManager';
import ProductForm from './pages/Admin/ProductForm';
import BlogManager from './pages/Admin/BlogManager';
import ScienceManager from './pages/Admin/ScienceManager';
import InquiryHub from './pages/Admin/InquiryHub';
import ContentEditor from './pages/Admin/ContentEditor';
import MediaVault from './pages/Admin/MediaVault';
import SEOManager from './pages/Admin/SEOManager';
import OrderManager from './pages/Admin/OrderManager';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/products/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
              <Route path="/science" element={<PublicLayout><ScienceHub /></PublicLayout>} />
              <Route path="/blog" element={<PublicLayout><BlogList /></PublicLayout>} />
              <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
                <Route path="blog" element={<BlogManager />} />
                <Route path="science" element={<ScienceManager />} />
                <Route path="inquiries" element={<InquiryHub />} />
                <Route path="orders" element={<OrderManager />} />
                <Route path="content" element={<ContentEditor />} />
                <Route path="media" element={<MediaVault />} />
                <Route path="seo" element={<SEOManager />} />
              </Route>

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
