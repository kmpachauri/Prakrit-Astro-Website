import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const content = {
  privacy: {
    title: 'Privacy Policy',
    items: [
      'We collect registration details only to process your booking and share session updates.',
      'Payment details are processed by secure payment gateways and are not stored as card data by Prakrit Astro.',
      'Support communication may happen through WhatsApp, phone, or email.'
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    items: [
      'Registration confirms your interest in the selected Prakrit Career Boost session.',
      'Session details and group instructions are shared after successful payment.',
      'Please provide accurate contact details for smooth communication.'
    ]
  },
  refund: {
    title: 'Refund Policy',
    items: [
      'Duplicate payment ya technical issue ke case me support WhatsApp par order details share karein.',
      'Refund eligibility depends on payment status, duplicate charge confirmation, and session access status.',
      'Approved refunds are processed through the original payment method where possible.'
    ]
  },
  contact: {
    title: 'Contact Support',
    items: [
      'Prakrit Astro support ke liye WhatsApp button use karein.',
      'Payment, group link ya session instructions se related query me apna registered mobile number aur order ID mention karein.',
      'We try to respond as quickly as possible during working hours.'
    ]
  }
};

export default function StaticPage({ type = 'privacy' }) {
  const page = content[type] || content.privacy;
  return (
    <main className="min-h-screen bg-[#06120a] px-5 py-10 md:py-16 text-[#f4f9f4]">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-[#f37446] font-extrabold">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="rounded-3xl border border-white/10 bg-[#0e2216]/80 p-7 md:p-10">
          <h1 className="font-heading text-3xl md:text-4xl font-black text-white mb-6">{page.title}</h1>
          <div className="space-y-4 text-[#cdded2]">
            {page.items.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
