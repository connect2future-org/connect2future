import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '../../components/Container/Container';
import Hero from '../../components/Hero/Hero';
import InsightCard from '../../components/InsightCard/InsightCard';
import FeaturedInsight from '../../components/FeaturedInsight/FeaturedInsight';
import { getInsights } from '../../services/insightService';
import { getCompanies } from '../../services/companyService';
import styles from './Insights.module.css';

export default function Insights() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [insights, setInsights] = useState([]);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['ALL'];

  // Handle location state navigation (e.g. from Home page click)
  useEffect(() => {
    if (location.state?.selectedInsight) {
      setSelectedInsight(location.state.selectedInsight);
      setTimeout(() => {
        const featuredElem = document.getElementById('featured-section');
        if (featuredElem) {
          featuredElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }
  }, [location.state]);

  // Load companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getCompanies();
        if (res.success && res.data) {
          setCompanies(res.data);
        }
      } catch (err) {
        console.error('Failed to load companies:', err);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch insights with pagination
  const fetchInsightsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 8,
      };

      const res = await getInsights(params);
      if (res.success) {
        setInsights(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else {
        setError('Unable to load insights.');
      }
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      setError('Unable to load insights right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchInsightsData();
  }, [fetchInsightsData]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleSelectInsight = (item) => {
    setSelectedInsight(item);
    const featuredElem = document.getElementById('featured-section');
    if (featuredElem) {
      featuredElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToLatest = () => {
    setSelectedInsight(null);
  };

  // Determine active featured insight (user-selected or latest published post)
  const latestInsight = useMemo(() => {
    return insights.length > 0 ? insights[0] : null;
  }, [insights]);

  const activeFeaturedItem = selectedInsight || latestInsight;

  // Filter insights client-side by active category & search query
  const filteredInsights = useMemo(() => {
    return insights.filter((item) => {
      // Category filter
      if (activeCategory !== 'ALL') {
        const typeMatch = item.type?.toUpperCase() === activeCategory;
        const categoryMatch = item.category?.toUpperCase() === activeCategory;
        const companyMatch = item.company?.name?.toUpperCase().includes(activeCategory);
        const contentMatch = item.title?.toUpperCase().includes(activeCategory) || item.content?.toUpperCase().includes(activeCategory);
        if (!typeMatch && !categoryMatch && !companyMatch && !contentMatch) {
          return false;
        }
      }

      // Search term filter
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const contentMatch = item.content?.toLowerCase().includes(q);
        const companyMatch = item.company?.name?.toLowerCase().includes(q);
        if (!titleMatch && !contentMatch && !companyMatch) {
          return false;
        }
      }

      return true;
    });
  }, [insights, activeCategory, searchTerm]);

  return (
    <>
      {/* 1. HERO SECTION */}
      <Hero
        className={styles.insightsHeroSection}
        breadcrumb="Insights"
        title="Ideas. Innovation. Impact."
        subtitle="Explore perspectives, ideas, and stories that look beyond the present and into what comes next. From emerging technologies and evolving business landscapes to innovation, creativity, and digital transformation, our insights bring together ideas that inspire better thinking, meaningful conversations, and new possibilities across the Connect2Future ecosystem."
        image="/insights.png"
      />

      <section className="section bg-background">
        <Container wide>
          {/* 2. FEATURED NEW INSIGHT AREA */}
          {!loading && !error && activeFeaturedItem && (
            <FeaturedInsight
              item={activeFeaturedItem}
              isUserSelected={!!selectedInsight}
              onBackToLatest={handleBackToLatest}
            />
          )}

          {/* 3. CATEGORY FILTERS & SEARCH ROW */}
          <div className={styles.filterRow}>
            <div className={styles.categoryPills}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.pillBtn} ${activeCategory === cat ? styles.pillActive : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}>
              Loading insights...
            </div>
          )}

          {/* ERROR STATE */}
          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#c0392b' }}>
              <p>{error}</p>
              <button
                onClick={fetchInsightsData}
                style={{
                  marginTop: '16px',
                  padding: '8px 20px',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && filteredInsights.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', margin: '40px 0' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '12px' }}>
                No insights found.
              </h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
                {searchTerm
                  ? `No results matching "${searchTerm}". Try a different search term.`
                  : `We are currently preparing insightful content for ${activeCategory}. Stay tuned.`}
              </p>
            </div>
          )}

          {/* 4. 4-COLUMN EDITORIAL INSIGHTS GRID */}
          {!loading && !error && filteredInsights.length > 0 && (
            <div className={styles.grid}>
              {filteredInsights.map((item, i) => (
                <InsightCard
                  key={item._id || i}
                  item={item}
                  delay={i * 0.05}
                  isFeatured={false}
                  onSelectInsight={handleSelectInsight}
                />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {!loading && pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPreviousPage}
                style={{ opacity: pagination.hasPreviousPage ? 1 : 0.4, cursor: pagination.hasPreviousPage ? 'pointer' : 'not-allowed' }}
                aria-label="Previous page"
              >
                &larr;
              </button>
              {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((n) => (
                <button
                  key={n}
                  className={`${styles.pageBtn} ${page === n ? styles.pageActive : ''}`}
                  onClick={() => handlePageChange(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className={styles.pageBtn}
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNextPage}
                style={{ opacity: pagination.hasNextPage ? 1 : 0.4, cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed' }}
                aria-label="Next page"
              >
                &rarr;
              </button>
            </div>
          )}

          {/* 5. COMPANY ECOSYSTEM SIGNATURE STRIP */}
          <div className={styles.ecosystemSection}>
            <div className={styles.ecosystemHeader}>
              <div className={styles.line} />
              <span className={styles.ecosystemTitle}>FROM ACROSS OUR ECOSYSTEM</span>
              <div className={styles.line} />
            </div>
            <div className={styles.companyLogosContainer}>
              <div className={styles.companyLogosRow1}>
                <div className={styles.companyBrandItem}>
                  <img src="/c2flooooo.png" alt="Connect2Job" className={styles.brandLogoWing} />
                  <span className={styles.brandName}>Connect2Job</span>
                </div>
                <div className={styles.companyBrandItem}>
                  <img src="/c2flooooo.png" alt="Connect2Creovox" className={styles.brandLogoWing} />
                  <span className={styles.brandName}>Connect2Creovox</span>
                </div>
                <div className={styles.companyBrandItem}>
                  <img src="/c2flooooo.png" alt="Connect2EdTech" className={styles.brandLogoWing} />
                  <span className={styles.brandName}>Connect2EdTech</span>
                </div>
                <div className={styles.companyBrandItem}>
                  <img src="/c2flooooo.png" alt="Connect2Space" className={styles.brandLogoWing} />
                  <span className={styles.brandName}>Connect2Space</span>
                </div>
              </div>

              <div className={styles.companyLogosRow2}>
                <div className={styles.companyBrandItem}>
                  <img src="/logos/connect2air-dark.png" alt="Connect2Air" className={styles.brandLogoFull} />
                </div>
                <div className={styles.companyBrandItem}>
                  <img
                    src="/ZENTRAX_ECOSYSTEM_LOGO.png"
                    alt="Zentrax Construction"
                    className={styles.brandLogoCustom}
                  />
                  <span className={styles.brandNameBold}>Zentrax Construction</span>
                </div>
                <div className={styles.companyBrandItem}>
                  <img src="/washwalaMAN.png" alt="Mr.WashWala" className={styles.brandLogoMascot} />
                  <span className={styles.brandNameBold}>Mr.WashWala</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
