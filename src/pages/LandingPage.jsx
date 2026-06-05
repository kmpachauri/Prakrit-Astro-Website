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
  Clock, 
  Compass 
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const PAGE_CACHE_KEY = 'prakrit_landing_cache_v1';

const readLandingCache = () => {
  try {
    return JSON.parse(sessionStorage.getItem(PAGE_CACHE_KEY) || 'null');
  } catch {
    return null;
  }
};

const writeLandingCache = (value) => {
  try {
    sessionStorage.setItem(PAGE_CACHE_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage failures.
  }
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
    subheadline: 'जानिए उसका जन्मजात Natural टैलेंट और सही करियर दिशा - सीधे उसकी जन्मकुंडली के ग्रहों से!',
    masterclassTag: '✨ 1 घंटे की लाइव ऑनलाइन मास्टरक्लास',
    ctaText: 'हाँ! मैं अपने बच्चे की सीट सुरक्षित करना चाहता हूँ - बुक नाउ',
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
      { title: 'करियर मैppings साइंस', desc: 'कुंडली के दशम (10th) और द्वितीय (2nd) भाव से बच्चे के सही प्रोफेशन को सटीक पहचानना।' },
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
    title: 'मिलिए अपने मार्गदर्शक से',
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
    seats: '⚠️ सीटें बेहद सीमित हैं (केवल 100 पैरेंट्स प्रति बैच)',
    price: 'आज ही रजिस्टर करें - मात्र ₹77/- में (कीमत कभी भी बढ़ सकती है)',
    cta: 'अपने बच्चे का भविष्य सुरक्षित करें - अभी बुक करें 🚀'
  }
};

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
        const nextCache = {
          pageData: pageDataJson,
          siteSettings,
          testimonials,
          faqs
        };
        setPageData(pageDataJson);

        if (settingsRes.ok) {
          nextCache.siteSettings = await settingsRes.json();
          setSiteSettings(nextCache.siteSettings);
        }

        if (testimonialsRes.ok) {
          nextCache.testimonials = await testimonialsRes.json();
          setTestimonials(nextCache.testimonials);
        }
        if (faqsRes.ok) {
          nextCache.faqs = await faqsRes.json();
          setFaqs(nextCache.faqs);
        }
        writeLandingCache(nextCache);
        
        setError(null);
      } catch {
        setError('Failed to load page. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!pageData?.settings?.countdownEnabled) return;
    const totalSeconds = (pageData.settings.countdownHours || 2) * 3600 + (pageData.settings.countdownMinutes || 0) * 60;
    const timerKey = `prakrit_countdown_end_${pageData._id}_${totalSeconds}`;
    let endAt = Number(localStorage.getItem(timerKey));
    if (!endAt) {
      endAt = Date.now() + totalSeconds * 1000;
      localStorage.setItem(timerKey, String(endAt));
    }
    const updateTimer = () => {
      const secondsRemaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setTimeLeft({
        hours: Math.floor(secondsRemaining / 3600),
        minutes: Math.floor((secondsRemaining % 3600) / 60),
        seconds: secondsRemaining % 60
      });
      return secondsRemaining;
    };
    updateTimer();
    const timer = setInterval(() => {
      if (updateTimer() <= 0) clearInterval(timer);
    }, 1000);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030a05] gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border-4 border-[#ecc472]/20 border-t-[#ecc472] animate-spin"></div>
          <Loader2 className="animate-pulse text-[#f37446]" size={32} />
        </div>
        <p className="text-[#a8c1b0] font-medium tracking-wide mt-2 animate-pulse">ब्रह्मांडीय गणना की जा रही है...</p>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030a05] gap-6 text-center px-4">
        <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
          <HelpCircle className="text-red-400" size={40} />
        </div>
        <h2 className="font-heading font-bold text-2xl text-red-400">वेबसाइट लोड करने में त्रुटि</h2>
        <p className="text-[#a8c1b0] max-w-md">{error || 'कोई सक्रिय लैंडिंग पेज नहीं मिला।'}</p>
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#f37446] to-[#d6431a] text-white font-bold shadow-lg hover:shadow-[#f37446]/20 transition-all duration-300" onClick={() => window.location.reload()}>पुनः प्रयास करें</button>
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
      seats: content.footerSection?.urgencyDesc || PAGE_COPY.footerCta.seats,
      price: injectOfferPrice(content.footerSection?.urgencyPrice || PAGE_COPY.footerCta.price, pricing.offerPrice),
      cta: content.footerSection?.ctaText || PAGE_COPY.footerCta.cta,
      secureText: content.footerSection?.secureText || '100% सुरक्षित गेटवे: Razorpay, UPI, Credit/Debit Cards'
    }
  };
  const mentorName = copy.mentor.name || 'Pandit Ramendra & Rekha';
  const filteredTestimonials = testimonials.filter(t => t.language === 'hinglish' || !t.language);

  return (
    <div className="relative overflow-x-hidden bg-[#030a05] text-[#e6efe8] font-sans antialiased selection:bg-[#f37446]/30 selection:text-white pb-28 md:pb-0">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#f37446]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[120vh] right-1/4 w-[600px] h-[600px] bg-[#25d366]/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-[#ecc472]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Announcement Bar */}
      {copy.announcementBar && (
        <div className="bg-gradient-to-r from-[#d6431a] via-[#f37446] to-[#d6431a] text-white text-center py-2.5 px-4 text-xs md:text-sm font-extrabold tracking-wide z-[100] relative shadow-md border-b border-white/10">
          <span className="inline-flex items-center gap-2">
            <Sparkles size={14} className="animate-pulse text-[#ecc472]" />
            {copy.announcementBar}
          </span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-[80] flex items-center justify-between gap-4 px-4 md:px-12 py-4 bg-[#030a05]/75 backdrop-blur-xl border-b border-white/5 shadow-lg">
        <div className="flex items-center gap-3">
          {pageData.media?.logo ? (
            <img src={pageData.media.logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-[#f37446]/50 shadow-md shadow-[#f37446]/10" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f37446] to-[#d6431a] flex items-center justify-center font-bold text-white shadow-md">P</div>
          )}
          <span className="font-heading font-black text-xl md:text-2xl tracking-tight bg-gradient-to-r from-white via-[#e6efe8] to-[#ecc472] bg-clip-text text-transparent">
            {siteSettings?.websiteName || 'Prakrit Astro'}
          </span>
        </div>
        {settings.whatsappNumber && (
          <a href={`https://wa.me/${settings.whatsappNumber.replace('+', '')}?text=Hello, I have a query about Prakrit Astro.`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#0e6e63] text-white text-xs md:text-sm font-bold shadow-md shadow-[#25D366]/10 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300">
            <MessageCircle size={16} /><span className="hidden sm:inline">WhatsApp Support</span>
          </a>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-70px)] flex items-center px-4 md:px-12 py-12 lg:py-20 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[#ecc472] text-xs font-bold tracking-wider border border-[#ecc472]/30 bg-[#ecc472]/10 backdrop-blur-md mb-6 animate-fade-in">
              <Sparkles size={12} className="animate-spin-slow" />
              {copy.hero.question}
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15] tracking-tight text-white mb-6">
              {copy.hero.headline.split(' ').map((word, i) => 
                word.includes('बर्बाद') || word.includes('लाखों') ? <span key={i} className="text-[#f37446]">{word} </span> : word + ' '
              )}
            </h1>

            <p className="text-[#cdded2] text-base md:text-lg lg:text-xl leading-relaxed mb-6 max-w-2xl border-l-2 border-[#ecc472]/40 pl-4">
              {copy.hero.subheadline}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <Clock size={16} className="text-[#f37446]" />
              {copy.hero.masterclassTag}
            </div>

            {/* Price Badge for Mobile (Hidden on Desktop grid) */}
            <div className="lg:hidden w-full mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
              <div>
                <span className="text-[#84a190] line-through text-sm mr-2">₹{pricing.originalPrice}</span>
                <span className="text-2xl font-black text-[#ecc472]">₹{pricing.offerPrice}/-</span>
              </div>
              <span className="text-xs text-[#cdded2] bg-[#f37446]/20 px-2 py-1 rounded border border-[#f37446]/30">{copy.hero.priceNote}</span>
            </div>

            {settings.paymentEnabled && (
              <button onClick={handleBookNow}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#f37446] via-[#d6431a] to-[#f37446] text-white font-black text-base md:text-lg shadow-xl shadow-[#f37446]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-wide group">
                {copy.hero.ctaText}
                <span className="block text-xs font-normal text-white/80 normal-case mt-0.5">साइनअप करने में केवल 1 मिनट लगता है</span>
              </button>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-[#cdded2]">
                <ShieldCheck size={14} className="text-[#ecc472]" /> secure payment
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-[#cdded2]">
                <Award size={14} className="text-[#ecc472]" /> no fake promises
              </div>
            </div>
          </div>

          {/* Right Hero Column: Premium Interactive Astro Mockup Container */}
          <div className="lg:col-span-5 relative w-full flex justify-center items-center">
            <div className="relative w-full max-w-[400px] aspect-square rounded-3xl p-1 bg-gradient-to-br from-[#ecc472]/30 via-transparent to-[#f37446]/20 shadow-2xl backdrop-blur-xl">
              <div className="w-full h-full rounded-[22px] bg-[#051107] overflow-hidden relative flex flex-col justify-center items-center p-6 text-center border border-white/5">
                
                {/* AI Astrology Visual Overlay */}
                <img 
                  src={pageData.media?.heroImage || '/images/career-boost-hero.png'}
                  alt="Cosmic Energy Chart" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen pointer-events-none" 
                />
                
                {/* Glowing Core */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#f37446]/40 to-[#ecc472]/30 absolute blur-3xl pointer-events-none" />
                
                <Compass className="text-[#ecc472] w-16 h-16 mb-4 animate-spin-slow relative z-10" />
                
                <h3 className="font-heading font-black text-xl text-white relative z-10 mb-2">प्राकृत ज्योतिष X आधुनिक करियर गाइड</h3>
                <p className="text-xs text-[#cdded2] relative z-10 max-w-xs mb-6">ग्रहों की चाल और आपके बच्चे के इनबिल्ट टैलेंट का सबसे आधुनिक वैज्ञानिक विश्लेषण</p>
                
                {/* Pricing Box embedded inside card */}
                <div className="hidden lg:block w-full bg-black/40 border border-white/10 rounded-2xl p-4 relative z-10">
                  <p className="text-xs text-[#84a190] uppercase tracking-wider mb-1">{copy.hero.priceNote}</p>
                  <div className="flex justify-center items-baseline gap-2">
                    <span className="text-sm line-through text-[#84a190]">₹{pricing.originalPrice}</span>
                    <span className="text-3xl font-black text-[#ecc472]">₹{pricing.offerPrice}</span>
                    <span className="text-xs text-white/70">/- मात्र</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 md:py-28 px-4 md:px-12 bg-[#051107]/60 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-4">
              {copy.problems.title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#f37446] to-[#ecc472] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {copy.problems.items.map((prob, i) => (
              <div key={i} className="group relative rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-6 md:p-8 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#f37446]/30 hover:shadow-xl hover:shadow-[#f37446]/5">
                <div className="w-12 h-12 rounded-xl bg-[#f37446]/10 border border-[#f37446]/20 flex items-center justify-center text-[#f37446] mb-6 group-hover:bg-[#f37446] group-hover:text-white transition-all duration-300">
                  <HelpCircle size={22} />
                </div>
                <h4 className="font-heading font-bold text-lg text-white mb-3 group-hover:text-[#ecc472] transition-colors">{prob.title}</h4>
                <p className="text-[#cdded2] text-sm leading-relaxed">{prob.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative max-w-3xl mx-auto mt-16 rounded-2xl text-center p-6 md:p-8 overflow-hidden border border-[#ecc472]/30 shadow-xl"
            style={{ background: 'linear-gradient(135deg, #0e2913, #051107)' }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,116,70,0.1),transparent_65%)] pointer-events-none" />
            <p className="relative z-10 font-heading font-black text-[#ecc472] text-lg md:text-xl flex flex-col sm:flex-row items-center justify-center gap-2">
              {copy.problems.conclusion}
            </p>
          </div>
        </div>
      </section>

      {/* Workshop Offerings Section */}
      <section className="py-20 md:py-28 px-4 md:px-12 bg-[#030a05]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-4">
              {copy.workshop.title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#25d366] to-[#ecc472] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {copy.workshop.items.map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-md hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#f37446]/20 to-[#ecc472]/20 border border-[#f37446]/20">
                  <CheckCircle className="text-[#ecc472]" size={20} />
                </div>
                <h4 className="font-heading font-bold text-base md:text-lg text-white mb-2">{item.title}</h4>
                <p className="text-[#cdded2] text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Big Reveal / Attraction Bonus Section */}
      <section className="py-20 px-4 md:px-12 bg-[#051107]/40 border-t border-b border-white/5">
        <div className="relative max-w-4xl mx-auto rounded-[32px] text-center p-8 md:p-14 overflow-hidden border border-white/10 shadow-2xl"
          style={{ background: 'linear-gradient(160deg, #091f0f 0%, #030a05 100%)' }}>
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#f37446]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ecc472]/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-gradient-to-r from-[#f37446] to-[#d6431a] text-white text-[10px] tracking-widest font-black uppercase px-4 py-1.5 shadow-md mb-6">
              {copy.reveal.badge}
            </span>
            <h3 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-4">
              {copy.reveal.title}
            </h3>
            <p className="text-[#cdded2] text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
              {copy.reveal.desc}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {copy.reveal.bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm text-white hover:bg-white/[0.05] transition-all duration-200">
                  <Sparkles className="text-[#ecc472] w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm leading-relaxed">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Mentor Section */}
      <section className="py-20 md:py-28 px-4 md:px-12 bg-[#030a05]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-4">
              {copy.mentor.title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#f37446] to-[#ecc472] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-12 items-center p-6 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl shadow-xl">
            <div className="w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden mx-auto border-2 border-[#ecc472]/30 shadow-lg relative group">
              <img
                src={pageData.media?.guruImage || '/images/profile_logo.jpeg'}
                alt={mentorName} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={e => { e.target.src = '/images/profile_logo.jpeg'; }}
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-heading font-black text-xl md:text-2xl text-white mb-2">{mentorName}</h3>
              <p className="text-[#f37446] text-xs md:text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-3">{copy.mentor.role}</p>
              <p className="text-[#cdded2] text-sm md:text-base leading-relaxed italic text-white/90">
                "{copy.mentor.quote}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {filteredTestimonials.length > 0 && (
        <section className="py-20 md:py-28 px-4 md:px-12 bg-[#051107]/40 border-t border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-4">
                संतुष्ट माता-पिता के अनुभव (Client Feedback)
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#ecc472] to-[#f37446] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTestimonials.map((test, i) => (
                <div key={i} className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <span className="font-bold text-white block">{test.name}</span>
                        {test.location && <span className="text-[#84a190] text-xs block mt-0.5">📍 {test.location}</span>}
                      </div>
                      <div className="flex gap-0.5 text-[#ecc472]">
                        {[...Array(test.rating || 5)].map((_, j) => <Star key={j} size={14} fill="#ecc472" stroke="none" />)}
                      </div>
                    </div>
                    <p className="text-[#cdded2] text-sm leading-relaxed italic">"{test.message}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {copy.faqs.length > 0 && (
        <section className="py-20 md:py-28 px-4 md:px-12 bg-[#030a05]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-4">
                अक्सर पूछे जाने वाले सवाल (FAQ)
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-white to-transparent mx-auto rounded-full" />
            </div>

            <div className="flex flex-col gap-4">
              {copy.faqs.map((faq, i) => {
                const isOpen = openFaqId === i;
                return (
                  <div key={i} className={`rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-white/[0.05] border-[#f37446]/30 shadow-md' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                    <button onClick={() => toggleFaq(i)} className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-bold text-sm md:text-base text-white hover:text-[#f37446] transition-colors min-h-[56px]">
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp size={18} className="text-[#f37446]" /> : <ChevronDown size={18} />}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-2 text-[#cdded2] text-xs md:text-sm leading-relaxed border-t border-white/5 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Urgency & Live Countdown Component */}
      {settings.countdownEnabled && (
        <section className="py-20 px-4 md:px-12 text-center border-t border-white/5 relative"
          style={{ background: 'radial-gradient(circle at top, rgba(236,116,70,0.12), transparent 60%)' }}>
          
          <div className="max-w-4xl mx-auto">
            <h3 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white mb-4 leading-tight">
              {copy.footerCta.title}
            </h3>
            <p className="text-[#f37446] font-bold text-sm md:text-base tracking-wide mb-8">
              {copy.footerCta.seats}
            </p>

            {/* Premium Dynamic Timer Card */}
            <div className="flex justify-center gap-4 md:gap-6 items-center mb-10">
              {[
                { val: timeLeft.hours, label: 'Hours' }, 
                { val: timeLeft.minutes, label: 'Minutes' }, 
                { val: timeLeft.seconds, label: 'Seconds' }
              ].map((timeUnit, i, arr) => (
                <React.Fragment key={timeUnit.label}>
                  <div className="flex flex-col items-center">
                    <div className="min-w-[64px] md:min-w-[84px] min-h-[64px] md:min-h-[84px] rounded-xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 flex items-center justify-center font-heading font-black text-[#ecc472] text-2xl md:text-4xl shadow-md">
                      {String(timeUnit.val).padStart(2, '0')}
                    </div>
                    <span className="text-[#84a190] text-[10px] font-bold uppercase tracking-widest mt-2">{timeUnit.label}</span>
                  </div>
                  {i < arr.length - 1 && <span className="text-[#f37446] text-2xl md:text-3xl font-black mb-5 animate-pulse">:</span>}
                </React.Fragment>
              ))}
            </div>

            <p className="text-[#ecc472] font-semibold text-sm md:text-base mb-6">{copy.footerCta.price}</p>

            {settings.paymentEnabled && (
              <button onClick={handleBookNow}
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-[#f37446] via-[#d6431a] to-[#f37446] text-white font-black text-base md:text-lg shadow-xl shadow-[#f37446]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                {copy.footerCta.cta}
              </button>
            )}

            <div className="flex items-center justify-center gap-2 mt-6 text-[#cdded2] text-xs opacity-80">
              <ShieldCheck size={14} className="text-[#ecc472]" />
              <span>{copy.footerCta.secureText}</span>
            </div>
          </div>
        </section>
      )}

      {/* Clean Modern Footer */}
      <footer className="py-12 px-4 md:px-12 bg-[#020703] border-t border-white/5 text-center">
        <div className="flex justify-center flex-wrap gap-x-8 gap-y-3 mb-6 max-w-4xl mx-auto">
          {[
            ['Privacy Policy', '/privacy-policy'], 
            ['Terms & Conditions', '/terms'], 
            ['Refund Policy', '/refund-policy'], 
            ['Contact Support', '/contact']
          ].map(([label, href]) => (
            <a key={href} href={href} className="text-[#a8c1b0] text-xs md:text-sm font-medium hover:text-[#f37446] transition-colors">{label}</a>
          ))}
        </div>
        <p className="text-[#5f7d6d] text-xs">
          © {new Date().getFullYear()} {siteSettings?.websiteName || 'Prakrit Astro'}. All rights reserved.
        </p>
      </footer>

      {/* Sticky Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[120] border-t border-white/10 bg-[#041109]/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          {settings.countdownEnabled && (
            <div className="min-w-0 flex-1 rounded-2xl border border-[#ecc472]/20 bg-white/5 px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#84a190]">
                Time Left
              </div>
              <div className="mt-1 flex items-center gap-1 text-lg font-black text-[#ecc472]">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[#f37446]">:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[#f37446]">:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleBookNow}
            className="min-w-[168px] rounded-2xl bg-gradient-to-r from-[#f37446] to-[#d6431a] px-5 py-3.5 text-center text-sm font-black text-white shadow-xl shadow-[#d6431a]/30 active:scale-95 transition-transform"
          >
            Book Now
            <span className="mt-0.5 block text-[11px] font-semibold text-white/85">₹{pricing.offerPrice}/- only</span>
          </button>
        </div>
      </div>

      {/* Floating Action WhatsApp */}
      {settings.whatsappNumber && (
        <a href={`https://wa.me/${settings.whatsappNumber.replace('+', '')}?text=Hello, I have a query about Prakrit Career Astro.`}
          target="_blank" rel="noreferrer"
          className="fixed right-4 bottom-24 md:bottom-6 z-[125] w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#25D366] to-[#0e6e63] flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-90 transition-transform duration-300"
          aria-label="Contact WhatsApp">
          <MessageCircle size={24} />
        </a>
      )}
    </div>
  );
}
