import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import FailedPage from './pages/FailedPage';
import StaticPage from './pages/StaticPage';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen overflow-x-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/personalized-payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<SuccessPage />} />
          <Route path="/payment-failed" element={<FailedPage />} />
          <Route path="/privacy-policy" element={<StaticPage type="privacy" />} />
          <Route path="/terms" element={<StaticPage type="terms" />} />
          <Route path="/refund-policy" element={<StaticPage type="refund" />} />
          <Route path="/contact" element={<StaticPage type="contact" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
