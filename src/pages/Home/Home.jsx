import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Container from '../../components/Container/Container';
import Button from '../../components/Button/Button';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import RevealOnScroll from '../../components/RevealOnScroll/RevealOnScroll';
import StatBlock from '../../components/StatBlock/StatBlock';
import InsightCard from '../../components/InsightCard/InsightCard';
import EcosystemCards from '../../components/EcosystemCards/EcosystemCards'; // <-- new import
import { images } from '../../utils/images';
// import { ventures } from '../../data/ventures';
import EcosystemSpotlight from '../../components/EcosystemSpotlight/EcosystemSpotlight';
import { getInsights } from '../../services/insightService';
import styles from './Home.module.css';

function HomeInsightsPreview() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await getInsights({ page: 1, limit: 3 });

        if (res.success && res.data) {
          setInsights(res.data);
        } else {
          setInsights([]);
        }
      } catch (err) {
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  const displayItems = loading ? [] : insights;

  return (
    <section className="section bg-background">
      <Container wide>
        <div className={styles.insightsHeader}>
          <RevealOnScroll>
            <span className={`eyebrow ${styles.sectionHighlight}`}>Latest Insights</span>
            <h2 className="h-2" style={{ marginTop: '16px' }}>Ideas. Innovation. Impact.</h2>
          </RevealOnScroll>
          <Button to="/insights" variant="ghost">View All Insights</Button>
        </div>
        <div className={styles.insightsGrid}>
          {displayItems.map((item, i) => (
            <InsightCard key={item._id || item.title || i} item={item} delay={i * 0.1} />
          ))}
        </div>
      </Container>
    </section>
  );
}



const impactStats = [
  { value: '7', label: 'Ventures' },
  { value: '100+', label: 'Professionals' },
  { value: '500+', label: 'Lives Impacted' },
];

const contactInfoItems = [
  {
    title: 'Our Office',
    lines: ['970, Nirmithi Kendra Rd,', 'Vijayanagar, Bogadi 2nd Stage North,', 'Mysuru, Karnataka 570006'],
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 18s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" stroke="currentColor" strokeWidth="1.4" /><circle cx="10" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4" /></svg>,
  },
  {
    title: 'Call Us',
    lines: ['+91 70194 36720', 'Monday – Saturday', '10:00 AM – 6:00 PM'],
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 3h3l1.5 4-2 1.5a10 10 0 004.5 4.5L12.5 11l4 1.5V16a1.5 1.5 0 01-1.6 1.5A14 14 0 014 4.6 1.5 1.5 0 015.5 3H4z" stroke="currentColor" strokeWidth="1.3" /></svg>,
  },
  {
    title: 'Email Us',
    lines: ['hr@connect2future.com', 'karthikgowdaja@connect2future.com', 'support@connect2future.com'],
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M3 5.5L10 11l7-5.5" stroke="currentColor" strokeWidth="1.3" /></svg>,
  },
  {
    title: 'Visit Us',
    lines: ['Monday – Saturday', '10:00 AM – 6:00 PM'],
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3" /><path d="M10 5.5V10l3 2" stroke="currentColor" strokeWidth="1.3" /></svg>,
  },
];

