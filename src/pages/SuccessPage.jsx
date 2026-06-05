import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2, MessageCircle, Home } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const formatWhatsAppNumber = (number = '') => number.replace(/\D/g, '');

function formatMeetingMode(mode = '') {
  return {
    whatsapp_call: 'WhatsApp Call',
    google_meet: 'Google Meet',
    zoom: 'Zoom',
    phone_call: 'Phone Call',
    whatsapp_group: 'WhatsApp Group Session'
  }[mode] || 'Online Session';
}

export default function SuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    fetch(`${API_BASE_URL}/api/payment/status/${orderId}`)
      .then(res => { if (!res.ok) throw new Error('Order details not found.'); return res.json(); })
      .then(setPaymentData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleWhatsApp = () => {
    const groupLink = paymentData?.whatsappGroupLinkAtPaymentTime || paymentData?.landingPageId?.settings?.whatsappGroupLink;
    if (groupLink) {
      window.open(groupLink, '_blank', 'noopener,noreferrer');
      return;
    }
    const support = paymentData?.landingPageId?.settings?.whatsappNumber || '+919660715539';
    const msg = `Hello Prakrit Astro, I have successfully registered for Prakrit Career Boost. Order ID: ${orderId}. Please share the WhatsApp group link.`;
    window.open(`https://wa.me/${formatWhatsAppNumber(support)}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06120a]">
        <Loader2 className="animate-spin text-[#ecc472]" size={42} />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#06120a] text-center px-5 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-[#25d366]/25 bg-[#0e2216]/80 p-8 md:p-12 shadow-2xl">
        <CheckCircle className="mx-auto text-[#25d366] mb-5" size={64} />
        <h1 className="font-heading text-3xl md:text-4xl font-black text-white mb-3">Payment Successful</h1>
        <p className="text-[#cdded2] max-w-lg mx-auto mb-8">Your Prakrit Career Boost registration is confirmed. Please join the WhatsApp group to receive further instructions.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-8">
          {[
            ['Order ID', orderId || 'N/A'],
            ['Amount', paymentData?.amount ? `₹${paymentData.amount}` : 'N/A'],
            ['Status', paymentData?.status || 'success'],
            ['Meeting Mode', formatMeetingMode(paymentData?.meetingMode || paymentData?.landingPageId?.settings?.meetingMode)]
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase text-[#84a190] font-bold">{label}</div>
              <div className="mt-1 text-white font-bold break-words">{value}</div>
            </div>
          ))}
        </div>

        <button onClick={handleWhatsApp} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25d366] to-[#0e6e63] px-6 py-3.5 font-black text-white shadow-lg">
          <MessageCircle size={20} /><span>Join WhatsApp Group</span>
        </button>

        <div className="mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[#ecc472] font-bold">
            <Home size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
