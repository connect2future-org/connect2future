import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';
import WhoWeAre from './pages/WhoWeAre/WhoWeAre';
import Ecosystem from './pages/Ecosystem/Ecosystem';
import Insights from './pages/Insights/Insights';
import Contact from './pages/Contact/Contact';

import AdminLayout from "./admin/layout/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import ResetPassword from "./admin/pages/ResetPassword";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Analytics from "./admin/pages/Analytics";
import Settings from "./admin/pages/Settings";
import ProtectedRoute from "./admin/ProtectedRoute";
import AllEnquiries from "./admin/pages/AllEnquiries";
import ManageInsights from "./admin/pages/ManageInsights";
import CreateInsight from "./admin/pages/CreateInsight";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/who-we-are" element={<WhoWeAre />} />
          <Route path="/our-ecosystem" element={<Ecosystem />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="insights" element={<ManageInsights />} />
            <Route path="insights/create" element={<CreateInsight />} />
            <Route path="insights/edit/:id" element={<CreateInsight />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="enquiries" element={<AllEnquiries />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
}
