import Container from '../../components/Container/Container';
import Hero from '../../components/Hero/Hero';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import StatBlock from '../../components/StatBlock/StatBlock';
import VentureCard from '../../components/VentureCard/VentureCard';
import Button from '../../components/Button/Button';
import RevealOnScroll from '../../components/RevealOnScroll/RevealOnScroll';
import { images } from '../../utils/images';
import { ventures } from '../../data/ventures';
import styles from './Ecosystem.module.css';

const ecosystemStats = [
  { value: '7', label: 'Companies' },
  { value: '300+', label: 'Team Members' },
  { value: '500K+', label: 'Customers Reached' },
];

export default function Ecosystem() {
  return (
    <>
      <Hero
        className={styles.hero}
        breadcrumb="Our Ecosystem"
        title="Our Ecosystem"
        subtitle="Seven ventures. One vision. Together, we are creating opportunities, driving innovation, and building a future that matters."
        image="/oureco.png"
        contentPaddingTop="120px"
      >
        <div className={styles.heroStatsWrap}>
          <RevealOnScroll>
            <span className="eyebrow">Our Impact</span>
            <h2 className="h-2 text-white" style={{ marginTop: '16px' }}>
              Powering Seven Industries.
            </h2>
          </RevealOnScroll>
          <StatBlock stats={ecosystemStats} cols={3} />
        </div>
      </Hero>

      <section className="section bg-background">
        <Container wide>
          <div className={styles.venturesHeadingWrapper}>

            <img
              src="/male2.png"
              alt=""
              className={`${styles.venturesMascot} ${styles.venturesMascotLeft}`}
            />

            <div className={styles.venturesHeading}>
              <SectionTitle
                center
                eyebrow="Our Ventures"
                title="A Diverse Ecosystem. Unified Purpose."
                subtitle="Each company in our ecosystem is solving real-world problems and creating lasting impact."
              />
            </div>

            <img 
              src="/female11.png"
              alt=""
              className={`${styles.venturesMascot} ${styles.venturesMascotRight}`}
            />

          </div>

          <div className={styles.list}>
            {ventures.map((v, i) => (
              <VentureCard key={v.id} venture={v} reverse={i % 2 === 1} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section-tight bg-primary">
        <Container wide>
          <div className={styles.ctaBar}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="8" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="16" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M3 19c0-2.8 2.2-5 5-5s5 2.2 5 5M11 19c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </div>
              <RevealOnScroll>
                <h3 className={styles.ctaTitle}>Stronger Together. Building the Future.</h3>
                <p className={styles.ctaText}>Our ecosystem thrives on collaboration, innovation and shared purpose.</p>
              </RevealOnScroll>
            </div>
            <Button to="/contact" variant="gold">Partner With Us</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
