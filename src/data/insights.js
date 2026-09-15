import { images } from '../utils/images';

export const featuredInsight = {
  category: 'Insights',
  title: 'Building Future-Ready Companies for a Better Tomorrow',
  excerpt:
    'How our ecosystem is creating future-ready businesses that solve real-world problems and build lasting impact.',
  date: 'May 15, 2026',
  readTime: '5 min read',
  image: images.insightEarth,
};

export const sideInsights = [
  {
    category: 'Announcement',
    title: 'Connect2EdTech Launches AI-Powered Learning Platform',
    excerpt: 'Empowering students and educators with personalized learning.',
    date: 'May 12, 2026',
    readTime: '3 min read',
    image: images.insightLearning,
  },
  {
    category: 'Story',
    title: 'Inside Connect2Job: Transforming Careers, Transforming Lives',
    excerpt: 'Real stories from real people who found opportunities and built their dreams.',
    date: 'May 10, 2026',
    readTime: '6 min read',
    image: images.insightCareers,
  },
  {
    category: 'Insights',
    title: 'The Role of Technology in Building Scalable Businesses',
    excerpt: 'Why technology is at the core of every successful venture in our ecosystem.',
    date: 'May 8, 2026',
    readTime: '4 min read',
    image: images.insightTech,
  },
];

export const gridInsights = [
  {
    category: 'Insights',
    title: 'Sustainability and Innovation: A Shared Responsibility',
    excerpt: 'Exploring how sustainable thinking drives innovation across industries.',
    date: 'May 5, 2026',
    readTime: '4 min read',
    image: images.insightSustainability,
  },
  {
    category: 'Story',
    title: 'Culture That Builds. People Who Lead.',
    excerpt: 'Our people, our culture and our values that drive everything we do.',
    date: 'April 30, 2026',
    readTime: '5 min read',
    image: images.insightCulture,
  },
  {
    category: 'Announcement',
    title: 'Connect2Space Expands Experiential Design Studio',
    excerpt: 'Pushing creative boundaries and building immersive experiences.',
    date: 'April 28, 2026',
    readTime: '3 min read',
    image: images.insightExpansion,
  },
];

export const homeInsights = [
  {
    category: 'Insights',
    title: 'The Future of Work is Human-Centric',
    date: 'May 10, 2026',
    readTime: '5 min read',
    image: images.homeInsight1,
  },
  {
    category: 'Announcement',
    title: 'Connect2EdTech Launches New Learning Platform',
    date: 'April 28, 2026',
    readTime: '3 min read',
    image: images.homeInsight2,
  },
  {
    category: 'Story',
    title: 'Building a Sustainable and Inclusive Tomorrow',
    date: 'April 15, 2026',
    readTime: '4 min read',
    image: images.homeInsight3,
  },
];

export const allInsights = [
  {
    _id: 'featured-1',
    type: 'Insights',
    title: featuredInsight.title,
    content: featuredInsight.excerpt,
    category: featuredInsight.category,
    createdAt: new Date('2026-05-15').toISOString(),
    image: { url: featuredInsight.image },
    company: { name: 'Connect2Future' },
    hashtags: ['#Innovation', '#FutureReady'],
  },
  ...sideInsights.map((item, index) => ({
    _id: `side-${index + 1}`,
    type: item.category,
    title: item.title,
    content: item.excerpt,
    category: item.category,
    createdAt: new Date('2026-05-12').toISOString(),
    image: { url: item.image },
    company: { name: 'Connect2Future' },
    hashtags: ['#Ecosystem', '#Impact'],
  })),
  ...gridInsights.map((item, index) => ({
    _id: `grid-${index + 1}`,
    type: item.category,
    title: item.title,
    content: item.excerpt,
    category: item.category,
    createdAt: new Date('2026-05-05').toISOString(),
    image: { url: item.image },
    company: { name: 'Connect2Future' },
    hashtags: ['#Sustainability', '#Leadership'],
  })),
  ...homeInsights.map((item, index) => ({
    _id: `home-${index + 1}`,
    type: item.category,
    title: item.title,
    content: item.excerpt || item.title,
    category: item.category,
    createdAt: new Date('2026-04-28').toISOString(),
    image: { url: item.image },
    company: { name: 'Connect2Future' },
    hashtags: ['#FutureOfWork'],
  })),
];

export const insightCategories = ['All', 'Insights', 'Announcements', 'Stories', 'Media', 'Gallery'];
