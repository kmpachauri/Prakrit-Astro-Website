import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertOctagon, HelpCircle } from 'lucide-react';

export default function FailedPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');

  const txnRowCls = "flex justify-between gap-4 py-3.5 border-b border-dashed border-[rgba(168,193,176,0.14)] last:border-b-0";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-5 py-16" style={{ background: 'linear-gradient(180deg,#06120a,#0a1a10)' }}>
      <div className="w-[88px] h-[88px] rounded-full grid place-items-center mb-6 border-2 border-[#ff5d65] bg-[rgba(255,93,101,.12)] text-[#ff5d65] shadow-[0_0_32px_rgba(255,93,101,.35)]">
        <AlertOctagon size={36} />
      </div>

      <h2 className="font-heading font-extrabold text-[clamp(1.85rem,3vw,2.8rem)] text-white mb-3">Payment Failed</h2>
      <p className="text-[#cdded2] max-w-lg mb-8">Payment process complete nahi ho paya. Aap retry kar sakte hain ya WhatsApp support se help le sakte hain.</p>

      {orderId && (
        <div className="w-full max-w-[360px] text-left mb-8 p-6 rounded-2xl bg-[rgba(23,53,36,0.55)] border border-[rgba(168,193,176,0.14)] backdrop-blur-xl shadow-[0_8px_22px_-6px_rgba(0,0,0,.55)]">
          <div className={txnRowCls}>
            <span className="text-[#cdded2] font-medium">Order Reference ID</span>
            <span className="text-white font-bold text-right text-xs">{orderId}</span>
          </div>
          <div className={txnRowCls}>
            <span className="text-[#cdded2] font-medium">Gateway Status</span>
            <span className="text-[#ff5d65] font-bold">FAILED / DECLINED</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs items-center">
        <button onClick={() => navigate('/payment')}
          className="ripple-btn relative overflow-hidden w-full min-h-[56px] rounded-[14px] bg-gradient-to-br from-[#f37446] to-[#d6431a] text-white font-extrabold shadow-[0_16px_44px_-12px_rgba(236,88,38,.65)] hover:-translate-y-1 transition-all">
          Retry Payment
        </button>
        <a href="https://wa.me/919999999999?text=Hello%20Prakrit%20Astro,%20my%20payment%20failed%20during%20masterclass%20registration."
          target="_blank" rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full border border-[rgba(255,255,255,.1)] text-white font-bold hover:bg-[rgba(255,255,255,.05)] transition-all">
          <HelpCircle size={18} /><span>WhatsApp Support</span>
        </a>
      </div>

      <span onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-[#f37446] font-extrabold mt-6 cursor-pointer hover:text-[#f79a6f] hover:gap-3.5 transition-all">
        Back to Home
      </span>
    </div>
  );
}
