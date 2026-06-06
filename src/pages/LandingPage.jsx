import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  HelpCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Loader2,
  ShieldCheck,
  Award,
  Sparkles,
  Calendar,
  Lock,
  XCircle,
  ArrowRight,
  Target,
  TrendingUp,
  GraduationCap,
  Hourglass,
  AlertTriangle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const PAGE_CACHE_KEY = 'prakrit_landing_cache_v1';
const ZODIAC_HERO_IMAGE = '/images/zodiac-hero.png';
const POSTER_IMAGES = {
  hero: '/images/Hero.png',
  heroBoy: '/images/Hero (2).png',
  zodiacSign: '/images/zodiac-sign-clean.png',
  careerThoughts: '/images/rightcarrerthoughts-clean.png',
  careerChoice: '/images/rightcarrerchoice.png',
  workshop: '/images/whatwillleanr.png',
  finalInvite: '/images/lastinfooter.png',
  mistakeOne: '/images/3mistake-1.png',
  mistakeTwo: '/images/3mistake-2.png',
  mistakeThree: '/images/3mistake-3.png'
};

const formatWhatsAppNumber = (number = '') => number.replace(/\D/g, '');

const readLandingCache = () => {
  try { return JSON.parse(sessionStorage.getItem(PAGE_CACHE_KEY) || 'null'); } catch { return null; }
};
const writeLandingCache = (value) => {
  try { sessionStorage.setItem(PAGE_CACHE_KEY, JSON.stringify(value)); } catch { /* noop */ }
};
const injectOfferPrice = (text = '', offerPrice) => {
  if (!text || !offerPrice) return text;
  return text.replace(/₹\s*\d+\/?-?/g, `₹${offerPrice}/-`);
};

