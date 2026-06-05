import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ShieldCheck, ChevronDown, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const copy = {
  title: 'Prakrit Career Boost Booking',
  subtitle: 'नीचे parent details fill karein. Payment ke baad WhatsApp group join link milega.',
  name: 'Parent Name / माता-पिता का नाम',
  mobile: 'Mobile Number',
  email: 'Email',
  careerCategory: 'Student Class / Class',
  notes: 'Child ke career/stream concern',
  pay: 'Secure Payment Karein',
  secured: 'Razorpay secure checkout',
  back: 'Back'
};

const categoryOptions = ['8th Class', '9th Class', '10th Class', 'Stream Selection Query', 'Confusion About Future', 'Other'];

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Andaman & Nicobar Islands','Chandigarh',
  'Dadra & Nagar Haveli and Daman & Diu','Delhi','Jammu & Kashmir','Ladakh',
  'Lakshadweep','Puducherry'
];

function StateDropdown({ value, onChange, required, inputCls, labelCls }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const filtered = INDIA_STATES.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`${inputCls} flex items-center justify-between text-left`}
      >
        <span className={value ? 'text-[#f4f9f4]' : 'text-[#84a190]'}>{value || 'Select State'}</span>
        <ChevronDown size={16} className={`text-[#84a190] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-xl border border-[rgba(168,193,176,0.2)] bg-[#0e2216] shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-[rgba(168,193,176,0.1)] flex items-center gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Search state..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[#f4f9f4] text-sm outline-none placeholder-[#84a190] px-1"
            />
            {search && <button type="button" onClick={() => setSearch('')}><X size={13} className="text-[#84a190]" /></button>}
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0
              ? <div className="px-4 py-3 text-sm text-[#84a190]">No state found</div>
              : filtered.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { onChange(s); setOpen(false); setSearch(''); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-[rgba(243,116,70,0.12)] ${
                    value === s ? 'text-[#f37446] font-bold bg-[rgba(243,116,70,0.08)]' : 'text-[#cdded2]'
                  }`}
                >
                  {s}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

