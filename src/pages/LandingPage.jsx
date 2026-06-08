import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Circle as HelpCircle, CircleCheck as CheckCircle, ChevronDown, ChevronUp, Star, Loader as Loader2, ShieldCheck, Award, Sparkles, Clock, Calendar, Lock, Circle as XCircle, ArrowRight, Target, Compass, TrendingUp, GraduationCap, Hourglass, TriangleAlert as AlertTriangle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
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

const injectOfferPrice = (text = '', offerPrice) => {
  if (!text || !offerPrice) return text;
  return text.replace(/₹\s*\d+\/?-?/g, `₹${offerPrice}/-`);
};

const PAGE_COPY = {
  general: {
    brandName: 'Prakrit Astro',
    headerTagline: 'ज्योतिष से सही दिशा, बच्चे का सुनहरा भविष्य',
    supportLabel: 'सपोर्ट',
    whatsappMessage: 'Hello, I have a query about Prakrit Astro.'
  },
  announcementBar: '🔥 सीमित सीटें उपलब्ध | केवल इस बैच के लिए ₹77/- विशेष ऑफर',
  hero: {
    question: 'क्या आपका बच्चा 8वीं, 9वीं या 10वीं क्लास में है?',
    headline: 'भेड़चाल में आकर कहीं आप भी अपने बच्चे के कीमती 5 साल और लाखों रुपये बर्बाद तो नहीं कर रहे?',
    subheadline: 'जानिए उसका जन्मजात Natural टैलेंट और सही करियर दिशा — सीधे उसकी जन्मकुंडली के ग्रहों से!',
    masterclassTag: '✨ 1 घंटे की लाइव ऑनलाइन मास्टरक्लास',
    ctaText: 'हाँ! मैं अपने बच्चे की सीट सुरक्षित करना चाहता हूँ',
    offerLabel: 'सीमित ऑफर',
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
    kicker: 'इस मास्टरक्लास में आपको',
    title: 'इस मास्टरक्लास में आपको क्या सीखने को मिलेगा?',
    items: [
      { title: 'जन्मकुंडली विश्लेषण', desc: 'ग्रहों की स्थिति के आधार पर बच्चे की प्रमुख क्षमताओं की पहचान।' },
      { title: 'नेचुरल टैलेंट पहचान', desc: 'बच्चे की विशेष रुचियों और प्राकृतिक गुणों को समझना।' },
      { title: 'सही करियर दिशा', desc: 'भविष्य में सफलता के लिए उपयुक्त करियर विकल्पों का चयन।' },
      { title: 'भविष्य की संभावनाएँ', desc: 'आने वाले समय में बेहतर अवसर और संभावित चुनौतियों का विश्लेषण।' },
      { title: 'लाइव Q&A', desc: 'आपके सभी सवालों के स्पष्ट और व्यावहारिक उत्तर।' }
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
    quote: 'एक बिजनेस लीडर और करियर कंसल्टेंट के रूप में, मैंने देखा है कि कैसे आज के युवा गलत करियर चुनकर जिंदगी के सबसे कीमती साल गंवा देते हैं। मेरा मिशन प्राकृत ज्योतिष के प्राचीन विज्ञान को आधुनिक करियर काउंसलिंग से जोड़कर, बच्चों को उनके जीवन की सही "प्राकृत" दिशा दिखाना है।',
    brandLine: 'ASTRO & GEMS 369',
    bullets: [
      '36+ वर्षों का प्राकृत ज्योतिष अनुभव',
      'हजारों बच्चों और परिवारों को सही दिशा देने का अनुभव',
      'टैरो, ज्योतिष, अंक ज्योतिष एवं रत्न विज्ञान में विशेषज्ञता'
    ]
  },
  careerDirection: {
    kicker: 'क्यों जरूरी है सही करियर दिशा?',
    headline: 'क्या आप सही करियर दिशा के बिना अपने बच्चे के साल और पैसे जोखिम में डाल रहे हैं?',
    questions: [
      'बच्चा किस क्षेत्र में सबसे अच्छा करेगा?',
      'कौन-सा करियर उसके स्वभाव और क्षमता के अनुसार है?',
      'भविष्य में किस क्षेत्र में सफलता की संभावना अधिक है?'
    ],
    priceLabel: '1 घंटे की लाइव मास्टरक्लास'
  },
  testimonial: {
    titlePrefix: 'संतुष्ट माता-पिता के',
    titleHighlight: 'अनुभव'
  },
  faqSection: {
    titlePrefix: 'अक्सर पूछे जाने वाले',
    titleHighlight: 'सवाल (FAQ)'
  },
  faqs: [],
  footerCta: {
    headline: 'अंतिम आमंत्रण',
    countdownLabel: 'ऑफर समाप्त होने में शेष समय',
    title: 'समय तेजी से निकल रहा है, और आपके बच्चे का भविष्य दांव पर है!',
    subtitle: 'आज ही अपनी सीट सुरक्षित करें',
    seats: '⚠️ सीटें बेहद सीमित हैं (केवल 100 पैरेंट्स प्रति बैच)',
    price: 'आज ही रजिस्टर करें - मात्र ₹77/- में',
    cta: 'REGISTER NOW',
    bullets: [
      'लाइव ऑनलाइन मास्टरक्लास',
      'बच्चे की सही करियर दिशा जानें',
      'सुरक्षित भविष्य की ओर कदम बढ़ाएं'
    ],
    trustBadges: ['Secure Payment', 'No Fake Promises', 'Privacy Protected']
  },
  footer: {
    links: [
      // { label: 'Privacy Policy', href: '/privacy-policy' },
      // { label: 'Terms & Conditions', href: '/terms' },
      // { label: 'Refund Policy', href: '/refund-policy' },
      { label: 'Contact Support', href: '/contact' }
    ],
    copyrightName: 'Prakrit Astro'
  }
};

const WORKSHOP_ICON_RULES = [
  { pattern: /(कुंडली|मैपिंग|mapping|analysis|career|जन्मकुंडली|विश्लेषण)/i, Icon: GraduationCap },
  { pattern: /(फोकस|याददाश्त|focus|memory)/i, Icon: Star },
  { pattern: /(स्ट्रीम|selection|चयन|दिशा|target)/i, Icon: Target },
  { pattern: /(भविष्य|संभावना|बचत|saving|future|growth|trend)/i, Icon: TrendingUp },
  { pattern: /(q&a|सवाल|प्रश्न|उत्तर|live)/i, Icon: MessageCircle }
];
const REVEAL_ICONS = [Clock, MessageCircle, Compass, Sparkles];
const FINAL_BULLET_ICONS = [Calendar, Compass, ShieldCheck];
const MISTAKE_REFERENCE = [
  { title: 'सभी बच्चों को एक ही करियर की ओर धकेलना', desc: 'हर बच्चा अलग होता है। उसकी प्रतिभा, सोच और क्षमता भी अलग होती है।' },
  { title: 'बच्चे की प्राकृतिक प्रवृत्ति को न समझना', desc: 'जब बच्चे की जन्मजात क्षमता को पहचाना नहीं जाता, तो वह अपनी पूरी क्षमता तक नहीं पहुंच पाता।' },
  { title: 'सही दिशा चुनने में देर करना', desc: 'गलत दिशा में 3-5 साल जाने के बाद बदलाव करना कठिन हो जाता है।' }
];

const SAMPLE_TESTIMONIAL = {
  name: 'रीना शर्मा',
  location: 'जयपुर',
  rating: 5,
  message: 'इस मास्टरक्लास के बाद हमें पहली बार समझ आया कि बच्चे की रुचि और जन्मजात क्षमता के हिसाब से करियर दिशा चुनना कितना जरूरी है।'
};

const PriceDisplay = ({ offerPrice, originalPrice = 1999 }) => (
  <div className="price-anchor-display">
    <s className="original-price">₹{originalPrice}</s>
    <strong className="final-price">₹{offerPrice}</strong>
  </div>
);

const renderHeroHeadline = (headline = '') => {
  const parts = headline.split(/(5 साल|लाखों रुपये)/g);
  return parts.map((part, index) => (
    part === '5 साल' || part === 'लाखों रुपये'
      ? <span key={`${part}-${index}`} className="highlight-price">{part}</span>
      : part
  ));
};

const renderCareerHeadline = (headline = '') => {
  const parts = headline.split(/(सही करियर दिशा|साल|पैसे)/g);
  return parts.map((part, index) => (
    part === 'सही करियर दिशा' || part === 'साल' || part === 'पैसे'
      ? <span key={`${part}-${index}`} className="highlight-price">{part}</span>
      : part
  ));
};

const renderBrandName = (name = 'Prakrit Astro') => {
  const parts = name.split(/(Astro)/i);
  return parts.map((part, index) => (
    part.toLowerCase() === 'astro'
      ? <span key={`${part}-${index}`} className="brand-astro">{part}</span>
      : part
  ));
};

const pickPageContent = (content = {}) => {
  const candidates = [content.hinglish, content.hindi, content.english];
  return candidates.find(section => section && Object.keys(section).length) || {};
};

const getUniqueFaqs = (items = []) => {
  const seen = new Set();
  return items.filter(item => {
    const key = `${item.question || ''}::${item.answer || ''}`.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getWorkshopIcon = (item = {}, index = 0) => {
  const haystack = `${item.title || ''} ${item.desc || ''}`;
  const matchedRule = WORKSHOP_ICON_RULES.find(({ pattern }) => pattern.test(haystack));
  if (matchedRule) return matchedRule.Icon;
  return [GraduationCap, Star, Target, TrendingUp, MessageCircle][index % 5];
};

const readCountdownCache = (storageKey) => {
  const storages = [sessionStorage, localStorage];
  for (const storage of storages) {
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && Number.isFinite(parsed.endAt)) {
        return parsed;
      }
    } catch {
      // Ignore malformed cache entries.
    }
  }
  return null;
};

const writeCountdownCache = (storageKey, payload) => {
  const value = JSON.stringify(payload);
  [sessionStorage, localStorage].forEach((storage) => {
    try {
      storage.setItem(storageKey, value);
    } catch {
      // Ignore storage failures.
    }
  });
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!pageData) setLoading(true);
        const [pageRes, testimonialsRes, faqsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/public/active-landing-page`),
          fetch(`${API_BASE_URL}/api/public/testimonials`),
          fetch(`${API_BASE_URL}/api/public/faqs`)
        ]);
        if (!pageRes.ok) throw new Error('Active landing page not found.');
        const pageDataJson = await pageRes.json();
        setPageData(pageDataJson);
        if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json());
        if (faqsRes.ok) setFaqs(await faqsRes.json());
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
    const totalSeconds = (Number(pageData?.settings?.countdownHours) || 0) * 3600 + (Number(pageData?.settings?.countdownMinutes) || 0) * 60;
    if (totalSeconds <= 0) return;

    const storageKey = `prakrit-countdown-${pageData._id || pageData.slug || 'active'}`;
    const configVersion = `${pageData.updatedAt || ''}:${pageData.settings?.countdownHours || 0}:${pageData.settings?.countdownMinutes || 0}`;
    const cachedTimer = readCountdownCache(storageKey);
    let endAt =
      cachedTimer?.configVersion === configVersion && cachedTimer.endAt > Date.now()
        ? cachedTimer.endAt
        : Date.now() + totalSeconds * 1000;

    writeCountdownCache(storageKey, { configVersion, endAt });

    const updateTimer = () => {
      let secondsRemaining = Math.ceil((endAt - Date.now()) / 1000);
      if (secondsRemaining <= 0) {
        endAt = Date.now() + totalSeconds * 1000;
        writeCountdownCache(storageKey, { configVersion, endAt });
        secondsRemaining = totalSeconds;
      }
      setTimeLeft({
        hours: Math.floor(secondsRemaining / 3600),
        minutes: Math.floor((secondsRemaining % 3600) / 60),
        seconds: secondsRemaining % 60
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [
    pageData?._id,
    pageData?.slug,
    pageData?.updatedAt,
    pageData?.settings?.countdownHours,
    pageData?.settings?.countdownMinutes
  ]);

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
  const shouldShowCountdown = ((Number(settings.countdownHours) || 0) * 3600 + (Number(settings.countdownMinutes) || 0) * 60) > 0;
  const content = pickPageContent(pageData.content);
  const adminProblemItems = content.problemSection?.problems?.length ? content.problemSection.problems : null;
  const displayMistakes = adminProblemItems || MISTAKE_REFERENCE;
  const copy = {
    general: { ...PAGE_COPY.general, ...(content.generalSection || {}) },
    announcementBar: injectOfferPrice(content.announcementBar || PAGE_COPY.announcementBar, pricing.offerPrice),
    hero: { ...PAGE_COPY.hero, ...(content.hero || {}) },
    careerDirection: {
      ...PAGE_COPY.careerDirection,
      ...(content.careerDirectionSection || {}),
      questions: content.careerDirectionSection?.questions?.length ? content.careerDirectionSection.questions : PAGE_COPY.careerDirection.questions
    },
    problems: {
      title: content.problemSection?.title || PAGE_COPY.problems.title,
      items: adminProblemItems || MISTAKE_REFERENCE,
      conclusion: content.problemSection?.solutionSubtitle || PAGE_COPY.problems.conclusion
    },
    workshop: {
      kicker: content.insideSection?.kicker || PAGE_COPY.workshop.kicker,
      title: content.insideSection?.title || PAGE_COPY.workshop.title,
      items: content.insideSection?.points?.length ? content.insideSection.points : PAGE_COPY.workshop.items
    },
    reveal: {
      badge: content.revealSection?.subtitle || PAGE_COPY.reveal.badge,
      title: content.revealSection?.title || PAGE_COPY.reveal.title,
      desc: content.revealSection?.desc || PAGE_COPY.reveal.desc,
      bullets: content.revealSection?.bullets?.length ? content.revealSection.bullets : PAGE_COPY.reveal.bullets
    },
    mentor: {
      ...PAGE_COPY.mentor,
      ...(content.mentorSection || {}),
      bullets: content.mentorSection?.bullets?.length ? content.mentorSection.bullets : PAGE_COPY.mentor.bullets
    },
    testimonial: { ...PAGE_COPY.testimonial, ...(content.testimonialSection || {}) },
    faqSection: { ...PAGE_COPY.faqSection, ...(content.faqSection || {}) },
    faqs: getUniqueFaqs(faqs).map(f => ({ question: f.question, answer: f.answer })),
    footerCta: {
      title: content.footerSection?.urgencyTitle || PAGE_COPY.footerCta.title,
      subtitle: content.footerSection?.subtitle || content.footerSection?.urgencySubtitle || PAGE_COPY.footerCta.subtitle,
      seats: content.footerSection?.urgencyDesc || PAGE_COPY.footerCta.seats,
      price: injectOfferPrice(content.footerSection?.urgencyPrice || PAGE_COPY.footerCta.price, pricing.offerPrice),
      cta: content.footerSection?.ctaText || PAGE_COPY.footerCta.cta,
      bullets: content.footerSection?.bullets?.length ? content.footerSection.bullets : PAGE_COPY.footerCta.bullets,
      headline: content.footerSection?.headline || PAGE_COPY.footerCta.headline,
      countdownLabel: content.footerSection?.countdownLabel || PAGE_COPY.footerCta.countdownLabel,
      trustBadges: content.footerSection?.trustBadges?.length ? content.footerSection.trustBadges : PAGE_COPY.footerCta.trustBadges,
      secureText: content.footerSection?.secureText || '100% सुरक्षित गेटवे: Razorpay, UPI, Credit/Debit Cards'
    },
    footer: {
      ...PAGE_COPY.footer,
      ...(content.siteFooterSection || {}),
      links: content.siteFooterSection?.links?.length ? content.siteFooterSection.links : PAGE_COPY.footer.links
    }
  };
  const mentorName = copy.mentor.name || 'Pandit Ramendra & Rekha Tattoobaba';
  const filteredTestimonials = testimonials.length ? testimonials : [SAMPLE_TESTIMONIAL];

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
      <header className="sticky top-0 z-[80] flex items-center justify-between gap-4 px-4 md:px-12 py-3 bg-[#003f0d] backdrop-blur-xl border-b border-[#fde047]/25 shadow-[0_10px_28px_rgba(0,0,0,0.28)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#fde047] to-[#ca8a04] flex items-center justify-center font-black text-[#14532d] shadow-md border-2 border-[#fde047]">P</div>
          <div className="leading-tight">
            <div className="font-heading font-black text-lg md:text-2xl tracking-tight text-white">
              {renderBrandName(copy.general.brandName)}
            </div>
            <div className="text-[10px] md:text-xs text-white/90 font-semibold">
              {copy.general.headerTagline}
            </div>
          </div>
        </div>
        {settings.whatsappNumber && (
          <a href={`https://wa.me/${formatWhatsAppNumber(settings.whatsappNumber)}?text=${encodeURIComponent(copy.general.whatsappMessage)}`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#22c55e] to-[#15803d] border-2 border-[#fde047] text-white text-xs md:text-sm font-black shadow-md hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300">
            <MessageCircle size={16} /><span>{copy.general.supportLabel}</span>
          </a>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section className="scroll-pin-section relative px-4 md:px-12 pt-0 pb-2 constellation-bg overflow-visible">
        <div className="poster-composite max-w-7xl mx-auto">
          <div className="poster-copy-panel">
            <div className="poster-copy-kicker">{copy.hero.question}</div>
            <h1 className="poster-copy-title">{renderHeroHeadline(copy.hero.headline)}</h1>
            <p className="poster-copy-lead">{copy.hero.subheadline}</p>
            <div className="poster-copy-meta">
              <span><Calendar size={18} /> {copy.hero.masterclassTag}</span>
            </div>
            {settings.paymentEnabled && (
              <div className="animate-entrance-hero mt-6 w-full max-w-lg mx-auto">
                {/* Price row */}
                <div className="mb-3 flex items-center justify-center gap-3">
                  <span className="text-white/70 font-bold text-sm line-through decoration-red-400">₹{pricing.originalPrice}</span>
                  <span className="bg-[#dc2626] text-white text-xs font-black px-2 py-0.5 rounded-full tracking-wide">{copy.hero.offerLabel}</span>
                  <span className="text-[#fde047] font-black text-3xl" style={{textShadow:'0 2px 8px rgba(0,0,0,0.5)'}}>₹{pricing.offerPrice}/-</span>
                </div>
                {/* CTA Button */}
                <button
                  onClick={handleBookNow}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-white text-base uppercase tracking-wide"
                  style={{
                    background: 'linear-gradient(180deg,#ff5252 0%,#ef4444 40%,#b91c1c 100%)',
                    border: '3px solid #fef08a',
                    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), 0 6px 0 #7f1d1d, 0 16px 28px -8px rgba(0,0,0,0.65)',
                    textShadow: '0 2px 0 rgba(0,0,0,0.35)',
                    animation: 'pulseCta 1.9s ease-in-out infinite'
                  }}
                >
                  {copy.hero.ctaText} <ArrowRight size={20} />
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
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Why sahi career disha ===== */}
      <section className="scroll-pin-section career-direction-section py-6 md:py-14 px-4 md:px-12">
        <div className="poster-composite poster-composite-reverse max-w-7xl mx-auto">
          <div className="poster-image-frame poster-image-frame-career">
            <div className="career-composite-stage">
              <img src={POSTER_IMAGES.careerThoughts} alt="" aria-hidden="true" className="career-thoughts-overlay" loading="lazy" />
              <img
                src={POSTER_IMAGES.careerChoice}
                alt="सही करियर दिशा"
                className="career-parent-image"
                loading="lazy"
              />
            </div>
          </div>
          <div className="poster-copy-panel">
            <div className="poster-copy-kicker">{copy.careerDirection.kicker}</div>
            <h2 className="poster-copy-title">{renderCareerHeadline(copy.careerDirection.headline)}</h2>
            <ul className="poster-card-list">
              {copy.careerDirection.questions.map((q, i) => (
                <li key={q}>
                  <span>{i + 1}</span>
                  <strong>{q}</strong>
                </li>
              ))}
            </ul>
            {settings.paymentEnabled && (
              <div className="animate-entrance mt-6 w-full max-w-lg mx-auto">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-white/70 font-bold text-sm line-through decoration-red-400">₹{pricing.originalPrice}</span>
                  <span className="bg-[#dc2626] text-white text-xs font-black px-2 py-0.5 rounded-full tracking-wide">{copy.careerDirection.priceLabel}</span>
                  <span className="text-[#fde047] font-black text-3xl" style={{textShadow:'0 2px 8px rgba(0,0,0,0.5)'}}>₹{pricing.offerPrice}/-</span>
                </div>
                <button
                  onClick={handleBookNow}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-white text-base uppercase tracking-wide"
                  style={{
                    background: 'linear-gradient(180deg,#ff5252 0%,#ef4444 40%,#b91c1c 100%)',
                    border: '3px solid #fef08a',
                    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), 0 6px 0 #7f1d1d, 0 16px 28px -8px rgba(0,0,0,0.65)',
                    textShadow: '0 2px 0 rgba(0,0,0,0.35)',
                    animation: 'pulseCta 1.9s ease-in-out infinite'
                  }}
                >
                  {copy.hero.ctaText} <ArrowRight size={20} />
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
            <h2 className="mistake-section-title">{copy.problems.title}</h2>
          </div>

          <div className="poster-grid poster-grid-three">
            {[POSTER_IMAGES.mistakeOne, POSTER_IMAGES.mistakeTwo, POSTER_IMAGES.mistakeThree].map((src, i) => (
              <article key={src} className="mini-poster-card">
                <div className="mini-poster-copy">
                  <div className="mini-poster-number">{i + 1}</div>
                  <div>
                    <h3>{displayMistakes[i]?.title || MISTAKE_REFERENCE[i].title}</h3>
                    <p>{displayMistakes[i]?.desc || MISTAKE_REFERENCE[i].desc}</p>
                  </div>
                </div>
                <div className="mini-poster-image-wrap">
                  <img src={src} alt={`गलती ${i + 1}`} className="mini-poster-image" loading="lazy" />
                </div>
              </article>
            ))}
          </div>

          <div className="conclusion-plaque mt-12">
            <p>{copy.problems.conclusion}</p>
          </div>
        </div>
      </section>

      {/* ===== Workshop Offerings ===== */}
      <section className="py-14 md:py-20 px-4 md:px-12 relative">
        <div className="absolute inset-0 constellation-bg opacity-70 pointer-events-none" />
        <div className="workshop-panel max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 gap-8 items-center">
 
            {/* <div className="lg:col-span-5 flex justify-center">
              <div className="workshop-image-wrap">
                <img src={POSTER_IMAGES.workshop} alt="क्या सीखेंगे" className="workshop-poster-img" />
              </div>
            </div> */}
      
            <div className="mx-auto w-full max-w-5xl">
              <div className="poster-copy-panel" style={{ textAlign: 'left', padding: 0 }}>
                <div className="poster-copy-kicker" style={{ justifyContent: 'flex-start' }}>{copy.workshop.kicker}</div>
                <h2 className="poster-copy-title" style={{ textAlign: 'left', marginLeft: 0 }}>{copy.workshop.title}</h2>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-5 mt-8">
                  {copy.workshop.items.map((item, i) => {
                    const Icon = getWorkshopIcon(item, i);
                    return (
                      <li
                        key={item.title}
                        className="animate-workshop-entrance flex min-h-[180px] flex-col justify-between rounded-3xl border border-[#fde047]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] p-5 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.8)] backdrop-blur-sm"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fde047]/15 text-[#fde047] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                          <Icon size={24} />
                        </span>
                        <div className="space-y-2">
                          <strong className="block text-lg font-black text-white">{item.title}</strong>
                          <p className="text-sm font-medium leading-6 text-white/80 sm:text-[0.95rem]">{item.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
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
            <ul className="reveal-grid">
              {copy.reveal.bullets.map((bullet, i) => {
                const Icon = REVEAL_ICONS[i % REVEAL_ICONS.length];
                return (
                <li key={i} className="reveal-bullet animate-reveal-entrance" style={{ animationDelay: `${i * 0.12}s` }}>
                  <span className="reveal-icon"><Icon size={22} /></span>
                  <span>{bullet}</span>
                </li>
              );})}
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

          <div className="mentor-card flex flex-col items-center text-center">
            <div className="mentor-ring-3d mb-6">
              <img
                src="/images/profile_logo.jpeg"
                alt={mentorName}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = '/images/profile_logo.jpeg'; }}
              />
            </div>

            <div className="mentor-name-plaque mb-6">
              <h3 className="font-heading font-black text-xl md:text-3xl text-white mb-1">{mentorName}</h3>
              <div className="text-sm md:text-xl font-black text-poster-yellow tracking-wide">{copy.mentor.brandLine}</div>
            </div>

            <ul className="w-full max-w-2xl flex flex-col gap-3">
              {copy.mentor.bullets.map((b, i) => (
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
                {copy.testimonial.titlePrefix} <span className="text-poster-yellow">{copy.testimonial.titleHighlight}</span>
              </h2>
            </div>
            <div className="overflow-x-auto pb-4" style={{scrollbarWidth:'none'}}>
              <div className="flex gap-5" style={{width: 'max-content', animation: filteredTestimonials.length > 2 ? 'testimonialScroll 18s linear infinite' : 'none'}}>
                {[...filteredTestimonials, ...filteredTestimonials].map((test, i) => (
                  <div key={i} className="testimonial-card">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="min-w-0">
                        <span className="font-black text-[#fde047] block text-base truncate">{test.name}</span>
                        {test.location && <span className="text-[#86efac] text-xs block mt-0.5 font-semibold">📍 {test.location}</span>}
                      </div>
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[...Array(test.rating || 5)].map((_, j) => <Star key={j} size={14} fill="#fde047" stroke="none" />)}
                      </div>
                    </div>
                    <p className="text-white/85 text-sm leading-relaxed italic relative z-10 break-words">"{test.message}"</p>
                  </div>
                ))}
              </div>
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
                {copy.faqSection.titlePrefix} <span className="text-poster-yellow">{copy.faqSection.titleHighlight}</span>
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
                        <span className="text-lg md:text-xl font-bold">{faq.question}</span>
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

      {/* ===== FINAL CTA — अंतिम आमंत्रण ===== */}
      {shouldShowCountdown && (
        <section className="py-14 md:py-20 px-4 md:px-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 constellation-bg pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">

            <div className="final-invite-grid">
              {/* LEFT — content */}
              <div className="final-invite-content">
                <div className="final-headline-row">
                  <Hourglass className="hourglass-3d text-[#fde047]" size={64} />
                  <h2 className="final-headline">
                    {copy.footerCta.headline} <span className="text-[#fde047]">!</span>
                  </h2>
                </div>

                <p className="final-sub">{copy.footerCta.title}</p>

                <div className="final-stamp">{copy.footerCta.subtitle}</div>

                <ul className="final-bullets">
                  {copy.footerCta.bullets.map((b, i) => {
                    const Icon = FINAL_BULLET_ICONS[i % FINAL_BULLET_ICONS.length];
                    return (
                    <li key={b}>
                      <span><Icon size={20} /></span>
                      <strong>{b}</strong>
                    </li>
                  );})}
                </ul>

                {/* Countdown */}
                <div className="countdown-3d">
                  <div className="countdown-label">{copy.footerCta.countdownLabel}</div>
                  <div className="countdown-row">
                    {[
                      { val: timeLeft.hours, label: 'HOURS' },
                      { val: timeLeft.minutes, label: 'MINUTES' },
                      { val: timeLeft.seconds, label: 'SECONDS' }
                    ].map((t, i, arr) => (
                      <React.Fragment key={t.label}>
                        <div className="flex flex-col items-center">
                          <div className="time-card-3d">{String(t.val).padStart(2, '0')}</div>
                          <span className="time-label text-sm md:text-base">{t.label}</span>
                        </div>
                        {i < arr.length - 1 && <span className="time-colon">:</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="price-ribbon-3d mt-6">
                  <span>{copy.footerCta.price}</span>
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
                  <span><ShieldCheck size={16} /> {copy.footerCta.trustBadges[0] || 'Secure Payment'}</span>
                  <span><XCircle size={16} className="text-red-600" /> {copy.footerCta.trustBadges[1] || 'No Fake Promises'}</span>
                  <span><Lock size={16} /> {copy.footerCta.trustBadges[2] || 'Privacy Protected'}</span>
                </div>
                <p className="text-white/85 text-xs md:text-sm font-bold mt-3">{copy.footerCta.secureText}</p>
                <p className="text-[#fde047]/90 text-xs font-semibold mt-3">
                  © {new Date().getFullYear()} {copy.footer.copyrightName}. All rights reserved.
                </p>
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
      <footer className="site-footer py-10 px-4 md:px-12 text-center">
        <div className="flex justify-center flex-wrap gap-x-8 gap-y-3 mb-5 max-w-4xl mx-auto">
          {copy.footer.links.map(({ label, href }) => (
            <a key={href} href={href} className="text-white text-xs md:text-sm font-bold hover:text-[#fde047] transition-colors">{label}</a>
          ))}
        </div>
      </footer>

      {/* Sticky mobile bottom bar */}
      <div className="mobile-sticky-bar md:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-3 py-2.5">
          {shouldShowCountdown && (
            <div className="mobile-timer-pill">
              <div className="mobile-timer-label">Time Left</div>
              <div className="mobile-timer-value">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span><span className="text-white">:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span><span className="text-white">:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          )}
          <button type="button" onClick={handleBookNow} className="mobile-book-button">
            Book Now
            <span className="mt-0.5 block text-[11px] font-bold opacity-85">₹{pricing.offerPrice}/- only</span>
          </button>
        </div>
      </div>

      {/* Floating WhatsApp */}
      {settings.whatsappNumber && (
        <a href={`https://wa.me/${formatWhatsAppNumber(settings.whatsappNumber)}?text=${encodeURIComponent(copy.general.whatsappMessage)}`}
          target="_blank" rel="noreferrer"
          className="wa-pulse fixed right-4 bottom-24 md:bottom-6 z-[125] w-14 h-14 rounded-full bg-gradient-to-br from-[#22c55e] to-[#15803d] border-2 border-[#fde047] flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-90 transition-transform duration-300"
          aria-label="Contact WhatsApp">
          <MessageCircle size={26} />
        </a>
      )}
    </div>
  );
}
