/**
 * Central image registry.
 * All images are royalty-free Unsplash placeholders selected to match
 * the composition/subject of the approved mockups (corporate HQ, leadership,
 * meetings, technology, education, etc). Replace src values with brand
 * photography when available — every consumer of this file only needs
 * the key to change, not the markup.
 */

const u = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const images = {
  // heroHome1: '/por2.png',
  // heroHome2: '/hero222.png',  // corporate lobby
  // heroHome3:  '/por3.png',  // office building exterior

  heroHome1: u('photo-1497366754035-f200968a6e72'), // modern glass HQ, dusk
  heroHome2: u('photo-1486406146926-c627a92ad1ab'),  // corporate lobby
  heroHome3: u('photo-1497366811353-6870744d04b2'),  // office building exterior

  chairman: u('photo-1560250097-0b93528c311a', 1000), // executive portrait

  ventureConnect2Job: '/job1.png',      // two colleagues laptop
  ventureConnect2EdTech: '/EDtech.png',   // students + tech classroom
  ventureConnect2Creovox: '/creovox.png',   // engineer at monitors
  ventureConnect2Space: '/hero2.jpg',    // creative photo studio   
  ventureConnect2Air: '/c2airnew.jpg', // drone technology aerial
  ventureMrWashWala: '/washwalaout.jpeg',          // laundry service
  ventureZenTrax: '/build2.png',             // dashboard analytics

  officeExterior: u('photo-1497366216548-37526070297c'),
  officeInterior: u('photo-1497215728101-856f4ea42174'),
  meetingRoom: u('photo-1552664730-d307ca884978'),
  contactOffice: '/contact.png',
  whoWeAreHero:'/meeting.jpeg',

  insightsHero: '/insights.png',
  insightEarth: u('photo-1451187580459-43490279c0fa'),
  insightLearning: u('photo-1580894732444-8ecded7900cd'),
  insightCareers: u('photo-1573497491208-6b1acb260507'),
  insightTech: u('photo-1518770660439-4636190af475'),
  insightSustainability: u('photo-1466611653911-95081537e5b7'),
  insightCulture: u('photo-1517048676732-d65bc937f952'),
  insightExpansion: u('photo-1486406146926-c627a92ad1ab'),
  insightSustainableHands: u('photo-1542601906990-b4d3fb778b09'),

  homeInsight1: u('photo-1521737711867-e3b97375f902'),
  homeInsight2: u('photo-1486406146926-c627a92ad1ab'),
  homeInsight3: u('photo-1542601906990-b4d3fb778b09'),

  // ✅ Updated to match the exact filenames in your VS Code screenshot
  iitGuwahatiLogo: '/logos/iitGuwahatiLogo.png',
  nsdcLogo: '/logos/nsdcLogo.png',
  masaiLogo: '/logos/masai.png',
};