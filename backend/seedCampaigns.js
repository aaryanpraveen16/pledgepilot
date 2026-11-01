import mongoose from "mongoose";
import dotenv from "dotenv";
import Campaign from "./app/models/Campaign.js";
import User from "./app/models/User.js";

dotenv.config();

const dummyCampaigns = [
  {
    name: "ChronoForge: Dual-Display E-Ink Hybrid Mechanical Smartwatch",
    category: "Tech",
    ownerName: "ChronoLabs Studio",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    description: `
      <div class="campaign-story">
        <p class="lead">A titanium Swiss-movement timepiece featuring an invisible curved E-Ink dial for continuous biometric tracking, 30-day battery life, and zero screen distractions.</p>
        <h3>The Problem We Are Solving</h3>
        <p>Smartwatches today overwhelm users with notifications, require nightly recharging, and distract constantly with glowing OLED screens.</p>
        <h3>Our Solution</h3>
        <p>ChronoForge embeds an ambient micro-curved E-Ink display underneath authentic mechanical hands. It offers true 30-day endurance with decentralized on-device privacy encryption.</p>
        <h3>Key Specifications</h3>
        <ul>
          <li>Grade-5 Aerospace Titanium Chassis</li>
          <li>Swiss ETA Automatic Mechanical Core</li>
          <li>Continuous Heart Rate, HRV & Blood Oxygen Sensors</li>
          <li>50-Meter Water Resistance & Sapphire Crystal</li>
        </ul>
      </div>
    `,
    milestone: {
      target: "50000",
      progress: "64800",
    },
    payments: {
      count: "412",
    },
    daysLeft: 14,
    badge: "Trending #1",
    rewards: [
      {
        name: "Early Bird Backer",
        amount: 199,
        description: "1x ChronoForge Watch + Titanium Mesh Strap + VIP Backer Badge.",
        estimatedDelivery: "October 2026",
        quantityLimit: "250",
      },
      {
        name: "Founder Collector Edition",
        amount: 349,
        description: "1x Numbered Limited ChronoForge Watch + Leather & Titanium Straps + Founder NFT Pass.",
        estimatedDelivery: "November 2026",
        quantityLimit: "100",
      },
    ],
  },
  {
    name: "Aetheria: Modular Next-Gen ARM64 Portable Cyberdeck",
    category: "Tech",
    ownerName: "Aether Dynamics",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    description: `
      <div class="campaign-story">
        <p class="lead">A hot-swappable mechanical cyberdeck featuring a sunlight-readable transflective display, hardware killswitches, and 18-hour field battery for hackers and field engineers.</p>
        <h3>The Problem We Are Solving</h3>
        <p>Field technicians and security researchers need repairable hardware with physical hardware disconnection killswitches and day-long battery life.</p>
        <h3>Our Solution</h3>
        <p>Aetheria runs mainline Linux on a customized 8-core ARM64 compute module, featuring a mechanical ortholinear keyboard and hot-swappable LoRa/SDR radio modules.</p>
      </div>
    `,
    milestone: {
      target: "60000",
      progress: "84500",
    },
    payments: {
      count: "520",
    },
    daysLeft: 8,
    badge: "Staff Pick",
    rewards: [
      {
        name: "Developer Kit",
        amount: 299,
        description: "1x Aetheria Cyberdeck Base + Mechanical Switches + 18h Battery Pack.",
        estimatedDelivery: "November 2026",
        quantityLimit: "300",
      },
    ],
  },
  {
    name: "Lumina: Biophilic Desk Lamp with Adaptive Circadian Sky Lighting",
    category: "Design",
    ownerName: "Atelier Lumina",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
    description: `
      <div class="campaign-story">
        <p class="lead">An aerospace-grade machined brass desk luminaire that synchronizes full-spectrum sunlight simulation to restore natural sleep rhythms and boost productivity.</p>
        <h3>The Problem We Are Solving</h3>
        <p>Modern remote workers spend 90% of their days indoors under harsh, blue-tinted fluorescent light that disrupts melatonin production.</p>
        <h3>Our Solution</h3>
        <p>Lumina mimics the exact solar spectrum of natural sunlight from sunrise to sunset, promoting calm focus during the day and deep rest at night.</p>
      </div>
    `,
    milestone: {
      target: "45000",
      progress: "48200",
    },
    payments: {
      count: "310",
    },
    daysLeft: 18,
    badge: "Trending",
    rewards: [
      {
        name: "Single Lumina Lamp",
        amount: 149,
        description: "1x Machined Solid Brass Lumina Desk Lamp with Smart Controller.",
        estimatedDelivery: "September 2026",
      },
    ],
  },
  {
    name: "Valkyrie Protocol: Tactical Sci-Fi Roguelike Deckbuilder",
    category: "Games",
    ownerName: "Ironclad Interactive",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    description: `
      <div class="campaign-story">
        <p class="lead">A deep narrative strategy game combining procedural node map exploration, anime pixel art, responsive synthwave audio, and tactical card battles.</p>
        <h3>The Problem We Are Solving</h3>
        <p>Many deckbuilders sacrifice story and atmosphere for repetitive mechanical loops.</p>
        <h3>Our Solution</h3>
        <p>Valkyrie Protocol combines procedural tactical choices with deeply branching visual novel storylines and over 350 collectable ability cards.</p>
      </div>
    `,
    milestone: {
      target: "30000",
      progress: "42100",
    },
    payments: {
      count: "890",
    },
    daysLeft: 5,
    badge: "Ending Soon",
    rewards: [
      {
        name: "Digital Game Key",
        amount: 25,
        description: "Steam Key + Beta Access + Digital Artbook & Soundtrack.",
        estimatedDelivery: "August 2026",
      },
      {
        name: "Collector Physical Box Set",
        amount: 85,
        description: "Numbered Steelbook Case + Hardcover Lorebook + Foil Playing Cards.",
        estimatedDelivery: "October 2026",
      },
    ],
  },
  {
    name: "SolShare: Open Hardware Solar Micro-Grid for Rural Communities",
    category: "Community",
    ownerName: "SolShare Global",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    description: `
      <div class="campaign-story">
        <p class="lead">Community-governed decentralized clean energy microgrids providing peer-to-peer electricity sharing and local battery storage without fossil dependencies.</p>
        <h3>The Problem We Are Solving</h3>
        <p>Over 700 million people lack stable access to electrical grids in remote rural villages.</p>
        <h3>Our Solution</h3>
        <p>Open-source hardware energy hubs enable micro-generation, battery storage, and cellular metering to power water filtration and clinics.</p>
      </div>
    `,
    milestone: {
      target: "120000",
      progress: "154000",
    },
    payments: {
      count: "1280",
    },
    daysLeft: 22,
    badge: "Milestone Verified",
    rewards: [
      {
        name: "Village Energy Kit Sponsor",
        amount: 100,
        description: "Directly funds solar panel cells and battery packs for 1 community hub + verification report.",
        estimatedDelivery: "December 2026",
      },
    ],
  },
  {
    name: "PulseWave: Ultra-Low-Latency Wireless Studio Audiophile IEMs",
    category: "Tech",
    ownerName: "Pulse Acoustic Labs",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
    description: `
      <div class="campaign-story">
        <p class="lead">Lossless uncompressed 24-bit 96kHz wireless in-ear monitors equipped with dual planar magnetic drivers and titanium acoustic chambers for sound creators.</p>
        <h3>The Solution</h3>
        <p>Proprietary 2.4GHz ultra-low latency wireless dongle (under 5ms) ensures perfect audio synchronization for studio music mixing and live gaming.</p>
      </div>
    `,
    milestone: {
      target: "50000",
      progress: "78200",
    },
    payments: {
      count: "612",
    },
    daysLeft: 12,
    badge: "Trending",
    rewards: [
      {
        name: "Early Backer IEM",
        amount: 179,
        description: "1x PulseWave IEMs + Wireless USB-C Dongle + Comply Memory Foam Tips.",
        estimatedDelivery: "October 2026",
      },
    ],
  },
  {
    name: "Komorebi: Minimalist Ergonomic Mechanical Keyboard with Wooden Case",
    category: "Design",
    ownerName: "Komorebi Keyboards",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
    description: `
      <div class="campaign-story">
        <p class="lead">CNC-milled Japanese walnut chassis with gasket mount, per-key RGB backlighting, custom POM switches, and solid brass weight plate.</p>
      </div>
    `,
    milestone: {
      target: "35000",
      progress: "51400",
    },
    payments: {
      count: "430",
    },
    daysLeft: 7,
    badge: "Staff Pick",
    rewards: [
      {
        name: "Barebones Walnut Kit",
        amount: 189,
        description: "Walnut Chassis + Hotswap PCB + Brass Weight + Gasket Silencing Pack.",
        estimatedDelivery: "November 2026",
      },
    ],
  },
  {
    name: "Echoes of Solitude: Large-Format Hardcover Monograph",
    category: "Arts",
    ownerName: "Studio Monolith",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    description: `
      <div class="campaign-story">
        <p class="lead">A limited-edition cloth-bound artbook capturing brutalist architecture and forgotten remote research stations across the Arctic circle in medium format film.</p>
      </div>
    `,
    milestone: {
      target: "20000",
      progress: "24800",
    },
    payments: {
      count: "380",
    },
    daysLeft: 16,
    rewards: [
      {
        name: "Hardcover Monograph",
        amount: 65,
        description: "240-page clothbound book + 2x signed archival art prints.",
        estimatedDelivery: "October 2026",
      },
    ],
  },
  {
    name: "Mythos Reborn: Hand-Drawn 2D Metroidvania Indie RPG",
    category: "Games",
    ownerName: "Nocturne Games",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
    description: `
      <div class="campaign-story">
        <p class="lead">Traverse forgotten pantheons in a lavishly animated fantasy realm featuring fluid aerial combat, branching dialogue, and live orchestral soundscapes.</p>
      </div>
    `,
    milestone: {
      target: "75000",
      progress: "92000",
    },
    payments: {
      count: "1450",
    },
    daysLeft: 9,
    badge: "Staff Pick",
    rewards: [
      {
        name: "Early Adventurer Key",
        amount: 20,
        description: "Game Key + Beta Access + Digital Soundtrack.",
        estimatedDelivery: "September 2026",
      },
    ],
  },
  {
    name: "TerraClean: Open Water Trash Skimmer & Ocean Plastic Recycler",
    category: "Community",
    ownerName: "CleanOceans Collective",
    image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=1200&q=80",
    description: `
      <div class="campaign-story">
        <p class="lead">An autonomous solar-powered catamaran drone skimming floating debris in river deltas and compacting plastics for closed-loop upcycling.</p>
      </div>
    `,
    milestone: {
      target: "150000",
      progress: "189000",
    },
    payments: {
      count: "1920",
    },
    daysLeft: 3,
    badge: "Ending Soon",
    rewards: [
      {
        name: "Clean Ocean Supporter",
        amount: 50,
        description: "Removes 100kg of marine debris + GPS live-tracking link.",
        estimatedDelivery: "July 2026",
      },
    ],
  },
];

