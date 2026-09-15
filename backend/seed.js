const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/database");
const Company = require("./models/Company");
const Post = require("./models/Post");
const Admin = require("./models/Admin");
const { uploadToCloudinary } = require("./utils/cloudinaryUpload");

const companyDefinitions = [
  {
    name: "Connect2Job",
    tagline: "UNLOCK THE POWER OF CONNECTIVITY",
    description: "A next-generation recruitment and career platform bridging the gap between talent and global opportunity.",
    localLogoPath: path.join(__dirname, "../public/c2flooooo.png"),
  },
  {
    name: "Connect2Creovox",
    tagline: "UNLOCK THE POWER OF CONNECTIVITY",
    description: "A creative technology studio specializing in digital transformation, design systems, and software engineering.",
    localLogoPath: path.join(__dirname, "../public/c2flooooo.png"),
  },
  {
    name: "Connect2EdTech",
    tagline: "UNLOCK THE POWER OF CONNECTIVITY",
    description: "An educational technology platform delivering personalized learning experiences powered by AI.",
    localLogoPath: path.join(__dirname, "../public/c2flooooo.png"),
  },
  {
    name: "Connect2Space",
    tagline: "UNLOCK THE POWER OF CONNECTIVITY",
    description: "Premium flexible workspaces and co-working environments designed for high-growth enterprises.",
    localLogoPath: path.join(__dirname, "../public/c2flooooo.png"),
  },
  {
    name: "Zentrax Construction",
    tagline: "CONSTRUCTION AND MAN POWER",
    description: "Enterprise IT solutions focusing on digital logistics, supply chain optimization, and operational intelligence.",
    localLogoPath: path.join(__dirname, "../public/logos/zentrax.png"),
  },
  {
    name: "Connect2Air",
    tagline: "BRANDS THAT FLY HIGHER",
    description: "Connect2Air specializes in drone-led advertising, aerial brand activations, custom drone displays, and immersive event experiences.",
    localLogoPath: path.join(__dirname, "../public/logos/connect2air.png"),
  },
  {
    name: "Connect2Future",
    tagline: "BUILDING THE FUTURE, CREATING POSSIBILITIES",
    description: "Connect2Future is a diversified ecosystem of companies empowering people, businesses, and communities through innovation.",
    localLogoPath: path.join(__dirname, "../public/c2flooooo.png"),
  },
];

const samplePosts = [
  {
    companyName: "Connect2Job",
    type: "Insight",
    title: "The Future of Remote Hiring in Emerging Markets",
    content: "As global workforce dynamics shift, emerging markets are becoming hotbeds for remote talent acquisition. Forward-thinking enterprise leaders are leveraging technology platforms to bridge geographical gaps and access untapped talent pools across developing economies efficiently.",
    imageDescription: "Modern corporate workspace with diverse team collaborating across regions",
    hashtags: ["#FutureOfWork", "#RemoteHiring", "#GlobalTalent"],
  },
  {
    companyName: "Connect2EdTech",
    type: "Announcement",
    title: "Revolutionizing Corporate Learning Through AI-Powered Platforms",
    content: "Connect2EdTech unveils its next-generation enterprise learning platform. By integrating adaptive AI models, the platform tailors personalized skill development pathways for workforce upskilling at scale.",
    imageDescription: "Interactive digital learning portal displayed on modern devices",
    hashtags: ["#EdTech", "#AILearning", "#CorporateTraining"],
  },
  {
    companyName: "Zentrax Construction",
    type: "Story",
    title: "Building Sustainable Supply Chains: A Zentrax Case Study",
    content: "Discover how Zentrax partnered with a Fortune-500 enterprise to reduce carbon footprints by 40% while enhancing operational precision through automated supply chain tracking.",
    imageDescription: "Sustainable green logistics operations center",
    hashtags: ["#Sustainability", "#SupplyChain", "#EnterpriseTech"],
  },
  {
    companyName: "Connect2Space",
    type: "News",
    title: "Connect2Space Expands Workspace Network Across Key Economic Hubs",
    content: "With the opening of premium co-working locations in strategic commercial hubs, Connect2Space strengthens its presence as the preferred partner for flexible enterprise office spaces.",
    imageDescription: "Sophisticated corporate co-working workspace with natural lighting",
    hashtags: ["#CoWorking", "#EnterpriseWorkspace", "#Expansion"],
  },
  {
    companyName: "Connect2Creovox",
    type: "Insight",
    title: "Digital Transformation: From Strategy to Operational Execution",
    content: "Navigating digital transformation requires more than adoption of software—it requires strategic alignment. Connect2Creovox outlines key principles for enterprise digital success.",
    imageDescription: "Executive board meeting analyzing strategic technology architecture",
    hashtags: ["#DigitalTransformation", "#EnterpriseStrategy", "#Innovation"],
  },
  {
    companyName: "Mr.WashWala",
    type: "Story",
    title: "How Mr.WashWala is Professionalizing Urban Services",
    content: "From neighborhood services to standard-setting operations across major metropolitan areas, explore the journey of Mr.WashWala in transforming urban care and home services.",
    imageDescription: "Professional service management team operating with modern logistics",
    hashtags: ["#UrbanServices", "#ServiceExcellence", "#Growth"],
  },
];

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB for seeding...");
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log("✦ MongoDB Connected!");

    // Find default admin user if exists
    const adminUser = await Admin.findOne();
    const adminId = adminUser ? adminUser._id : undefined;

    const companyMap = {};

    for (const compDef of companyDefinitions) {
      let existing = await Company.findOne({ name: compDef.name });

      let logoData = existing && existing.logo && existing.logo.url ? existing.logo : { url: "", publicId: "" };

      // Upload logo to Cloudinary if not uploaded already
      if (!logoData.url && fs.existsSync(compDef.localLogoPath)) {
        console.log(`Uploading logo for ${compDef.name} to Cloudinary (connect2future/companies)...`);
        const fileBuffer = fs.readFileSync(compDef.localLogoPath);
        logoData = await uploadToCloudinary(fileBuffer, "connect2future/companies");
        console.log(`  └─ Uploaded: ${logoData.url}`);
      }

      const company = await Company.findOneAndUpdate(
        { name: compDef.name },
        {
          name: compDef.name,
          tagline: compDef.tagline,
          description: compDef.description,
          logo: logoData,
          verified: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      companyMap[compDef.name] = company._id;
      console.log(`✦ Seeded Company: ${company.name}`);
    }

    // Seed Posts if post collection is empty or update posts
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      console.log("Seeding initial Insights posts...");
      for (const p of samplePosts) {
        const companyId = companyMap[p.companyName];
        if (companyId) {
          const createdPost = await Post.create({
            company: companyId,
            type: p.type,
            title: p.title,
            content: p.content,
            image: {
              url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
              publicId: "",
            },
            imageDescription: p.imageDescription,
            hashtags: p.hashtags,
            createdBy: adminId,
            status: "published",
          });
          console.log(`✦ Seeded Post: ${createdPost.title}`);
        }
      }
    } else {
      console.log(`✦ Posts collection already contains ${postCount} posts.`);
    }

    console.log("\n✦ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