const defaultFormFields = {
  name: { visible: true, label: copy.name, required: true },
  mobile: { visible: true, label: copy.mobile, required: true },
  email: { visible: true, label: copy.email, required: false },
  careerCategory: { visible: true, label: copy.careerCategory, required: true },
  notes: { visible: true, label: copy.notes, required: false }
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', mobile: '', email: '', state: '', careerCategory: '8th Class', notes: '' });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/active-landing-page`)
      .then(res => { if (!res.ok) throw new Error('Active landing page not found.'); return res.json(); })
      .then(setLandingPage)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const amount = landingPage?.pricing?.offerPrice || 0;
  const savedFormFields = landingPage?.settings?.formFields || {};
  const formFields = Object.fromEntries(
    Object.entries(defaultFormFields).map(([field, config]) => [field, { ...config, ...(savedFormFields[field] || {}) }])
  );
  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    if (!form.state) { setError('Please select your state.'); setSubmitting(false); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, serviceType: form.careerCategory, preferredLanguage: 'hinglish', landingPageId: landingPage?._id, state: form.state })
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.message || 'Payment order failed.');
      if (order.mode === 'mock') {
        navigate(`/payment-success?orderId=${order.orderId}`);
        return;
      }
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) throw new Error('Unable to load Razorpay.');
      new window.Razorpay({
        key: order.keyId,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        name: 'Prakrit Astro',
        description: form.careerCategory,
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        theme: { color: '#7b341e' },
        handler: async (p) => {
          const v = await fetch(`${API_BASE_URL}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: p.razorpay_order_id, paymentId: p.razorpay_payment_id, signature: p.razorpay_signature, rawResponse: p })
          });
          const vData = await v.json();
          navigate(vData.success ? `/payment-success?orderId=${p.razorpay_order_id}` : `/payment-failed?orderId=${p.razorpay_order_id}`);
        },
        modal: { ondismiss: () => navigate(`/payment-failed?orderId=${order.orderId}`) }
      }).open();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#06120a] gap-4">
        <Loader2 className="animate-spin text-[#ecc472]" size={42} />
        <p className="text-[#cdded2]">Loading booking details...</p>
      </div>
    );
  }

  const inputCls = "w-full border border-[rgba(168,193,176,0.14)] rounded-xl bg-[rgba(14,34,22,.75)] text-[#f4f9f4] px-4 py-3.5 outline-none backdrop-blur-sm transition focus:border-[#f37446] focus:shadow-[0_0_0_4px_rgba(236,88,38,.3)] focus:bg-[rgba(14,34,22,.95)]";
  const labelCls = "block text-[#f4f9f4] font-bold text-sm mb-2";

  return (
    <main className="min-h-screen px-5 md:px-10 py-10 md:py-20" style={{ background: 'linear-gradient(180deg,#06120a,#0a1a10)' }}>
      <div className="w-full max-w-3xl mx-auto">
        <button type="button" onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-[#f37446] font-extrabold hover:gap-3.5 transition-all mb-8">
          <ArrowLeft size={16} />{copy.back}
        </button>

        <div className="text-center mb-9">
          <h2 className="font-heading font-extrabold text-[clamp(1.85rem,3vw,2.8rem)] text-white">{copy.title}</h2>
          <p className="text-[#cdded2] mt-2">{copy.subtitle}</p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 p-6 rounded-2xl mb-6 border border-[rgba(236,88,38,.25)] backdrop-blur-xl" style={{ background: 'linear-gradient(135deg,rgba(23,53,36,.85),rgba(14,34,22,.85))' }}>
          <div>
            <h5 className="font-bold text-white">{landingPage?.name || 'Prakrit Career Boost'}</h5>
            <p className="text-[#cdded2] text-sm">{landingPage?.settings?.meetingDescription || 'Payment ke baad WhatsApp group join link milega.'}</p>
          </div>
          <span className="font-heading font-black text-[2.1rem] text-[#ecc472] drop-shadow-[0_2px_14px_rgba(217,168,74,.35)]">₹{amount}</span>
        </div>

        {error && <div className="rounded-xl border border-red-500 bg-[rgba(255,93,101,.12)] text-red-300 px-4 py-3 mb-5 text-sm">{error}</div>}

        <form onSubmit={submit}>
          {[
            { field: 'name', type: 'text' },
            { field: 'email', type: 'email' },
          ].filter(({ field }) => formFields[field]?.visible !== false).map(({ field, type }) => (
            <div key={field} className="mb-5">
              <label className={labelCls}>{formFields[field]?.label || copy[field]}</label>
              <input className={inputCls} type={type} required={formFields[field]?.required} value={form[field]} onChange={e => update(field, e.target.value)} />
            </div>
          ))}

          {formFields.mobile?.visible !== false && (
            <div className="mb-5">
              <label className={labelCls}>{formFields.mobile?.label || copy.mobile}</label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center rounded-xl border border-[rgba(168,193,176,0.14)] bg-[rgba(14,34,22,.75)] px-3 text-[#f4f9f4] font-bold text-sm backdrop-blur-sm select-none whitespace-nowrap">
                  +91
                </div>
                <input
                  className={inputCls}
                  type="tel"
                  required={formFields.mobile?.required}
                  maxLength={10}
                  value={form.mobile}
                  onChange={e => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
            </div>
          )}

          <div className="mb-5">
            <label className={labelCls}>State / राज्य <span className="text-[#f37446]">*</span></label>
            <StateDropdown
              value={form.state}
              onChange={v => update('state', v)}
              required
              inputCls={inputCls}
              labelCls={labelCls}
            />
          </div>

          {formFields.careerCategory?.visible !== false && (
            <div className="mb-5">
              <label className={labelCls}>{formFields.careerCategory?.label || copy.careerCategory}</label>
              <select className={inputCls} required={formFields.careerCategory?.required} value={form.careerCategory} onChange={e => update('careerCategory', e.target.value)}>
                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {formFields.notes?.visible !== false && (
            <div className="mb-6">
              <label className={labelCls}>{formFields.notes?.label || copy.notes}</label>
              <textarea className={inputCls} rows={4} required={formFields.notes?.required} value={form.notes} onChange={e => update('notes', e.target.value)} />
            </div>
          )}

          <button type="submit" disabled={submitting} className="ripple-btn relative overflow-hidden w-full min-h-[60px] rounded-[14px] bg-gradient-to-br from-[#f37446] to-[#d6431a] text-white font-extrabold text-lg shadow-[0_16px_44px_-12px_rgba(236,88,38,.65)] hover:-translate-y-1 hover:brightness-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? 'Please wait...' : `${copy.pay} ₹${amount}`}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-5 text-[#cdded2] text-sm">
          <ShieldCheck size={14} className="text-[#ecc472]" />
          <span>{copy.secured}</span>
        </div>
      </div>
    </main>
  );
}