const heroImages = [
  images.heroHome1,
  images.heroHome2,
  images.heroHome3,
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveSlide((s) => (s + 1) % heroImages.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        {heroImages.map((imgSrc, index) => (
          <img
            key={imgSrc}
            src={imgSrc}
            alt="Connect2Future"
            className={styles.heroImage}
            style={{
              opacity: index === activeSlide ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              pointerEvents: 'none',
            }}
          />
        ))}
        <div className={styles.heroOverlay} />

        <Container wide className={styles.heroContent}>
          <div className={styles.heroInner}>
            {/* <div className={styles.heroDots}>
              {['01', '02', '03'].map((n, i) => (
                <span key={n} className={`${styles.heroDot} ${i === activeSlide ? styles.heroDotActive : ''}`}>
                  {n}
                </span>
              ))}
            </div> */}

            <div>
              <motion.h1
                className={`h-display ${styles.heroTitle}`}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                Building the Future, Creating Possibilities.
              </motion.h1>
              {/* <motion.p
                className={`text-body-lg ${styles.heroSubtitle}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                Connect2Future is a diversified ecosystem of companies empowering people,
                businesses and communities through innovation.
              </motion.p> */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button to="/our-ecosystem" variant="gold">Explore Our Ecosystem</Button>
              </motion.div>

              {/* Ecosystem cards – directly below the button, still inside hero */}
              <EcosystemCards />
            </div>
          </div>
        </Container>

        {/* <div className={styles.scrollDown}>
          <span>Scroll Down</span>
          <span className={styles.scrollLine} />
        </div> */}
      </section>

      {/* ============ OUR FOUNDERS ============ */}
      <section id="founders" className={`${styles.foundersSection} bg-background`}>
        <Container wide>

          <RevealOnScroll className={styles.founderHeader}>
            <span className={`eyebrow ${styles.sectionHighlight}`}>OUR FOUNDERS</span>

            <h2 className="h-2" style={{ marginTop: "18px" }}>
              A Vision for a Better Tomorrow
            </h2>
          </RevealOnScroll>

          <div className={styles.founderGrid}>

            <RevealOnScroll className={styles.founderCard}>
              
              <img
                src="/founder.png"
                alt="Founder"
                className={styles.founderImage}
              />

              <div className={styles.quoteCard}>
                <p className={styles.quoteText}>
                  We don't just build companies, we build opportunities.
                </p>
                <span className={styles.founderName}>- VIKAS GOWDA J A</span>

              </div>

            </RevealOnScroll>

            <RevealOnScroll
              delay={0.15}
              className={styles.founderCard}
            >

              <img
                src="/MD.png"
                alt="Co-founder"
                className={styles.founderImage}
              />
             

              <div className={styles.quoteCard}>
                <p className={styles.quoteText}>
                  Innovation begins with people and grows through vision.
                </p>
                <span className={styles.founderName}>- KARTHIK GOWDA J A</span>

              </div>

            </RevealOnScroll>

          </div>

        </Container>
        <div className={styles.founderClosing}>
          <p aria-hidden="true" style={{ display: "none" }}>
            "𝘌𝘮𝘱𝘰𝘸𝘦𝘳𝘪𝘯𝘨 𝘱𝘦𝘰𝘱𝘭𝘦. 𝘐𝘯𝘴𝘱𝘪𝘳𝘪𝘯𝘨 𝘪𝘯𝘯𝘰𝘷𝘢𝘵𝘪𝘰𝘯. 𝘉𝘶𝘪𝘭𝘥𝘪𝘯𝘨 𝘣𝘶𝘴𝘪𝘯𝘦𝘴𝘴𝘦𝘴 𝘵𝘩𝘢𝘵 𝘤𝘳𝘦𝘢𝘵𝘦 𝘭𝘢𝘴𝘵𝘪𝘯𝘨 𝘪𝘮𝘱𝘢𝘤𝘵."
          </p>
          <p>
            &ldquo;Empowering people. Inspiring innovation. Building businesses that create lasting impact.&rdquo;
          </p>
        </div>
      </section>
      {/* ============ IMPACT ============ */}
      <section style={{ paddingTop: "40px", paddingBottom: "40px", background: "#0b0b0b" }}>
        <Container wide>
          <div className={styles.impact}>
            <RevealOnScroll>
              <span className="eyebrow" style={{ color: "#ff1ea8" }}>Our Impact</span>
              <h2 className="text-white" style={{ fontSize: "3rem", lineHeight: "1.1", fontWeight: 600 }}>
                Creating Value That Matters.
              </h2>
            </RevealOnScroll>
            <StatBlock stats={impactStats} cols={3} />
          </div>
        </Container>
      </section>

      {/* ============ ECOSYSTEM PREVIEW ============ */}
      {/* <section className="section bg-surface">
        <Container wide>
          <div className={styles.ecosystemHeader}>
            <SectionTitle
              center
              eyebrow="Our Ecosystem"
              title="Six Ventures. One Vision."
            />
          </div>
          <div className={styles.ventureGrid}>
            {ventures.map((v, i) => (
              <RevealOnScroll
                key={v.id}
                delay={i * 0.06}
                as="div"
                className={`${styles.ventureCard} ${v.name === "Mr.WashWala"
                  ? styles.washCard
                  : v.name === "ZenTrax"
                    ? styles.zenCard
                    : ""
                  }`}
              >
                <div className={styles.ventureTop}>

                  <div className={styles.ventureMark}>
                    <img
                      src={
                        v.name === "Mr.WashWala"
                          ? "/washwalaMAN.png"
                          : v.name === "ZenTrax"
                            ? "/ZENTRAXBUILDING.png"
                            : "/c2flooooo.png"
                      }
                      alt={v.name}
                      className={
                        v.name === "Mr.WashWala"
                          ? styles.washLogo
                          : v.name === "ZenTrax"
                            ? styles.zenLogo
                            : styles.ventureLogo
                      }
                    />
                  </div>

                  <div className={styles.ventureInfo}>
                    <h3 className={styles.ventureName}>{v.name}</h3>

                    <p
                      className={`${styles.ventureTagline} ${v.name === "Mr.WashWala"
                          ? styles.washTagline
                          : v.name === "ZenTrax"
                            ? styles.zenTagline
                            : styles.pinkTagline
                        }`}
                    >
                      {v.tagline}
                    </p>
                  </div>

                </div>

                <span className={styles.ventureExplore}>
                  Explore
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </RevealOnScroll>
            ))}
          </div>
          <div className={styles.viewAllWrap}>
            <Button to="/our-ecosystem" variant="gold">View All Ventures</Button>
          </div>
        </Container>
      </section> */}

      {/* ============ ECOSYSTEM PREVIEW ============ */}
      <section className="section bg-surface">
        <Container wide>
          <div className={styles.ecosystemHeader}>
            <SectionTitle
              center
              eyebrow="Our Ecosystem"
              title="Seven Ventures. One Vision."
            />
          </div>
          <EcosystemSpotlight />
          <div className={styles.viewAllWrap}>
            <Button to="/our-ecosystem" variant="gold">View All Ventures</Button>
          </div>
        </Container>
      </section>

      {/* ============ INSIGHTS PREVIEW ============ */}
      <HomeInsightsPreview />

      {/* ============ CONTACT INFORMATION ============ */}
      <section className={styles.homeContactSection}>
        <Container wide>
          <RevealOnScroll className={styles.homeContactHeader}>
            <span className={styles.sectionHighlight}>CONTACT US THROUGH</span>
          </RevealOnScroll>
          <div className={styles.homeInfoStrip}>
            {contactInfoItems.map((item, index) => (
              <RevealOnScroll key={item.title} delay={index * 0.08} className={styles.homeInfoItem}>
                <div className={styles.homeInfoIcon}>{item.icon}</div>
                <div className={styles.homeInfoTitle}>{item.title}</div>
                <div>
                  {item.lines.map((line) => <p key={line} className={styles.homeInfoText}>{line}</p>)}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>



    </>
  );
}