async function seedDatabase() {
  const connectionString = process.env.DB_CONNECTION_STRING;
  if (!connectionString) {
    console.error("❌ Error: DB_CONNECTION_STRING is missing in backend/.env!");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB Atlas...");
  try {
    await mongoose.connect(connectionString);
    console.log("✅ Successfully connected to MongoDB Atlas!");

    // 1. Ensure a default creator user exists
    let creator = await User.findOne({ emailAddress: "creator@pledgepilot.io" });
    if (!creator) {
      console.log("👤 Creating default demo creator user...");
      creator = await User.create({
        firstName: "Alex",
        lastName: "Morgan",
        emailAddress: "creator@pledgepilot.io",
        role: "creator",
        aboutMe: "Hardware engineer & founder building decentralized crowdfunding innovations.",
        accountCreationDate: new Date().toISOString().split("T")[0],
      });
      console.log("✅ Created creator user with ID:", creator._id);
    } else {
      console.log("ℹ️ Found existing creator user with ID:", creator._id);
    }

    // 2. Clear existing campaigns if requested or populate new
    const isFresh = process.argv.includes("--fresh");
    if (isFresh) {
      console.log("🗑️ Clearing existing campaigns from database...");
      await Campaign.deleteMany({});
    }

    // 3. Insert campaigns
    console.log(`📦 Inserting ${dummyCampaigns.length} curated campaigns into database...`);

    const campaignsToInsert = dummyCampaigns.map((camp) => ({
      ...camp,
      owner: creator._id,
      community: {
        comment: {
          id: `comment-${Date.now()}`,
          body: "Excited to back this project!",
          owner: { userId: creator._id.toString() },
        },
        blog: {
          id: `blog-${Date.now()}`,
          body: "Welcome to our campaign! Stay tuned for milestone updates.",
          owner: { userId: creator._id.toString() },
        },
      },
    }));

    const result = await Campaign.insertMany(campaignsToInsert);
    console.log(`🎉 Successfully seeded ${result.length} campaigns!`);

    // Update creator createdProjects list
    const projectIds = result.map((c) => c._id);
    await User.findByIdAndUpdate(creator._id, {
      $addToSet: { createdProjects: { $each: projectIds } },
    });

    console.log("✨ Done! Your database is now populated with rich campaign data across Tech, Design, Games, Arts, and Community.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed with error:", err);
    process.exit(1);
  }
}

seedDatabase();

