import RevealOnScroll from '../RevealOnScroll/RevealOnScroll';
import styles from './FeaturedInsight.module.css';

export default function FeaturedInsight({ item, isUserSelected = false, onBackToLatest }) {
  if (!item) return null;

  const companyObj = typeof item.company === 'object' && item.company !== null ? item.company : {};
  const companyName = companyObj.name || (typeof item.company === 'string' ? item.company : 'Connect2Future');

  let companyLogo = companyObj.logo?.url || (typeof companyObj.logo === 'string' ? companyObj.logo : '');
  if (!companyLogo) {
    if (companyName.toLowerCase().includes('zentrax')) {
      companyLogo = '/ZENTRAXBUILDING.png';
    } else if (companyName.toLowerCase().includes('washwala')) {
      companyLogo = '/washwalaMAN.png';
    } else {
      companyLogo = '/c2flooooo.png';
    }
  }

  let companyTagline = companyObj.tagline || '';
  if (!companyTagline) {
    if (companyName.toLowerCase().includes('zentrax')) {
      companyTagline = 'CONSTRUCTION AND MAN POWER';
    } else if (companyName.toLowerCase().includes('washwala')) {
      companyTagline = 'PREMIUM WASH , SHINE LIKE NEW';
    } else {
      companyTagline = 'UNLOCK THE POWER OF CONNECTIVITY';
    }
  }

  const postImage = item.image?.url || (typeof item.image === 'string' ? item.image : '') || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';
  const postTitle = item.title || '';
  const postExcerpt = item.content || item.excerpt || '';
  const imageAlt = item.imageDescription || postTitle;

  const postDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()
    : (item.date ? item.date.toUpperCase() : 'MAY 15, 2026');

  const readTime = item.readTime || `${Math.max(1, Math.ceil((postExcerpt?.length || 0) / 400))} MIN READ`;

  return (
    <div className={styles.wrap} id="featured-section">
      <RevealOnScroll className={styles.featuredContainer} as="article">
        {/* LEFT PANEL */}
        <div className={styles.leftPanel}>
          {/* Back button if user selected this card */}
          {isUserSelected && (
            <button className={styles.backBtn} onClick={onBackToLatest}>
              &larr; Back to Latest Insight
            </button>
          )}

          {/* Company Branding */}
          <div className={styles.companyHeader}>
            {companyName === 'Connect2Air' ? (
              <img src="/logos/connect2air.png" alt="Connect2Air" className={styles.companyLogoLarge} />
            ) : (
              <>
                {companyLogo && (
                  <img src={companyLogo} alt={companyName} className={styles.companyLogo} />
                )}
                <div className={styles.companyInfo}>
                  <div className={styles.companyNameRow}>
                    <span className={styles.companyName}>{companyName}</span>
                    <svg className={styles.verifiedIcon} width="16" height="16" viewBox="0 0 24 24" fill="#ff1ea8">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  {companyTagline && (
                    <span className={styles.companyTagline}>{companyTagline}</span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className={styles.title}>{postTitle}</h2>

          {/* Short Description */}
          {postExcerpt && (
            <p className={styles.excerpt}>{postExcerpt}</p>
          )}

          {/* Metadata */}
          <div className={styles.meta}>
            <span>{postDate}</span>
          </div>

          {/* CTA Link */}
          {/* <div className={styles.ctaRow}>
            <span className={styles.ctaText}>
              Explore {companyName} &rarr;
            </span>
          </div> */}
        </div>

        {/* RIGHT PANEL - IMAGE DISPLAYED FULLY WITHOUT CROPPING */}
        <div className={styles.rightPanel}>
          <div className={styles.imageBgContainer}>
            <img src={postImage} alt={imageAlt} className={styles.featuredImage} />
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}
