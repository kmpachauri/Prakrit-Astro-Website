import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const content = {
  terms: {
    title: 'Terms & Conditions',
    lastUpdated: 'June 2026',
    sections: [
      {
        heading: '1. About Us',
        body: 'Prakrit Astro is operated by Ramendra Sharma.\n\nBusiness Owner: Ramendra Sharma\nEmail: theoccultschool1356@gmail.com\nPhone: +91 9660715539\nAddress: R.S. Sharma, Pent House 01, Yash Residence, Ward No. 78, Bali Vihar, Mansarovar, Sanganer, Jaipur, Rajasthan - 302029'
      },
      {
        heading: '2. Services & Disclaimer',
        body: 'Prakrit Astro provides educational and informational astrology-related webinars and guidance sessions.\n\nThe information provided during webinars is intended for educational and informational purposes only and should not be considered legal, medical, financial, or professional advice.\n\nAstrology and occult sciences are matters of personal belief. Prakrit Astro does not guarantee any specific outcomes, accuracy of predictions, or life changes based on the information provided.'
      },
      {
        heading: '3. Webinar Access',
        body: 'Upon successful payment, users will receive access details for the webinar.\n\nAccess is intended only for the registered participant and may not be shared, distributed, recorded, reproduced, or resold.\n\nPrakrit Astro reserves the right to refuse service, suspend access, or remove participants from a webinar if any fraudulent activity, abuse, harassment, or violation of these terms is detected.'
      },
      {
        heading: '4. No Recorded Sessions',
        body: 'Prakrit Astro conducts live webinars only.\n\nRecorded videos, recordings, replay access, downloadable content, or recorded sessions are not guaranteed and are generally not provided unless specifically stated.'
      },
      {
        heading: '5. User Responsibilities',
        body: 'Users must provide accurate registration details and maintain respectful conduct during webinars and interactions.\n\nAny misuse, abuse, disruption, or unauthorized sharing of webinar content may result in removal without refund.'
      },
      {
        heading: '6. Intellectual Property',
        body: 'All webinar content, presentations, graphics, materials, and website content remain the intellectual property of Prakrit Astro.\n\nUnauthorized copying, recording, redistribution, resale, or reproduction is prohibited.'
      },
      {
        heading: '7. Limitation of Liability',
        body: 'Prakrit Astro shall not be liable for any direct, indirect, incidental, or consequential losses arising from the use of our services, webinars, or information provided.'
      },
      {
        heading: '8. Governing Law & Jurisdiction',
        body: 'These Terms & Conditions shall be governed by the laws of India.\n\nAny disputes arising out of or in connection with our services shall be subject to the exclusive jurisdiction of the courts located in Jaipur, Rajasthan.'
      },
      {
        heading: '9. Changes',
        body: 'Prakrit Astro reserves the right to update these Terms & Conditions at any time without prior notice.\n\nContinued use of the website constitutes acceptance of the updated terms.'
      }
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'June 2026',
    sections: [
      {
        heading: 'Information We Collect',
        list: ['Name', 'Mobile Number', 'Email Address', 'Payment Information', 'Registration Details', 'Communication Records']
      },
      {
        heading: 'How We Use Information',
        list: ['Webinar registration', 'Customer support', 'Payment verification', 'Webinar updates', 'Service communication', 'Legal compliance']
      },
      {
        heading: 'Payment Security',
        body: 'Payments are processed through secure third-party payment providers.\n\nPrakrit Astro does not store complete card or banking information.'
      },
      {
        heading: 'Communication',
        body: 'By registering, you agree to receive webinar-related updates and marketing communications through:',
        list: ['Email', 'WhatsApp', 'Phone Communication']
      },
      {
        heading: 'Data Protection & Age Limit',
        body: 'We implement reasonable security measures to protect user information from unauthorized access.\n\nOur services are intended for individuals who are 18 years of age or older. We do not knowingly collect personal information from minors.'
      },
      {
        heading: 'Information Sharing',
        body: 'We do not sell, rent, or trade personal information to third parties except where required by law or for payment processing and service delivery.\n\nWe may share limited information with trusted third-party service providers such as payment gateways, email service providers, webinar hosting platforms, and communication platforms solely for the purpose of delivering our services.'
      },
      {
        heading: 'Cookies',
        body: 'Our website may use cookies and similar technologies to improve user experience and website functionality.'
      },
      {
        heading: 'Contact',
        body: 'For privacy-related concerns:\nEmail: theoccultschool1356@gmail.com\nPhone: +91 9660715539'
      }
    ]
  },
  refund: {
    title: 'Refund & Cancellation Policy',
    lastUpdated: 'June 2026',
    sections: [
      {
        heading: 'No Refund Policy',
        body: 'All webinar registrations and digital purchases are final.\n\nNo refunds shall be provided after successful registration and payment.\n\nBy completing the payment and registration process, the participant acknowledges and agrees to this Refund & Cancellation Policy.'
      },
      {
        heading: 'Missed Webinar',
        body: 'Refunds will not be provided if:',
        list: [
          'The participant misses the webinar.',
          'The participant is unable to attend.',
          'Internet or device issues occur on the participant\'s side.',
          'The participant joins late or leaves early.'
        ]
      },
      {
        heading: 'Payment Deducted but Registration Failed',
        body: 'If payment is deducted but registration is not successfully recorded, participants may contact support at theoccultschool1356@gmail.com with proof of payment for verification and resolution.'
      },
      {
        heading: 'Webinar Rescheduling',
        body: 'Prakrit Astro reserves the right to reschedule a webinar due to operational, technical, or unforeseen circumstances.\n\nIn such cases, participants will be informed through WhatsApp and/or Email. The registration will remain valid for the rescheduled session.'
      },
      {
        heading: 'Webinar Cancellation',
        body: 'If a webinar is permanently cancelled by Prakrit Astro and no alternate date is provided, eligible participants will receive a full refund.'
      },
      {
        heading: 'Refund Processing',
        body: 'Where refunds are approved (only in case of permanent cancellation), processing may take 7 to 14 business days depending on the payment provider and banking channels.'
      },
      {
        heading: 'Contact',
        body: 'Email: theoccultschool1356@gmail.com\nPhone: +91 9660715539'
      }
    ]
  },
  contact: {
    title: 'Contact Support',
    lastUpdated: null,
    sections: [
      {
        heading: 'Get in Touch',
        body: 'Prakrit Astro support ke liye niche diye gaye channels se contact karein.\n\nPayment, group link ya session instructions se related query mein apna registered mobile number aur Order ID zaroor mention karein.'
      },
      {
        heading: 'WhatsApp Support',
        body: 'WhatsApp par message karein:\n+91 9660715539',
        whatsapp: '+919660715539'
      },
      {
        heading: 'Email Support',
        body: 'Email karein:\ntheoccultschool1356@gmail.com',
        email: 'theoccultschool1356@gmail.com'
      },
      {
        heading: 'Business Address',
        body: 'R.S. Sharma, Pent House 01, Yash Residence, Ward No. 78, Bali Vihar, Mansarovar, Sanganer, Jaipur, Rajasthan - 302029'
      }
    ]
  }
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const defaultSupport = {
  whatsappNumber: '+91 9660715539',
  supportEmail: 'theoccultschool1356@gmail.com',
  businessAddress: 'R.S. Sharma, Pent House 01, Yash Residence, Ward No. 78, Bali Vihar, Mansarovar, Sanganer, Jaipur, Rajasthan - 302029'
};

export default function StaticPage({ type = 'privacy' }) {
  const [support, setSupport] = useState(defaultSupport);
  const page = useMemo(() => {
    const base = content[type] || content.privacy;
    const email = support.supportEmail || defaultSupport.supportEmail;
    const phone = support.whatsappNumber || defaultSupport.whatsappNumber;
    const address = support.businessAddress || defaultSupport.businessAddress;
    const hydrate = (text = '') => text
      .replaceAll('theoccultschool1356@gmail.com', email)
      .replaceAll('+91 9660715539', phone)
      .replaceAll('+919660715539', phone)
      .replaceAll(defaultSupport.businessAddress, address);

    return {
      ...base,
      sections: base.sections.map((section) => ({
        ...section,
        body: section.body ? hydrate(section.body) : section.body,
        whatsapp: section.whatsapp ? phone : section.whatsapp,
        email: section.email ? email : section.email
      }))
    };
  }, [type, support]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/active-landing-page`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.settings) {
          setSupport({
            whatsappNumber: data.settings.whatsappNumber || defaultSupport.whatsappNumber,
            supportEmail: data.settings.supportEmail || defaultSupport.supportEmail,
            businessAddress: data.settings.businessAddress || defaultSupport.businessAddress
          });
        }
      })
      .catch(() => {});
  }, []);
  return (
    <main className="app-green-page min-h-screen px-5 py-10 md:py-16 text-[#f4f9f4]">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#fde047]/60 bg-[#052e16]/80 text-[#fde047] font-black text-sm hover:bg-[#fde047] hover:text-[#14532d] transition-all duration-200">
          <ArrowLeft size={15} /> Back to Home
        </Link>
        <div className="app-green-panel rounded-3xl p-7 md:p-10">
          <h1 className="font-heading text-3xl md:text-4xl font-black text-white mb-2">{page.title}</h1>
          {page.lastUpdated && (
            <p className="text-[#84a190] text-sm mb-8">Last Updated: {page.lastUpdated}</p>
          )}
          <div className="space-y-8">
            {page.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-[#ecc472] font-bold text-lg mb-3">{section.heading}</h2>
                {section.body && (
                  <div className="text-[#cdded2] text-sm leading-relaxed whitespace-pre-line mb-3">{section.body}</div>
                )}
                {section.list && (
                  <ul className="list-disc list-inside space-y-1.5 text-[#cdded2] text-sm">
                    {section.list.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                )}
                {section.whatsapp && (
                  <a
                    href={`https://wa.me/${section.whatsapp.replace('+', '').replace(/\s/g, '')}?text=${encodeURIComponent('Hello Prakrit Astro, I need support.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl bg-[#25d366] text-white font-bold text-sm hover:brightness-110 transition"
                  >
                    Chat on WhatsApp
                  </a>
                )}
                {section.email && (
                  <a
                    href={`mailto:${section.email}`}
                    className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl border border-[#ecc472] text-[#ecc472] font-bold text-sm hover:bg-[#ecc472]/10 transition"
                  >
                    Send Email
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
