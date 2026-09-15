import { useNavigate } from 'react-router-dom';
import RevealOnScroll from '../RevealOnScroll/RevealOnScroll';
import styles from './InsightCard.module.css';

export default function InsightCard({ item, delay = 0, isFeatured = false, onSelectInsight }) {
  const navigate = useNavigate();
  if (!item) return null;

  // Extract company object and name
  const companyObj = typeof item.company === 'object' && item.company !== null ? item.company : {};
  const companyName = companyObj.name || (typeof item.company === 'string' ? item.company : 'Connect2Future');

  // Determine company logo safely
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

  // Determine tagline safely
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

  // Dynamic aspect ratio from stored format / aspectRatio metadata
  const storedFormat = item.image?.format || 'landscape';
  let dynamicRatio = item.image?.aspectRatio || '16:9';
  if (storedFormat === 'portrait') dynamicRatio = '4:5';
  else if (storedFormat === 'square') dynamicRatio = '1:1';
  else if (storedFormat === 'landscape') dynamicRatio = '16:9';

  const cssAspectRatio = dynamicRatio.replace(':', ' / ');

  const postDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()
    : (item.date ? item.date.toUpperCase() : 'MAY 15, 2026');

  const readTime = item.readTime || `${Math.max(1, Math.ceil((postExcerpt?.length || 0) / 400))} MIN READ`;

  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelectInsight) {
      onSelectInsight(item);
    } else {
      navigate('/insights', { state: { selectedInsight: item } });
    }
  };

  return (
    <RevealOnScroll delay={delay} className={`${styles.card} ${isFeatured ? styles.featuredCard : ''}`} as="article">
      <div className={styles.cardInner} onClick={handleClick} role="button" tabIndex={0}>
        {/* 1. POST IMAGE AT TOP (Adapts dynamically to stored aspect ratio) */}
        <div className={styles.imageWrap} style={{ aspectRatio: cssAspectRatio }}>
          <img src={postImage} alt={imageAlt} className={styles.image} loading="lazy" />
          {isFeatured && <span className={styles.featuredBadge}>FEATURED</span>}
        </div>

        {/* 2. CARD BODY BELOW IMAGE */}
        <div className={styles.body}>
          {/* Company Identity Block */}
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
                    <svg className={styles.verifiedIcon} width="14" height="14" viewBox="0 0 24 24" fill="#ff1ea8">
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

          {/* Metadata */}
          <div className={styles.meta}>
            <span>{postDate}</span>
          </div>

          {/* Title */}
          <h3 className={styles.title}>{postTitle}</h3>

          {/* Excerpt */}
          {postExcerpt && <p className={styles.excerpt}>{postExcerpt}</p>}

          {/* Read Story Link */}
          <div className={styles.readMore}>
            <span>{isFeatured ? 'Read Full Story' : 'Read Story'}</span>
            <svg className={styles.arrowIcon} width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
