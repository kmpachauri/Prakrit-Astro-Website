import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const pages = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'Prakrit Career Boost me parent name, mobile number, email aur student stream/career concern sirf booking, support aur masterclass process ke liye use hota hai.',
      'Hum payment credentials store nahi karte. Payment gateway apni secure checkout process handle karta hai.',
      'Aapke details confidential rakhe jate hain aur bina zaroorat third-party ke saath share nahi kiye jate.'
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    body: [
      'Prakrit Career Boost ek guidance-based online masterclass hai jo 8th, 9th aur 10th class students ke parents ke liye career/stream clarity par focused hai.',
      'No guaranteed marks, admission, rank, result ya future outcome promised hai.',
      'Payment complete hone ke baad aapko WhatsApp group aur further instructions milenge.'
    ]
  },
  refund: {
    title: 'Refund Policy',
    body: [
      'Digital registration aur limited-seat session hone ki wajah se successful payment generally non-refundable hota hai.',
      'Duplicate payment ya technical issue ke case me support WhatsApp par order details share karein.',
      'Eligible refunds payment gateway timeline ke hisaab se process honge.'
    ]
  },
  contact: {
    title: 'Contact',
    body: [
      'Prakrit Astro support ke liye WhatsApp button use karein.',
      'Payment, group link ya session instructions se related query me apna registered mobile number aur order ID mention karein.'
    ]
  }
};

export default function StaticPage({ type }) {
  const navigate = useNavigate();
  const page = pages[type] || pages.terms;

  return (
    <main className="min-h-screen px-5 md:px-10 py-10 md:py-20" style={{ background: 'linear-gradient(180deg,#06120a,#0a1a10)' }}>
      <div className="w-full max-w-3xl mx-auto">
        <button type="button" onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-[#f37446] font-extrabold hover:gap-3.5 transition-all mb-8">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="p-7 md:p-10 rounded-2xl bg-[rgba(23,53,36,0.55)] border border-[rgba(168,193,176,0.14)] backdrop-blur-xl shadow-[0_8px_22px_-6px_rgba(0,0,0,.55)]">
          <h1 className="font-heading font-extrabold text-[clamp(1.8rem,4vw,3rem)] text-white mb-5">{page.title}</h1>
          {page.body.map((para) => (
            <p key={para} className="text-[#cdded2] text-base leading-relaxed mb-4 last:mb-0">{para}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
