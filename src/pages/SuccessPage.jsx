import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function formatMeetingMode(mode = 'zoom') {
  return { whatsapp_call: 'WhatsApp Call', google_meet: 'Google Meet', zoom: 'Zoom', phone_call: 'Phone Call', whatsapp_group: 'WhatsApp Group Session' }[mode] || 'Online Session';
}

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    fetch(`${API_BASE_URL}/api/payment/status/${orderId}`)
      .then(res => { if (!res.ok) throw new Error('Order details not found.'); return res.json(); })
      .then(setPaymentData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleWhatsApp = () => {
    const groupLink = paymentData?.whatsappGroupLinkAtPaymentTime || paymentData?.landingPageId?.settings?.whatsappGroupLink;
    if (groupLink) { window.open(groupLink, '_blank'); return; }
    const num = (paymentData?.landingPageId?.settings?.whatsappNumber || '919999999999').replace('+', '').replace(/ /g, '');
    const msg = `Hello Prakrit Astro, I have successfully registered for Prakrit Career Boost. Order ID: ${orderId}. Please share the WhatsApp group link.`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#06120a] gap-4">
        <Loader2 className="animate-spin text-[#ecc472]" size={48} />
        <p className="text-[#cdded2]">Fetching transaction details...</p>
      </div>
    );
  }

  const txnRowCls = "flex justify-between gap-4 py-3.5 border-b border-dashed border-[rgba(168,193,176,0.14)]";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-5 py-16" style={{ background: 'linear-gradient(180deg,#06120a,#0a1a10)' }}>
      <div className="w-[88px] h-[88px] rounded-full grid place-items-center mb-6 border-2 border-[#3ad490] bg-[rgba(58,212,144,.15)] text-[#3ad490] shadow-[0_0_32px_rgba(58,212,144,.35)]">
        <Check size={36} />
      </div>

      <h2 className="font-heading font-extrabold text-[clamp(1.85rem,3vw,2.8rem)] text-white mb-3">Payment Successful!</h2>
      <p className="text-[#cdded2] max-w-lg mb-8">Your Prakrit Career Boost registration is confirmed. Please join the WhatsApp group to receive further instructions.</p>

      {paymentData && (
        <div className="w-full max-w-[540px] text-left mb-7 p-6 rounded-2xl bg-[rgba(23,53,36,0.55)] border border-[rgba(168,193,176,0.14)] backdrop-blur-xl shadow-[0_8px_22px_-6px_rgba(0,0,0,.55)]">
          {[
            ['Student/Parent Name', paymentData.customerId?.name || 'N/A'],
            ['Mobile Number', paymentData.customerId?.mobile || 'N/A'],
            ['Order ID', paymentData.orderId, 'text-xs'],
            ...(paymentData.paymentId ? [['Payment ID', paymentData.paymentId, 'text-xs']] : []),
            ['Amount Paid', `₹${paymentData.amount}`, 'text-[#ecc472]'],
            ['Meeting Mode', formatMeetingMode(paymentData.meetingMode || paymentData.landingPageId?.settings?.meetingMode)],
            ['Gateway Status', 'SUCCESS', 'text-[#3ad490]']
          ].map(([label, val, valCls]) => (
            <div key={label} className={`${txnRowCls} last:border-b-0`}>
              <span className="text-[#cdded2] font-medium">{label}</span>
              <span className={`text-white font-bold text-right ${valCls || ''}`}>{val}</span>
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-[440px] text-left mb-6 p-4 rounded-2xl border border-dashed border-[rgba(217,168,74,.2)] bg-[rgba(255,255,255,.02)]">
        <h4 className="flex items-center gap-1.5 text-[#ecc472] font-bold text-sm mb-2"><AlertCircle size={16} />Important Next Step:</h4>
        <p className="text-[#cdded2] text-xs leading-relaxed">Click the button below to join the WhatsApp group. Meeting details and next steps will be shared there.</p>
      </div>

      <button onClick={handleWhatsApp}
        className="inline-flex items-center justify-center gap-2 w-full max-w-[360px] py-4 px-6 rounded-full font-bold text-white shadow-[0_8px_22px_-8px_rgba(37,211,102,.55)] hover:-translate-y-0.5 hover:brightness-105 transition-all"
        style={{ background: 'linear-gradient(135deg,#25D366,#0e6e63)' }}>
        <MessageCircle size={20} /><span>Join WhatsApp Group</span>
      </button>

      {paymentData?.landingPageId?.settings?.whatsappNumber && (
        <a className="inline-flex items-center gap-2 text-[#f37446] font-extrabold mt-5 hover:text-[#f79a6f] hover:gap-3.5 transition-all"
          href={`https://wa.me/${paymentData.landingPageId.settings.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(`Hello Prakrit Astro, I need support for order ${orderId}.`)}`}
          target="_blank" rel="noreferrer">WhatsApp Support</a>
      )}

      <span onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-[#f37446] font-extrabold mt-4 cursor-pointer hover:text-[#f79a6f] hover:gap-3.5 transition-all">
        Go Back to Home
      </span>
    </div>
  );
}
