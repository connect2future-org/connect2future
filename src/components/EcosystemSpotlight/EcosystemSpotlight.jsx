import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../Button/Button';
import RevealOnScroll from '../RevealOnScroll/RevealOnScroll';
import { ventures } from '../../data/ventures';
import styles from './EcosystemSpotlight.module.css';

function getLogo(venture) {
  return venture.logo || '/c2flooooo.png';
}

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ServiceIcon = ({ label }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12L10 18L20 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function EcosystemSpotlight() {
  const [activeId, setActiveId] = useState(ventures[0].id);
  const active = ventures.find((v) => v.id === activeId) || ventures[0];

  return (
    <div className={styles.wrap}>
      <div className={styles.spotlightBox}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className={styles.spotlight}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.leftPanel}>
              <div className={styles.header}>
                {active.id === 'connect2air' ? (
                  <img src="/logos/connect2air-home.png" alt="Connect2Air" className={styles.fullSpotlightLogo} />
                ) : (
                  <>
                    {active.logo ? (
                      <img src={getLogo(active)} alt={active.name} className={styles.standaloneLogo} />
                    ) : (
                      <>
                        <img src="/c2flooooo.png" alt="" className={styles.wingLogo} />
                        <div className={styles.verticalLine} />
                      </>
                    )}
                    <h3 className={styles.name}>{active.name}</h3>
                  </>
                )}
              </div>

              <h2 className={styles.tagline}>{active.tagline}</h2>
              <p className={styles.description}>{active.description}</p>

              {active.stats && active.stats.length > 0 && (
                <div className={styles.statsRow}>
                  {active.stats.map((s) => (
                    <div className={styles.stat} key={s.label}>
                      <span className={styles.statValue}>{s.value}</span>
                      <span className={styles.statLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <Button
                href={active.website}
                variant="gold"
                size="sm"
              >
                Explore {active.name}
              </Button>
            </div>

            <div className={styles.divider} />

            <div
              className={`${styles.rightPanel} ${!active.services?.length ? styles.imageOnly : ''}`}
              style={{ backgroundImage: `url(${active.image})` }}
            >
              <div className={styles.rightOverlay} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {active.services && active.services.length > 0 && (
        <div className={styles.servicesStrip}>
          <div className={styles.servicesStripHeader}>
            <span className={styles.servicesHeading}>What We Offer</span>
            <span className={styles.servicesCompany}>
              {active.id === 'connect2air' ? (
                <img src="/logos/connect2air-home.png" alt="Connect2Air" className={styles.servicesCompanyLogo} />
              ) : (
                active.name
              )}
            </span>
          </div>

          <div className={styles.servicesStripList}>
            {active.services.map((service) => (
              <span className={styles.servicesStripItem} key={service}>
                <span className={styles.serviceIcon}>
                  <ServiceIcon label={service} />
                </span>
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.strip}>
        {ventures.filter(v => v.id !== 'zentrax').map((v, i) => (
          <RevealOnScroll key={v.id} delay={i * 0.05} className={styles.chipWrap}>
            <button
              className={`${styles.chip} ${v.id === activeId ? styles.chipActive : ''}`}
              onClick={() => setActiveId(v.id)}
            >
              <span className={styles.chipLeft}>
                {v.id === 'connect2air' ? (
                  <img src="/logos/connect2air-home.png" alt="Connect2Air" className={styles.chipFullLogo} />
                ) : (
                  <>
                    <span className={styles.chipMark}>
                      <img src={getLogo(v)} alt="" className={styles.chipMarkImg} />
                    </span>
                    <span className={styles.chipName}>{v.name}</span>
                  </>
                )}
              </span>
              <span className={styles.chipArrow}>
                <ArrowIcon />
              </span>
            </button>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
