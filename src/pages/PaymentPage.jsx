import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ShieldCheck, ChevronDown, X, User, Phone, Mail, MapPin, GraduationCap, MessageSquare, Lock, IndianRupee } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const copy = {
  title: 'Secure Your Child Career Guidance Seat',
  subtitle: 'Parent details fill karein. Payment ke baad confirmation aur WhatsApp group link mil jayega.',
  name: 'Parent Name / माता-पिता का नाम',
  mobile: 'Mobile Number',
  email: 'Email',
  careerCategory: 'Student Class / Class',
  notes: 'Child ke career/stream concern',
  pay: 'Pay Securely',
  secured: 'Razorpay secure checkout',
  back: 'Back'
};

const categoryOptions = ['8th Class', '9th Class', '10th Class', 'Stream Selection Query', 'Confusion About Future', 'Other'];
const placeholders = {
  name: 'Example: Rajesh Sharma',
  mobile: '10 digit mobile number',
  email: 'example@email.com',
  state: 'Select your state',
  careerCategory: 'Select class or concern',
  notes: 'Example: Child is confused between Science and Commerce...'
};
const fieldIcons = {
  name: User,
  mobile: Phone,
  email: Mail,
  state: MapPin,
  careerCategory: GraduationCap,
  notes: MessageSquare
};

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Andaman & Nicobar Islands','Chandigarh',
  'Dadra & Nagar Haveli and Daman & Diu','Delhi','Jammu & Kashmir','Ladakh',
  'Lakshadweep','Puducherry'
];

