import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, HelpCircle } from 'lucide-react';

export default function FailedPage() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const supportLink = `https://wa.me/919999999999?text=${encodeURIComponent(`Payment help needed. Order ID: ${orderId || 'N/A'}`)}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#06120a] text-center px-5 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-red-500/25 bg-[#0e2216]/80 p-8 md:p-12 shadow-2xl">
        <AlertCircle className="mx-auto text-red-400 mb-5" size={64} />
        <h1 className="font-heading text-3xl md:text-4xl font-black text-white mb-3">Payment Failed</h1>
        <p className="text-[#cdded2] max-w-lg mx-auto mb-8">Payment process complete nahi ho paya. Aap retry kar sakte hain ya WhatsApp support se help le sakte hain.</p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/payment" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f37446] to-[#d6431a] px-6 py-3.5 font-black text-white">
            <ArrowLeft size={18} /><span>Retry Payment</span>
          </Link>
          <a href={supportLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 font-bold text-white">
            <HelpCircle size={18} /><span>WhatsApp Support</span>
          </a>
        </div>
      </div>
    </main>
  );
}
