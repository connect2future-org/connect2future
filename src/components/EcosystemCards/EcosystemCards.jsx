import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ecosystemCompanies } from '../../data/ecosystemCompanies';
import styles from './EcosystemCards.module.css';

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.75 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function isExternal(url = '') {
  return /^https?:\/\//i.test(url);
}

// Map variant names to CSS module classes (defined in EcosystemCards.module.css)
const variantClass = {
  pink: 'accentPink',
  blue: 'accentBlue',
  gold: 'accentGold',
};

export default function EcosystemCards({ items = ecosystemCompanies, className = '' }) {
  return (
    <motion.div
      className={`${styles.grid} ${className}`}
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((company) => {
        const external = isExternal(company.link);

        const cardBody = (
          <>
            <div className={styles.top}>
              {company.hideName ? (
                <div className={styles.lockup}>
                  <img src={company.logo} alt={company.name} className={styles.fullLogoOnly} />
                </div>
              ) : company.connectBrand ? (
                <div className={styles.lockup}>
                  <img src={company.logo} alt="" className={styles.wingLogo} />
                  <div className={styles.verticalLine} />
                  <div className={styles.brandText}>
                    <h3 className={styles.name}>{company.name}</h3>
                    <p className={styles.tagline}>{company.tagline}</p>
                  </div>
                </div>
              ) : (
                <div className={styles.lockup}>
                  <img src={company.logo} alt={company.name} className={styles.standaloneLogo} />
                  <div className={styles.brandText}>
                    <h3 className={styles.name}>{company.name}</h3>
                    <p className={styles.tagline}>{company.tagline}</p>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.description}>
              {company.description
                .split('•')
                .filter(Boolean)
                .map((item) => (
                  <span key={item} className={styles.descriptionItem}>
                    • {item.trim()}
                  </span>
                ))}
            </div>

            <span className={styles.arrow}>
              <ArrowIcon />
            </span>
          </>
        );

        // Build the card class with optional variant accent class
        const cardClass = `${styles.card} ${styles[variantClass[company.variant]] || ''}`;

        if (external) {
          return (
            <motion.div key={company.id} variants={cardVariants}>
              <a
                href={company.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {cardBody}
              </a>
            </motion.div>
          );
        }

        return (
          <motion.div key={company.id} variants={cardVariants}>
            <Link to={company.link} className={cardClass}>
              {cardBody}
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
