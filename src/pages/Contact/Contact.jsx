import { useState } from 'react';
import Container from '../../components/Container/Container';
import Hero from '../../components/Hero/Hero';
import Button from '../../components/Button/Button';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import RevealOnScroll from '../../components/RevealOnScroll/RevealOnScroll';
import { images } from '../../utils/images';
import styles from './Contact.module.css';
import {
  FaUserTie,
  FaGraduationCap,
  FaMicrophoneAlt,
  FaChartLine,
  FaHardHat,
  FaSoap
} from "react-icons/fa";
import { TbDrone } from "react-icons/tb";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import axios from "axios";
const API = `${import.meta.env.VITE_API_URL}/api/contact/submit`;




const infoItems = [
  {
    title: "Our Office",
    lines: [
      "970, Nirmithi Kendra Rd,",
      "Vijayanagar, Bogadi 2nd Stage North,",
      "Mysuru, Karnataka 570006"
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 18s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="10" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },

  {
    title: "Call Us",
    lines: [
      "+91 70194 36720",
      "Monday – Saturday",
      "10:00 AM – 6:00 PM"
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 3h3l1.5 4-2 1.5a10 10 0 004.5 4.5L12.5 11l4 1.5V16a1.5 1.5 0 01-1.6 1.5A14 14 0 014 4.6 1.5 1.5 0 015.5 3H4z" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },

  {
    title: "Email Us",
    lines: [
      "hr@connect2future.com",
      "karthikgowdaja@connect2future.com",
      "support@connect2future.com"
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M3 5.5L10 11l7-5.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },

  {
    title: "Visit Us",
    lines: [
      "Monday – Saturday",
      "10:00 AM – 6:00 PM"
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M10 5.5V10l3 2" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
];

const reachOptions = [
  {
    title: "Recruitment & Hiring",
    icon: <FaUserTie size={24} />,
  },

  {
    title: "Training & Learning",
    icon: <FaGraduationCap size={24} />,
  },

  {
    title: "Studio & Event Spaces",
    icon: <FaMicrophoneAlt size={24} />,
  },

  {
    title: "Business Consultation",
    icon: <FaChartLine size={24} />,
  },

  {
    title: "Drone & Aerial Activations",
    icon: <TbDrone size={24} />,
  },

  {
    title: "Construction & Real Estate",
    icon: <FaHardHat size={24} />,
  },

  {
    title: "Premium Laundry Services",
    icon: <FaSoap size={24} />,
  },
];
const subServices = {

  connect2edtech: [

    "Technical Training",
    "Non Technical Training",
    "Career Mentorship",
    "Certifications"

  ],

  connect2job: [

    "White Collar Recruitment",
    "Internships",
    "Payroll Hiring",
    "IT Sector Jobs",
    "Staffing / Recruitment Services",
    "Non Technical Sector Jobs"

  ],

  connect2creovox: [

    "Auto Branding",
    "Bus Branding",
    "Automobile Branding",
    "Static Websites",
    "Dynamic Websites",
    "E-Commerce",
    "Digital Marketing",
    "ERP Solutions",
    "CRM Solutions",
    "Mobile Apps",
    "PVR Ads",
    "Radio Ads",
    "News Channel Ads",
    "Water Bottle Ads",
    "Sunboard Branding",
    "Newspaper Ads",
    "Delivery Boy Marketing",
    "Flex Branding",
    "Billboard Branding",
    "Web Application Development",
    "Custom Software Development",
    "SEO",
    "Meta Management",
    "Google Business Management",
    "Google Ads",
    "Social Media Management"

  ],

  connect2space: [

    "Premium Workspace",
    "Creator Corner",
    "Podcast Studio",
    "Meeting Space",
    "Event Space",
    "Content Studio"

  ],

  connect2air: [

    "Drone Light Shows",
    "Aerial Advertising & Branding",
    "Drone Mapping & Surveying",
    "Aerial Cinematography",
    "Agricultural Drone Services"

  ],

  mrwashwala: [

    "Premium Laundry Services"

  ],

  zentrax: [

    "Construction & Man Power"

  ]

};
export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  const [service, setService] = useState("");

  const [subService, setSubService] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const [countryName, setCountryName] = useState("India");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        API,
        {
          fullName,
          email,
          countryName,
          countryCode,
          phone,
          service,
          subService,
          message,
        }
      );

      console.log(response.data);

      setSubmitted(true);

      // Clear form
      setFullName("");
      setEmail("");
      setPhone("");
      setCountryCode("+91");
      setCountryName("India");
      setService("");
      setSubService("");
      setMessage("");

      alert("Message sent successfully!");
    } catch (error) {
      console.error(error);

      alert("Failed to send message.");
    }
  };

  return (
    <>
      <Hero
        className={styles.contactHero}
        breadcrumb="Contact"
        title="Let's Build the Future. Together."
        subtitle="We are always open to new ideas, partnerships, and opportunities. Get in touch with us."
        image={images.contactOffice}
      >
          <RevealOnScroll className={styles.heroReachContent}>

            <span className={styles.heroReachEyebrow}>
              WE'D LOVE TO CONNECT
            </span>

            <div className={styles.heroReachGrid}>

              {reachOptions.map((item, i) => (

                <div key={item.title} className={styles.heroReachItem}>

                  <div className={styles.heroReachIcon}>
                    {item.icon}
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.text}</p>

                </div>

              ))}

            </div>

          </RevealOnScroll>
      </Hero>
      {/* ===== CONTACT STRIP HEADING ===== */}
      <section className={styles.contactStripHeading}>
        <Container>
          <RevealOnScroll>
            <span className={styles.contactEyebrow}>
              CONTACT US THROUGH
            </span>

            {/* <h2 className={styles.contactHeading}>
              Contact Us Through
            </h2> */}

          </RevealOnScroll>
        </Container>
      </section>
      {/* ===== INFO STRIP ===== */}
      <section
        className="section-tight"
        style={{
          background: "#fff3f8",
          paddingTop: "2px",
          paddingBottom: "30px"
        }}
      >
        <Container wide>
          <div className={styles.infoStrip}>
            {infoItems.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 0.08} className={styles.infoItem}>
                <div className={styles.infoIcon}>{item.icon}</div>
                <div className={styles.infoTitle}>{item.title}</div>
                <div>
                  {item.lines.map((line) => (
                    <p key={line} className={styles.infoText}>{line}</p>
                  ))}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== FORM + MAP ===== */}
      <section id="contact-form" className="section bg-surface" style={{ paddingTop: "45px", paddingBottom: "80px", scrollMarginTop: "96px" }}>
        <Container wide>
          <div className={styles.formMapGrid}>
            <RevealOnScroll>
              <span className="eyebrow" style={{ color: "#ff1ea8" }}>Send Us a Message</span>
              <h2 className="h-2" style={{ marginTop: '16px' }}>We'd Love to Hear From You</h2>
              <p className="text-body" style={{ marginTop: '12px' }}>
                Whether you have a question, want to explore a partnership, or just want
                to say hello, our team is here to help.
              </p>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <input
                    className={styles.field}
                    type="text"
                    placeholder="Full Name *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <input
                    className={styles.field}
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <PhoneInput
                  country={"in"}
                  value={`${countryCode.replace("+", "")}${phone}`}
                  onChange={(value, country) => {
                    const dialCode = country.dialCode;
                    setCountryCode("+" + dialCode);
                    setCountryName(country.name);
                    const localNumber = value.slice(dialCode.length);
                    setPhone(localNumber);
                  }}
                  enableSearch
                  countryCodeEditable={false}
                  inputProps={{
                    required: true,
                    name: "phone"
                  }}
                  containerClass={styles.phoneContainer}
                  inputClass={styles.phoneInput}
                  buttonClass={styles.phoneButton}
                />
                <select
                  className={styles.field}
                  value={service}
                  onChange={(e) => {

                    setService(e.target.value);
                    setSubService("");

                  }}
                >

                  <option value="">Select Service *</option>

                  <option value="connect2edtech">
                    Connect2EdTech
                  </option>

                  <option value="connect2job">
                    Connect2Job
                  </option>

                  <option value="connect2creovox">
                    Connect2Creovox
                  </option>

                  <option value="connect2space">
                    Connect2Space
                  </option>

                  <option value="connect2air">
                    Connect2Air - Drone & Aerial Activations
                  </option>

                  <option value="mrwashwala">
                    Mr.WashWala - Premium Laundry Services
                  </option>

                  <option value="zentrax">
                    ZenTrax - Construction & Man Power
                  </option>

                </select>
                <select
                  className={styles.field}
                  value={subService}
                  onChange={(e) => setSubService(e.target.value)}
                  required
                >

                  <option value="">Select Sub Service *</option>

                  {

                    subServices[service]?.map(item => (

                      <option
                        key={item}
                        value={item}
                      >

                        {item}

                      </option>

                    ))

                  }

                </select>
                <textarea
                  className={styles.textarea}
                  placeholder="Your Message (Optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <div className={styles.formFooter}>
                  <Button type="submit" variant="primary">
                    {submitted ? 'Message Sent' : 'Send Message'}
                  </Button>
                  <div className={styles.secureNote}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="7" width="10" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    Your information is secure and will never be shared.
                  </div>
                </div>
              </form>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <span className="eyebrow" style={{ color: "#ff1ea8" }}>Find Us Here</span>
              <div className={styles.mapWrap}>
                <iframe
                  title="Connect2Future office location"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.0901449305525!2d76.60861799999999!3d12.309716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7b0050ce1873%3A0xe6c2f3909d626076!2sConnect2future!5e0!3m2!1sen!2sin!4v1785918775942!5m2!1sen!2sin"
                />
              </div>

              <div className={styles.impactCard}>
                <div className={styles.impactIcon}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M18 2L2 9l6 2 2 6 8-15z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles.impactTitle}>Let's Create Impact Together</h3>
                  <p className={styles.impactText}>
                    We collaborate with visionary organizations and individuals to build
                    innovative solutions that create real-world impact.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

    </>
  );
}