const PAGE_COPY = {
  announcementBar: '🔥 सीमित सीटें उपलब्ध | केवल इस बैच के लिए ₹77/- विशेष ऑफर',
  hero: {
    question: 'क्या आपका बच्चा 8वीं, 9वीं या 10वीं क्लास में है?',
    headline: 'भेड़चाल में आकर कहीं आप भी अपने बच्चे के कीमती 5 साल और लाखों रुपये बर्बाद तो नहीं कर रहे?',
    subheadline: 'जानिए उसका जन्मजात Natural टैलेंट और सही करियर दिशा — सीधे उसकी जन्मकुंडली के ग्रहों से!',
    masterclassTag: '✨ 1 घंटे की लाइव ऑनलाइन मास्टरक्लास',
    ctaText: 'हाँ! मैं अपने बच्चे की सीट सुरक्षित करना चाहता हूँ',
    priceNote: 'केवल इस बैच के लिए विशेष मूल्य'
  },
  problems: {
    title: 'आज के माता-पिता की सबसे बड़ी 3 गंभीर गलतियाँ',
    items: [
      { title: 'देखा-देखी में गलत फैसला', desc: 'दोस्तों और पड़ोसियों के बच्चों को देखकर बिना सोचे-समझे Science या Commerce स्ट्रीम चुन लेना।' },
      { title: 'महंगी कोचिंग पर अंधाधुंध खर्च', desc: 'बिना यह जाने कि बच्चे का दिमाग और ग्रह उस विषय के अनुकूल हैं भी या नहीं, लाखों रुपये लुटा देना।' },
      { title: '25 साल की उम्र में भटकाव (Confusion)', desc: 'ग्रेजुएशन पूरी करने के बाद भी युवाओं का यह न जान पाना कि उन्हें जीवन में असल में किस दिशा में जाना है।' }
    ],
    conclusion: '💡 समाधान? बच्चे की कुंडली में छिपा उसका "प्राकृत" Inborn ब्लूप्रिंट!'
  },
  workshop: {
    title: 'इस मास्टरक्लास में आपको क्या सीखने को मिलेगा?',
    items: [
      { title: 'करियर मैपिंग साइंस', desc: 'कुंडली के दशम (10th) और द्वितीय (2nd) भाव से बच्चे के सही प्रोफेशन को सटीक पहचानना।' },
      { title: 'फोकस और याददाश्त', desc: 'ग्रहों के वो आसान प्राकृत उपाय जो बच्चे की एकाग्रता और पढ़ाई में मन लगाने की क्षमता को 2X बढ़ा देंगे।' },
      { title: 'लाखों रुपयों की सीधी बचत', desc: 'कैसे 10वीं क्लास में लिया गया एक सही और ज्योतिषीय फैसला लाखों की ट्यूशन फीस और मानसिक तनाव बचा सकता है।' },
      { title: 'सही स्ट्रीम सिलेक्शन', desc: 'साइंस, कॉमर्स या आर्ट्स? ग्रहों की युति और मानसिक क्षमता के आधार पर सटीक और वैज्ञानिक चुनाव।' }
    ]
  },
  reveal: {
    badge: 'EXCLUSIVE BONUS',
    title: 'मास्टरक्लास का महा-आकर्षण ✨',
    desc: 'इस लाइव वर्कशॉप में शामिल होने वाले चुनिंदा पैरेंट्स को हमारे प्रीमियम वन-टू-वन पर्सनल गाइडेंस प्रोग्राम में प्रवेश का सुनहरा मौका मिलेगा।',
    bullets: [
      '2 घंटे की एक्सक्लूसिव पर्सनल ज़ूम मीटिंग सीधे हमारे मुख्य काउंसलर के साथ',
      '5 साल तक व्हाट्सएप पर निरंतर करियर प्रोग्रेस सपोर्ट गाइडेंस',
      'कस्टमाइज्ड प्राकृत करियर कुंडली डिजिटल पीडीएफ रिपोर्ट',
      'बच्चे के ग्रहों के अनुसार भाग्य रत्न + धन रत्न + ख्याति रत्न का लॉकेट पेंडेंट परामर्श'
    ]
  },
  mentor: {
    title: 'आपके मार्गदर्शक',
    role: 'Director - Tattoobaba Art Factory Pvt. Ltd. & Founder - Prakrit Career Jyotish',
    quote: 'एक बिजनेस लीडर और करियर कंसल्टेंट के रूप में, मैंने देखा है कि कैसे आज के युवा गलत करियर चुनकर जिंदगी के सबसे कीमती साल गंवा देते हैं। मेरा मिशन प्राकृत ज्योतिष के प्राचीन विज्ञान को आधुनिक करियर काउंसलिंग से जोड़कर, बच्चों को उनके जीवन की सही "प्राकृत" दिशा दिखाना है।'
  },
  faqs: [
    { question: 'क्या इसके लिए बच्चे की सटीक जन्म तिथि और समय होना जरूरी है?', answer: 'हाँ, सटीक कुंडली विश्लेषण के लिए बच्चे की जन्म तिथि, समय और जन्म स्थान की सटीक आवश्यकता होगी।' },
    { question: '₹77/- इतनी कम फीस क्यों है?', answer: 'यह फीस केवल गंभीर और अपने बच्चे के भविष्य के प्रति सजग माता-पिता को फिल्टर करने के लिए रखी गई है ताकि लाइव क्लास में केवल सिंसियर लोग आएं।' },
    { question: 'यह वर्कशॉप कहाँ और कैसे होगी?', answer: 'यह पूरी तरह से ऑनलाइन लाइव ज़ूम मीटिंग पर होगी। रजिस्ट्रेशन के तुरंत बाद आपको WhatsApp और ईमेल पर सीक्रेट लिंक मिल जाएगा।' }
  ],
  footerCta: {
    title: 'समय तेजी से निकल रहा है, और आपके बच्चे का भविष्य दांव पर है!',
    subtitle: 'आज ही अपनी सीट सुरक्षित करें',
    seats: '⚠️ सीटें बेहद सीमित हैं (केवल 100 पैरेंट्स प्रति बैच)',
    price: 'आज ही रजिस्टर करें - मात्र ₹77/- में',
    cta: 'REGISTER NOW',
    bullets: [
      'लाइव ऑनलाइन मास्टरक्लास',
      'बच्चे की सही करियर दिशा जानें',
      'सुरक्षित भविष्य की ओर कदम बढ़ाएं'
    ]
  }
};