function StateDropdown({ value, onChange, inputCls, placeholder = 'Select State' }) {
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
        className={`${inputCls} flex items-center justify-between gap-3 text-left`}
      >
        <span className={value ? 'text-[#14532d]' : 'text-[#166534]/60'}>{value || placeholder}</span>
        <ChevronDown size={16} className={`text-[#166534] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-xl border-2 border-[#fde047] bg-[#fefce8] shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-[#ca8a04]/25 flex items-center gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Search state..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[#14532d] text-sm outline-none placeholder-[#166534]/60 px-1"
            />
            {search && <button type="button" onClick={() => setSearch('')}><X size={13} className="text-[#166534]" /></button>}
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0
              ? <div className="px-4 py-3 text-sm text-[#166534]/70">No state found</div>
              : filtered.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { onChange(s); setOpen(false); setSearch(''); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-[#fde047]/35 ${
                    value === s ? 'text-[#7f1d1d] font-black bg-[#fde047]/45' : 'text-[#14532d]'
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
  email: { visible: true, label: copy.email, required: true },
  careerCategory: { visible: true, label: copy.careerCategory, required: false },
  notes: { visible: true, label: copy.notes, required: true }
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existingScript = document.getElementById('razorpay-checkout-js');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const checkoutType = window.location.pathname === '/personalized-payment' ? 'personalized' : 'campaign';
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

  const amount = checkoutType === 'personalized'
    ? (landingPage?.pricing?.personalizedOfferPrice ?? landingPage?.pricing?.offerPrice ?? 0)
    : (landingPage?.pricing?.offerPrice || 0);
  const originalAmount = checkoutType === 'personalized'
    ? (landingPage?.pricing?.personalizedOriginalPrice ?? landingPage?.pricing?.originalPrice)
    : landingPage?.pricing?.originalPrice;
  const savedFormFields = landingPage?.settings?.formFields || {};
  const formFields = Object.fromEntries(
    Object.entries(defaultFormFields).map(([field, config]) => [
      field,
      field === 'email'
        ? { ...config, ...(savedFormFields[field] || {}), required: true }
        : { ...config, ...(savedFormFields[field] || {}) }
    ])
  );
  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const normalizedExpectedAmount = Number(amount || 0);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    if (!form.state) { setError('Please select your state.'); setSubmitting(false); return; }
    if (!form.email.trim()) { setError('Email is required.'); setSubmitting(false); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          checkoutType,
          expectedAmount: normalizedExpectedAmount,
          serviceType: checkoutType === 'personalized' ? 'Personalized 1-to-1 Session' : form.careerCategory,
          preferredLanguage: 'hinglish',
          landingPageId: landingPage?._id,
          state: form.state
        })
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.message || 'Payment order failed.');
      const orderAmount = Number(order.amount || 0);
      if (!Number.isFinite(orderAmount) || orderAmount !== normalizedExpectedAmount) {
        throw new Error(`Price mismatch detected. Expected ₹${normalizedExpectedAmount}, but checkout is trying to use ₹${orderAmount}. Please contact support before paying.`);
      }
      if (!order.keyId) throw new Error('Razorpay key is missing. Please configure backend Razorpay credentials.');
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) throw new Error('Unable to load Razorpay.');
      const markFailed = async (rawResponse = {}, reason = 'checkout_failed') => {
        await fetch(`${API_BASE_URL}/api/payment/failed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.orderId, paymentId: rawResponse?.error?.metadata?.payment_id, rawResponse, reason })
        }).catch(() => {});
      };
      let paymentCompleted = false;
      let failureHandled = false;
      const handleFailure = async (rawResponse = {}, reason = 'payment_failed') => {
        if (failureHandled || paymentCompleted) return;
        failureHandled = true;
        await markFailed(rawResponse, reason);
        navigate(`/payment-failed?orderId=${order.orderId}`);
      };
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        name: 'Prakrit Astro',
        description: checkoutType === 'personalized' ? 'Personalized 1-to-1 Session' : form.careerCategory,
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        theme: { color: '#7b341e' },
        handler: async (p) => {
          paymentCompleted = true;
          const v = await fetch(`${API_BASE_URL}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: p.razorpay_order_id, paymentId: p.razorpay_payment_id, signature: p.razorpay_signature, rawResponse: p })
          });
          const vData = await v.json();
          navigate(vData.success ? `/payment-success?orderId=${p.razorpay_order_id}` : `/payment-failed?orderId=${p.razorpay_order_id}`);
        },
        modal: { ondismiss: async () => handleFailure({ reason: 'checkout_dismissed' }, 'checkout_dismissed') }
      });
      checkout.on('payment.failed', (response) => handleFailure(response, 'payment_failed'));
      checkout.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-green-page min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#ecc472]" size={42} />
        <p className="text-[#cdded2]">Loading booking details...</p>
      </div>
    );
  }

  const inputCls = "w-full min-h-[56px] border-2 border-[#fde047]/70 rounded-xl bg-[#fefce8] text-[#14532d] px-4 py-3.5 outline-none transition placeholder-[#166534]/55 text-base font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_10px_22px_-18px_rgba(0,0,0,0.72)] focus:border-[#fef08a] focus:bg-[#fffde7] focus:shadow-[0_0_0_4px_rgba(253,224,71,0.2),0_14px_26px_-18px_rgba(0,0,0,0.78)]";
  const labelCls = "block text-[#fef9c3] font-black text-sm md:text-base mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]";
  const RequiredMark = ({ show }) => show ? <span className="text-[#fde047]"> *</span> : null;
  const FieldIcon = ({ field }) => {
    const Icon = fieldIcons[field];
    return Icon ? (
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#166534]/75">
        <Icon size={18} />
      </span>
    ) : null;
  };

  return (
    <main className="app-green-page min-h-screen px-4 md:px-10 py-8 md:py-16">
      <div className="w-full max-w-5xl mx-auto">
        <button type="button" onClick={() => navigate('/')} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border-2 border-[#fde047]/60 bg-[#052e16]/80 text-[#fde047] font-black text-sm hover:bg-[#fde047] hover:text-[#14532d] transition-all duration-200">
          <ArrowLeft size={15} /> Back to Home
        </button>

        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#fde047]/45 bg-[#052e16]/70 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#fde047]">
            <Lock size={14} /> Secure Booking
          </div>
          <h2 className="font-heading font-extrabold text-[clamp(1.85rem,5vw,3rem)] text-white mt-4 leading-tight">
            {checkoutType === 'personalized' ? 'Secure Your Personalized one to one Session Seat' : copy.title}
          </h2>
          <p className="text-[#fef9c3]/85 mt-2 max-w-2xl mx-auto text-sm md:text-base">
            {checkoutType === 'personalized'
              ? 'Existing webinar parents ke liye special second-step booking. Details fill karein aur personalized session secure karein.'
              : copy.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-6 items-start">
          <aside className="app-green-panel rounded-2xl p-5 md:p-6 backdrop-blur-xl lg:sticky lg:top-6">
            <div className="rounded-2xl bg-gradient-to-br from-[#fef9c3] to-[#facc15] p-5 text-[#14532d] shadow-[0_10px_0_#854d0e,0_22px_40px_-24px_rgba(0,0,0,0.75)]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-black uppercase tracking-wide">Today Offer</span>
                <ShieldCheck size={22} />
              </div>
              <div className="mt-4 flex items-end gap-2">
                <IndianRupee size={30} className="mb-2" />
                <span className="font-heading text-6xl font-black leading-none">{amount}</span>
                {originalAmount && <span className="mb-2 text-sm font-black line-through opacity-70">₹{originalAmount}</span>}
              </div>
              <p className="mt-3 text-sm font-extrabold">
                {checkoutType === 'personalized' ? 'Personalized one to one session booking' : '1 hour live online masterclass booking'}
              </p>
            </div>

            <div className="mt-6">
              <h5 className="font-heading text-2xl font-black text-[#fde047]">{landingPage?.name || 'Prakrit Career Boost'}</h5>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-white/85">
                {checkoutType === 'personalized'
                  ? 'Details carefully fill karein. Isi number & Email par confirmation aur Meeting details share hongi.'
                  : 'Details carefully fill karein. Isi number par confirmation aur meeting details share hongi.'}
              </p>
            </div>

            <div className="mt-5 grid gap-3 text-sm font-bold text-[#fef9c3]">
              <div className="flex items-center gap-3 rounded-xl border border-[#fde047]/30 bg-[#052e16]/45 px-4 py-3">
                <ShieldCheck size={18} className="text-[#fde047]" /> Secure Razorpay checkout
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#fde047]/30 bg-[#052e16]/45 px-4 py-3">
                <MessageSquare size={18} className="text-[#fde047]" /> Confirmation after payment
              </div>
            </div>
          </aside>

          <div className="app-green-panel rounded-2xl p-5 md:p-7 backdrop-blur-xl">
            <div className="mb-6">
              <h3 className="font-heading text-2xl md:text-3xl font-black text-white">Booking Details</h3>
              <p className="mt-1 text-sm font-semibold text-[#fef9c3]/80">All required fields marked with *.</p>
            </div>

            {error && <div className="rounded-xl border border-red-400 bg-[rgba(255,93,101,.14)] text-red-100 px-4 py-3 mb-5 text-sm font-bold">{error}</div>}

            <form onSubmit={submit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                {[{ field: 'name', type: 'text' }, { field: 'email', type: 'email' }]
                  .filter(({ field }) => formFields[field]?.visible !== false)
                  .map(({ field, type }) => (
                    <div key={field} className="mb-5">
                      <label className={labelCls}>
                        {formFields[field]?.label || copy[field]}<RequiredMark show={formFields[field]?.required} />
                      </label>
                      <div className="relative">
                        <FieldIcon field={field} />
                        <input
                          className={`${inputCls} pl-11`}
                          type={type}
                          required={formFields[field]?.required}
                          placeholder={placeholders[field]}
                          value={form[field]}
                          onChange={e => update(field, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                {formFields.mobile?.visible !== false && (
                  <div className="mb-5">
                    <label className={labelCls}>{formFields.mobile?.label || copy.mobile}<RequiredMark show={formFields.mobile?.required} /></label>
                    <div className="flex gap-2">
                      <div className="flex min-h-[56px] items-center justify-center rounded-xl border-2 border-[#fde047]/70 bg-[#fefce8] px-3 text-[#14532d] font-black text-base select-none whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                        +91
                      </div>
                      <div className="relative flex-1">
                        <FieldIcon field="mobile" />
                        <input
                          className={`${inputCls} pl-11`}
                          type="tel"
                          required={formFields.mobile?.required}
                          maxLength={10}
                          placeholder={placeholders.mobile}
                          value={form.mobile}
                          onChange={e => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-5">
                  <label className={labelCls}>State / राज्य <span className="text-[#fde047]">*</span></label>
                  <div className="relative">
                    <FieldIcon field="state" />
                    <StateDropdown
                      value={form.state}
                      onChange={v => update('state', v)}
                      inputCls={`${inputCls} pl-11`}
                      placeholder={placeholders.state}
                    />
                  </div>
                </div>
              </div>

              {formFields.careerCategory?.visible !== false && (
                <div className="mb-5">
                  <label className={labelCls}>{formFields.careerCategory?.label || copy.careerCategory}<RequiredMark show={formFields.careerCategory?.required} /></label>
                  <div className="relative">
                    <FieldIcon field="careerCategory" />
                    <select className={`${inputCls} payment-select pl-11`} required={formFields.careerCategory?.required} value={form.careerCategory} onChange={e => update('careerCategory', e.target.value)}>
                      {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {formFields.notes?.visible !== false && (
                <div className="mb-6">
                  <label className={labelCls}>{formFields.notes?.label || copy.notes}<RequiredMark show={formFields.notes?.required} /></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-4 text-[#166534]/75"><MessageSquare size={18} /></span>
                    <textarea
                      className={`${inputCls} min-h-[118px] resize-none pl-11`}
                      rows={4}
                      required={formFields.notes?.required}
                      placeholder={placeholders.notes}
                      value={form.notes}
                      onChange={e => update('notes', e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button type="submit" disabled={submitting} className="ripple-btn relative flex w-full min-h-[62px] items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff5252] via-[#ef4444] to-[#b91c1c] px-5 text-white font-black text-lg shadow-[inset_0_2px_0_rgba(255,255,255,0.28),0_7px_0_#7f1d1d,0_20px_40px_-16px_rgba(0,0,0,0.78)] border-2 border-[#fef08a] hover:-translate-y-1 hover:brightness-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? <><Loader2 className="animate-spin" size={20} /> Please wait...</> : <>{copy.pay} ₹{amount} <Lock size={19} /></>}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-5 text-[#fef9c3]/85 text-sm font-semibold">
              <ShieldCheck size={15} className="text-[#fde047]" />
              <span>{copy.secured}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