const WORKSHOP_ICONS = [GraduationCap, Star, Target, TrendingUp];
const MISTAKE_REFERENCE = [
  { title: 'सभी बच्चों को एक ही करियर की ओर धकेलना', desc: 'हर बच्चा अलग होता है। उसकी प्रतिभा, सोच और क्षमता भी अलग होती है।' },
  { title: 'बच्चे की प्राकृतिक प्रवृत्ति को न समझना', desc: 'जब बच्चे की जन्मजात क्षमता को पहचाना नहीं जाता, तो वह अपनी पूरी क्षमता तक नहीं पहुंच पाता।' },
  { title: 'सही दिशा चुनने में देर करना', desc: 'गलत दिशा में 3-5 साल जाने के बाद बदलाव करना कठिन हो जाता है।' }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const cached = readLandingCache();
  const [pageData, setPageData] = useState(cached?.pageData || null);
  const [siteSettings, setSiteSettings] = useState(cached?.siteSettings || null);
  const [testimonials, setTestimonials] = useState(cached?.testimonials || []);
  const [faqs, setFaqs] = useState(cached?.faqs || []);
  const [loading, setLoading] = useState(!cached?.pageData);
  const [error, setError] = useState(null);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!pageData) setLoading(true);
        const [pageRes, settingsRes, testimonialsRes, faqsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/public/active-landing-page`),
          fetch(`${API_BASE_URL}/api/public/site-settings`),
          fetch(`${API_BASE_URL}/api/public/testimonials`),
          fetch(`${API_BASE_URL}/api/public/faqs`)
        ]);
        if (!pageRes.ok) throw new Error('Active landing page not found.');
        const pageDataJson = await pageRes.json();
        const nextCache = { pageData: pageDataJson, siteSettings, testimonials, faqs };
        setPageData(pageDataJson);
        if (settingsRes.ok) { nextCache.siteSettings = await settingsRes.json(); setSiteSettings(nextCache.siteSettings); }
        if (testimonialsRes.ok) { nextCache.testimonials = await testimonialsRes.json(); setTestimonials(nextCache.testimonials); }
        if (faqsRes.ok) { nextCache.faqs = await faqsRes.json(); setFaqs(nextCache.faqs); }
        writeLandingCache(nextCache);
        setError(null);
      } catch {
        setError('Failed to load page. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pageData?.settings?.countdownEnabled) return;
    const totalSeconds = (pageData.settings.countdownHours || 2) * 3600 + (pageData.settings.countdownMinutes || 0) * 60;
    const timerKey = `prakrit_countdown_end_${pageData._id}_${totalSeconds}`;
    let endAt = Number(localStorage.getItem(timerKey));
    if (!endAt) { endAt = Date.now() + totalSeconds * 1000; localStorage.setItem(timerKey, String(endAt)); }
    const updateTimer = () => {
      const s = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setTimeLeft({ hours: Math.floor(s / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 });
      return s;
    };
    updateTimer();
    const timer = setInterval(() => { if (updateTimer() <= 0) clearInterval(timer); }, 1000);
    return () => clearInterval(timer);
  }, [pageData]);

  useEffect(() => {
    if (pageData?.seo) {
      document.title = pageData.seo.title || 'Prakrit Astro';
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
      m.content = pageData.seo.description || 'Prakrit Astro';
    }
  }, [pageData]);

  const toggleFaq = (id) => setOpenFaqId(openFaqId === id ? null : id);
  const handleBookNow = () => navigate('/payment');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border-4 border-[#fde047]/30 border-t-[#fde047] animate-spin"></div>
          <Loader2 className="animate-pulse text-[#fde047]" size={32} />
        </div>
        <p className="text-[#fef9c3] font-bold tracking-wide mt-2 animate-pulse">ब्रह्मांडीय गणना की जा रही है...</p>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="p-4 bg-red-500/15 rounded-full border-2 border-red-300/40">
          <HelpCircle className="text-red-100" size={40} />
        </div>
        <h2 className="font-heading font-black text-2xl text-[#fde047]">वेबसाइट लोड करने में त्रुटि</h2>
        <p className="text-white max-w-md">{error || 'कोई सक्रिय लैंडिंग पेज नहीं मिला।'}</p>
        <button className="btn-3d-gold px-6 py-3 rounded-xl font-black" onClick={() => window.location.reload()}>पुनः प्रयास करें</button>
      </div>
    );
  }

  const pricing = pageData.pricing || { originalPrice: 1999, offerPrice: 77 };
  const settings = pageData.settings || {};
  const content = pageData.content?.hinglish || {};
  const copy = {
    announcementBar: injectOfferPrice(content.announcementBar || PAGE_COPY.announcementBar, pricing.offerPrice),
    hero: { ...PAGE_COPY.hero, ...(content.hero || {}) },
    problems: {
      title: content.problemSection?.title || PAGE_COPY.problems.title,
      items: content.problemSection?.problems?.length ? content.problemSection.problems : PAGE_COPY.problems.items,
      conclusion: content.problemSection?.solutionSubtitle || PAGE_COPY.problems.conclusion
    },
    workshop: {
      title: content.insideSection?.title || PAGE_COPY.workshop.title,
      items: content.insideSection?.points?.length ? content.insideSection.points : PAGE_COPY.workshop.items
    },
    reveal: {
      badge: content.revealSection?.subtitle || PAGE_COPY.reveal.badge,
      title: content.revealSection?.title || PAGE_COPY.reveal.title,
      desc: content.revealSection?.desc || PAGE_COPY.reveal.desc,
      bullets: content.revealSection?.bullets?.length ? content.revealSection.bullets : PAGE_COPY.reveal.bullets
    },
    mentor: { ...PAGE_COPY.mentor, ...(content.mentorSection || {}) },
    faqs: faqs.length ? faqs.filter(f => f.language === 'hinglish' || !f.language).map(f => ({ question: f.question, answer: f.answer })) : PAGE_COPY.faqs,
    footerCta: {
      title: content.footerSection?.urgencyTitle || PAGE_COPY.footerCta.title,
      subtitle: content.footerSection?.urgencySubtitle || PAGE_COPY.footerCta.subtitle,
      seats: content.footerSection?.urgencyDesc || PAGE_COPY.footerCta.seats,
      price: injectOfferPrice(content.footerSection?.urgencyPrice || PAGE_COPY.footerCta.price, pricing.offerPrice),
      cta: content.footerSection?.ctaText || PAGE_COPY.footerCta.cta,
      bullets: PAGE_COPY.footerCta.bullets,
      secureText: content.footerSection?.secureText || '100% सुरक्षित गेटवे: Razorpay, UPI, Credit/Debit Cards'
    }
  };
  const mentorName = copy.mentor.name || 'Pandit Ramendra & Rekha Tattoobaba';
  const filteredTestimonials = testimonials.filter(t => t.language === 'hinglish' || !t.language);
  const heroIllustration = pageData.media?.heroImage || ZODIAC_HERO_IMAGE;

  return (
    <div className="landing-poster-page relative overflow-x-hidden text-white font-sans antialiased pb-28 md:pb-0">

      {/* Announcement Bar */}
      {copy.announcementBar && (
        <div className="bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#b91c1c] text-white text-center py-2.5 px-4 text-xs md:text-sm font-extrabold tracking-wide z-[100] relative shadow-md border-b-2 border-[#fde047]/50">
          <span className="inline-flex items-center gap-2">
            <Sparkles size={14} className="animate-pulse text-[#fde047]" />
            {copy.announcementBar}
          </span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-[80] flex items-center justify-between gap-4 px-4 md:px-12 py-3 bg-[#052e16]/95 backdrop-blur-md border-b-2 border-[#fde047]/40 shadow-lg">
        <div className="flex items-center gap-3">
          {pageData.media?.logo ? (
            <img src={pageData.media.logo} alt="Logo" className="w-11 h-11 rounded-full object-cover border-2 border-[#fde047] shadow-md" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#fde047] to-[#ca8a04] flex items-center justify-center font-black text-[#14532d] shadow-md border-2 border-[#fde047]">P</div>
          )}
          <div className="leading-tight">
            <div className="font-heading font-black text-lg md:text-2xl tracking-tight text-white">
              {siteSettings?.websiteName || 'Prakrit'} <span className="text-[#fde047]">Astro</span>
            </div>
            <div className="text-[10px] md:text-xs text-[#fde047]/90 font-semibold">ज्योतिष से सही दिशा, बच्चे का सुनहरा भविष्य</div>
          </div>
        </div>
        {settings.whatsappNumber && (
          <a href={`https://wa.me/${formatWhatsAppNumber(settings.whatsappNumber)}?text=Hello, I have a query about Prakrit Astro.`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#22c55e] to-[#15803d] border-2 border-[#fde047] text-white text-xs md:text-sm font-black shadow-md hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300">
            <MessageCircle size={16} /><span>सपोर्ट</span>
          </a>
        )}
      </header>

      {/* Trust strip */}
      <div className="bg-[#052e16] border-b-2 border-[#166534] px-4 md:px-12 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm">
          <span className="trust-chip"><ShieldCheck size={14} className="text-[#fde047]" /> Secure Payment</span>
          <span className="trust-chip"><Award size={14} className="text-[#fde047]" /> No Fake Promises</span>
          <span className="trust-chip"><Lock size={14} className="text-[#fde047]" /> Privacy Protected</span>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section className="relative px-4 md:px-12 py-10 md:py-16 constellation-bg overflow-visible">
        <div className="poster-composite max-w-7xl mx-auto">
          <div className="poster-copy-panel">
            <div className="poster-copy-kicker">{copy.hero.question}</div>
            <h1 className="poster-copy-title">{copy.hero.headline}</h1>
            <p className="poster-copy-lead">{copy.hero.subheadline}</p>
            <div className="poster-copy-meta">
              <span><Calendar size={18} /> {copy.hero.masterclassTag}</span>
              <span><ShieldCheck size={18} /> Secure Payment</span>
            </div>
            {settings.paymentEnabled && (
              <div className="poster-action-bar">
                <div className="poster-price-pill">
                  <span>सीट बुक करें</span>
                  <strong>₹{pricing.offerPrice}</strong>
                </div>
                <button onClick={handleBookNow} className="poster-red-button">
                  Register Now <ArrowRight size={22} />
                </button>
              </div>
            )}
          </div>
          <div className="poster-image-frame poster-image-frame-hero">
            <div className="hero-stage">
              <div className="hero-glow-disc" aria-hidden="true" />
              <img src={POSTER_IMAGES.zodiacSign} alt="" aria-hidden="true" className="hero-zodiac-sign" />
              <img
                src={POSTER_IMAGES.heroBoy}
                alt="क्यों जरूरी है सही करियर दिशा"
                className="hero-boy-cutout"
                width={372}
                height={628}
                fetchpriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Why sahi career disha ===== */}
      <section className="py-14 md:py-20 px-4 md:px-12">
        <div className="poster-composite poster-composite-reverse max-w-7xl mx-auto">
          <div className="poster-image-frame poster-image-frame-career">
            <img src={POSTER_IMAGES.careerThoughts} alt="" aria-hidden="true" className="career-thoughts-overlay" loading="lazy" />
            <img
              src={POSTER_IMAGES.careerChoice}
              alt="सही करियर दिशा"
              className="section-visual"
              loading="lazy"
            />
          </div>
          <div className="poster-copy-panel">
            <div className="poster-copy-kicker">क्यों जरूरी है सही करियर दिशा?</div>
            <h2 className="poster-copy-title">क्या आप सही करियर दिशा के बिना अपने बच्चे के साल और पैसे जोखिम में डाल रहे हैं?</h2>
            <ul className="poster-card-list">
              {[
                'बच्चा किस क्षेत्र में सबसे अच्छा करेगा?',
                'कौन-सा करियर उसके स्वभाव और क्षमता के अनुसार है?',
                'भविष्य में किस क्षेत्र में सफलता की संभावना अधिक है?'
              ].map((q, i) => (
                <li key={q}>
                  <span>{i + 1}</span>
                  <strong>{q}</strong>
                </li>
              ))}
            </ul>
            {settings.paymentEnabled && (
              <div className="poster-action-bar">
                <div className="poster-price-pill">
                  <span>1 घंटे की लाइव मास्टरक्लास</span>
                  <strong>₹{pricing.offerPrice}</strong>
                </div>
                <button onClick={handleBookNow} className="poster-red-button">
                  Book Seat <ArrowRight size={22} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== 3 PARENTS' MISTAKES ===== */}
      <section className="py-14 md:py-20 px-4 md:px-12 relative">
        <div className="absolute inset-0 constellation-bg opacity-80 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="title-plaque">
              <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
                माता-पिता की <span className="text-poster-yellow">3 बड़ी गलतियाँ</span>
              </h2>
            </div>
            <p className="text-white font-semibold mt-4 text-sm md:text-base opacity-90">{copy.problems.title}</p>
          </div>

          <div className="poster-grid poster-grid-three">
            {[POSTER_IMAGES.mistakeOne, POSTER_IMAGES.mistakeTwo, POSTER_IMAGES.mistakeThree].map((src, i) => (
              <article key={src} className="mini-poster-card">
                <div className="mini-poster-copy">
                  <div className="mini-poster-number">{i + 1}</div>
                  <div>
                    <h3>{MISTAKE_REFERENCE[i].title}</h3>
                    <p>{MISTAKE_REFERENCE[i].desc}</p>
                  </div>
                </div>
                <div className="mini-poster-image-wrap">
                  <img src={src} alt={`गलती ${i + 1}`} className="mini-poster-image" loading="lazy" />
                </div>
              </article>
            ))}
          </div>

          <div className="conclusion-plaque mt-12">
            <p className="font-heading font-black text-[#14532d] text-base md:text-xl">
              {copy.problems.conclusion}
            </p>
          </div>
        </div>
      </section>

      {/* ===== Workshop Offerings ===== */}
      <section className="py-14 md:py-20 px-4 md:px-12 relative">
        <div className="absolute inset-0 constellation-bg opacity-70 pointer-events-none" />
        <div className="poster-composite max-w-7xl mx-auto relative">
          <div className="poster-copy-panel">
            <div className="poster-copy-kicker">इस मास्टरक्लास में आपको</div>
            <h2 className="poster-copy-title">क्या सीखने को मिलेगा?</h2>
            <ul className="poster-card-list poster-card-list-two">
              {copy.workshop.items.map((item, i) => {
                const Icon = WORKSHOP_ICONS[i % WORKSHOP_ICONS.length];
                return (
                  <li key={item.title}>
                    <span><Icon size={22} /></span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="poster-image-frame poster-image-frame-workshop">
            <img src={POSTER_IMAGES.workshop} alt="मास्टरक्लास में क्या सीखेंगे" className="section-visual" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ===== Bonus Reveal ===== */}
      <section className="py-14 md:py-20 px-4 md:px-12">
        <div className="relative max-w-5xl mx-auto reveal-card text-center p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#fde047]/15 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#22c55e]/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <span className="bonus-badge">⭐ {copy.reveal.badge}</span>
            <h3 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-poster-yellow tracking-tight mb-4 mt-5">
              {copy.reveal.title}
            </h3>
            <p className="text-white text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              {copy.reveal.desc}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {copy.reveal.bullets.map((bullet, i) => (
                <li key={i} className="reveal-bullet">
                  <CheckCircle className="text-[#fde047] w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Mentor ===== */}
      <section className="py-14 md:py-20 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="title-plaque title-plaque-light">
              <h2 className="font-heading font-black text-2xl md:text-4xl text-[#14532d] tracking-tight">
                {copy.mentor.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mentor-ring-3d mb-6">
              <img
                src={pageData.media?.guruImage || '/images/profile_logo.jpeg'}
                alt={mentorName}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = '/images/profile_logo.jpeg'; }}
              />
            </div>

            <div className="mentor-name-plaque mb-6">
              <h3 className="font-heading font-black text-xl md:text-3xl text-white mb-1">{mentorName}</h3>
              <div className="text-2xl md:text-4xl font-black text-poster-yellow tracking-wide">ASTRO &amp; GEMS <span className="text-[#fde047]">369</span></div>
            </div>

            <ul className="w-full max-w-2xl flex flex-col gap-3">
              {[
                '36+ वर्षों का प्राकृत ज्योतिष अनुभव',
                'हजारों बच्चों और परिवारों को सही दिशा देने का अनुभव',
                'टैरो, ज्योतिष, अंक ज्योतिष एवं रत्न विज्ञान में विशेषज्ञता'
              ].map((b, i) => (
                <li key={i} className="mentor-bullet">
                  <span><CheckCircle className="text-[#14532d]" size={20} /></span>
                  <span className="text-white font-bold text-sm md:text-base text-left">{b}</span>
                </li>
              ))}
            </ul>

            <div className="quote-block mt-8 max-w-3xl">
              <p className="text-white text-sm md:text-base leading-relaxed italic">"{copy.mentor.quote}"</p>
            </div>
            <p className="text-[#fde047] text-xs md:text-sm font-bold mt-3">{copy.mentor.role}</p>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      {filteredTestimonials.length > 0 && (
        <section className="py-14 md:py-20 px-4 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title-line font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
                संतुष्ट माता-पिता के <span className="text-poster-yellow">अनुभव</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTestimonials.map((test, i) => (
                <div key={i} className="testimonial-card">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <span className="font-black text-[#14532d] block text-lg">{test.name}</span>
                      {test.location && <span className="text-[#15803d] text-xs block mt-0.5 font-semibold">📍 {test.location}</span>}
                    </div>
                    <div className="flex gap-0.5 text-[#ca8a04]">
                      {[...Array(test.rating || 5)].map((_, j) => <Star key={j} size={16} fill="#ca8a04" stroke="none" />)}
                    </div>
                  </div>
                  <p className="text-[#14532d] text-sm md:text-base leading-relaxed italic">"{test.message}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      {copy.faqs.length > 0 && (
        <section className="py-14 md:py-20 px-4 md:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="section-title-line font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
                अक्सर पूछे जाने वाले <span className="text-poster-yellow">सवाल (FAQ)</span>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {copy.faqs.map((faq, i) => {
                const isOpen = openFaqId === i;
                return (
                  <div key={i} className={`faq-card ${isOpen ? 'faq-card-open' : ''}`}>
                    <button onClick={() => toggleFaq(i)} className="faq-button">
                      <span className="flex items-center gap-3 text-left">
                        <span className={`faq-q-badge ${isOpen ? 'faq-q-badge-open' : ''}`}>?</span>
                        <span>{faq.question}</span>
                      </span>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {isOpen && (
                      <div className="faq-answer animate-fade-in">{faq.answer}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== FINAL CTA — अंतिम आमंत्रण (single, matches reference poster) ===== */}
      {settings.countdownEnabled && (
        <section className="py-14 md:py-20 px-4 md:px-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 constellation-bg pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">

            <div className="final-invite-grid">
              {/* LEFT — content */}
              <div className="final-invite-content">
                <div className="final-headline-row">
                  <Hourglass className="hourglass-3d text-[#fde047]" size={64} />
                  <h2 className="final-headline">
                    अंतिम आमंत्रण <span className="text-[#fde047]">!</span>
                  </h2>
                </div>

                <p className="final-sub">{copy.footerCta.title}</p>

                <div className="final-stamp">{copy.footerCta.subtitle}</div>

                <ul className="final-bullets">
                  {copy.footerCta.bullets.map((b) => (
                    <li key={b}>
                      <span><Target size={20} /></span>
                      <strong>{b}</strong>
                    </li>
                  ))}
                </ul>

                {/* Countdown */}
                <div className="countdown-3d">
                  <div className="countdown-label">ऑफर समाप्त होने में शेष समय</div>
                  <div className="countdown-row">
                    {[
                      { val: timeLeft.hours, label: 'HOURS' },
                      { val: timeLeft.minutes, label: 'MINUTES' },
                      { val: timeLeft.seconds, label: 'SECONDS' }
                    ].map((t, i, arr) => (
                      <React.Fragment key={t.label}>
                        <div className="flex flex-col items-center">
                          <div className="time-card-3d">{String(t.val).padStart(2, '0')}</div>
                          <span className="time-label">{t.label}</span>
                        </div>
                        {i < arr.length - 1 && <span className="time-colon">:</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="price-ribbon-3d mt-6">
                  <span>केवल</span>
                  <strong>₹{pricing.offerPrice}</strong>
                  <span>में</span>
                </div>

                <p className="text-poster-yellow font-black text-base md:text-lg mt-4 flex items-center justify-center gap-2">
                  <AlertTriangle size={18} /> {copy.footerCta.seats}
                </p>

                {settings.paymentEnabled && (
                  <button onClick={handleBookNow} className="btn-3d-red mt-6">
                    {copy.footerCta.cta}
                    <ArrowRight size={24} />
                  </button>
                )}

                {/* Secure badges row */}
                <div className="final-trust-row mt-6">
                  <span><ShieldCheck size={16} /> Secure Payment</span>
                  <span><XCircle size={16} className="text-red-600" /> No Fake Promises</span>
                  <span><Lock size={16} /> Privacy Protected</span>
                </div>
                <p className="text-white/85 text-xs md:text-sm font-bold mt-3">{copy.footerCta.secureText}</p>
              </div>

              {/* RIGHT — poster image */}
              <div className="final-invite-imgwrap">
                <img
                  src={POSTER_IMAGES.finalInvite}
                  alt="अंतिम आमंत्रण - अभी रजिस्टर करें"
                  className="final-invite-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 px-4 md:px-12 bg-[#052e16] border-t-4 border-[#fde047]/50 text-center">
        <div className="flex justify-center flex-wrap gap-x-8 gap-y-3 mb-5 max-w-4xl mx-auto">
          {[
            ['Privacy Policy', '/privacy-policy'],
            ['Terms & Conditions', '/terms'],
            ['Refund Policy', '/refund-policy'],
            ['Contact Support', '/contact']
          ].map(([label, href]) => (
            <a key={href} href={href} className="text-white text-xs md:text-sm font-bold hover:text-[#fde047] transition-colors">{label}</a>
          ))}
        </div>
        <p className="text-[#fde047]/90 text-xs font-semibold">
          © {new Date().getFullYear()} {siteSettings?.websiteName || 'Prakrit Astro'}. All rights reserved.
        </p>
      </footer>

      {/* Sticky mobile bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[120] border-t-2 border-[#fde047]/60 bg-[#052e16]/98 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.55)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-3 py-2.5">
          {settings.countdownEnabled && (
            <div className="min-w-0 flex-1 rounded-xl border-2 border-[#fde047]/50 bg-[#064e3b] px-3 py-2">
              <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white">Time Left</div>
              <div className="mt-0.5 flex items-center gap-1 text-lg font-black text-[#fde047]">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span><span className="text-white">:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span><span className="text-white">:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          )}
          <button type="button" onClick={handleBookNow} className="btn-3d-gold min-w-[160px] rounded-xl px-4 py-3 text-center text-sm font-black">
            Book Now
            <span className="mt-0.5 block text-[11px] font-bold opacity-85">₹{pricing.offerPrice}/- only</span>
          </button>
        </div>
      </div>

      {/* Floating WhatsApp */}
      {settings.whatsappNumber && (
        <a href={`https://wa.me/${formatWhatsAppNumber(settings.whatsappNumber)}?text=Hello, I have a query about Prakrit Career Astro.`}
          target="_blank" rel="noreferrer"
          className="wa-pulse fixed right-4 bottom-24 md:bottom-6 z-[125] w-14 h-14 rounded-full bg-gradient-to-br from-[#22c55e] to-[#15803d] border-2 border-[#fde047] flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-90 transition-transform duration-300"
          aria-label="Contact WhatsApp">
          <MessageCircle size={26} />
        </a>
      )}
    </div>
  );
}
