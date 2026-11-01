import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowRight,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiShield,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
  FiCompass,
  FiZap,
} from "react-icons/fi";
import {
  FaRocket,
  FaFire,
  FaCrown,
  FaCheckCircle,
  FaGamepad,
  FaMicrochip,
  FaPaintBrush,
  FaHeart,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Footer from "../../Components/Footer/Footer";
import CampaignCard, {
  CampaignItem,
} from "../../Components/Campaign/CampaignCard";
import { discoverCampaign } from "../../services/discoverServices";
import { campaignStats } from "../../services/statsServices";

// Curated high-impact spotlight and demo campaigns
const spotlightCampaigns: CampaignItem[] = [
  {
    _id: "spotlight-1",
    name: "ChronoForge: Dual-Display E-Ink Hybrid Mechanical Smartwatch",
    description:
      "A titanium Swiss-movement timepiece featuring an invisible curved E-Ink dial for continuous biometric tracking, 30-day battery life, and zero screen distractions.",
    ownerName: "ChronoLabs Studio",
    category: "Design & Hardware",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80",
    raised: 187450,
    goal: 50000,
    backers: 1840,
    daysLeft: 4,
    badge: "Trending #1",
  },
  {
    _id: "spotlight-2",
    name: "AuraPod: Spatial Audio Neural Earbuds with Real-Time Translation",
    description:
      "Lossless audiophile sound combined with low-latency on-device AI for live 42-language simultaneous translation and adaptive spatial acoustic calibration.",
    ownerName: "NeuralSound AI",
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1600&q=80",
    raised: 245000,
    goal: 75000,
    backers: 2150,
    daysLeft: 8,
    badge: "Staff Pick",
  },
  {
    _id: "spotlight-3",
    name: "Verdant: Autonomous AI Hydroponic Tower for Fresh Urban Greens",
    description:
      "Grow 36 organic plants inside your living room with automated nutrient injection, dual spectrum LED sunlight simulation, and companion iOS/Android telemetry.",
    ownerName: "Verdant Systems",
    category: "Community",
    image:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80",
    raised: 94200,
    goal: 40000,
    backers: 820,
    daysLeft: 11,
    badge: "Hot Drop",
  },
];

const curatedTrendingCampaigns: CampaignItem[] = [
  {
    _id: "trend-1",
    name: "PixelQuest: Handcrafted 16-Bit Roguelike Tactical RPG",
    description:
      "Journey through procedural dungeons with deep pixel animations, dynamic weather physics, and a fully orchestrated symphonic chiptune soundtrack.",
    ownerName: "Studio Moonlit",
    category: "Games",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    raised: 68400,
    goal: 30000,
    backers: 1420,
    daysLeft: 14,
    badge: "Trending",
  },
  {
    _id: "trend-2",
    name: "SolarSip: Kinetic Self-Purifying UV Titanium Thermos",
    description:
      "Medical-grade insulated flask that sterilizes 99.99% of bacteria using kinetic motion charging and deep UV-C LED purification in 60 seconds.",
    ownerName: "AquaPure Labs",
    category: "Design & Hardware",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    raised: 112500,
    goal: 45000,
    backers: 940,
    daysLeft: 6,
    badge: "Trending",
  },
  {
    _id: "trend-3",
    name: "NeuralCanvas: Ambient E-Paper Digital Art Gallery Frame",
    description:
      "Ultra-thin 32-inch gallery frame with zero-glare colored E-Paper display. Curate world masterpieces and live generative digital art with zero power consumption.",
    ownerName: "FrameCraft Tech",
    category: "Arts & Media",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    raised: 82100,
    goal: 50000,
    backers: 670,
    daysLeft: 9,
    badge: "Staff Pick",
  },
  {
    _id: "trend-4",
    name: "NebulaPad: Modular Magnetic Mechanical Ergonomic Keyboard",
    description:
      "Split ortholinear mechanical keyboard featuring hotswappable magnetic switches, OLED macro displays, and aircraft-grade aluminum CNC body.",
    ownerName: "Nebula Works",
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    raised: 54900,
    goal: 20000,
    backers: 580,
    daysLeft: 2,
    badge: "Ending Soon",
  },
  {
    _id: "trend-5",
    name: "Terrarium: Autonomous Biome Pod for Miniature Ecosystems",
    description:
      "Self-sustaining micro-rainforest with automated morning mist, circadian lighting cycles, and temperature telemetry for exotic mosses and flora.",
    ownerName: "BioSphere Collective",
    category: "Community",
    image:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80",
    raised: 41200,
    goal: 25000,
    backers: 490,
    daysLeft: 3,
    badge: "Ending Soon",
  },
  {
    _id: "trend-6",
    name: "EchoStream: Spatial Microphone for Cinematic Field Audio",
    description:
      "Capture 360-degree ambisonic soundscapes with quad capsule studio transducers and direct USB-C 32-bit float recording for filmmakers and creators.",
    ownerName: "SoundField Audio",
    category: "Arts & Media",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    raised: 76500,
    goal: 35000,
    backers: 630,
    daysLeft: 18,
    badge: "Trending",
  },
];

const categoryTabs = [
  { id: "all", name: "All Projects", icon: FiCompass },
  { id: "tech", name: "Technology", icon: FaMicrochip },
  { id: "design", name: "Design & Hardware", icon: FiLayers },
  { id: "games", name: "Games", icon: FaGamepad },
  { id: "arts", name: "Arts & Media", icon: FaPaintBrush },
  { id: "community", name: "Community", icon: FaHeart },
];

export default function HomePage() {
  const navigate = useNavigate();

  // State
  const [dbCampaigns, setDbCampaigns] = useState<CampaignItem[]>([]);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSort, setActiveSort] = useState<"trending" | "ending" | "funded">(
    "trending"
  );
  const [stats, setStats] = useState({
    totalRaised: 4280000,
    totalCampaigns: 248,
    totalBackers: 18450,
  });

  // Fetch live campaigns & stats on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [campaignsRes, statsRes] = await Promise.allSettled([
          discoverCampaign(),
          campaignStats(),
        ]);

        if (isMounted && campaignsRes.status === "fulfilled" && Array.isArray(campaignsRes.value)) {
          const formatted: CampaignItem[] = campaignsRes.value.map((c: any) => ({
            _id: c._id || c.id,
            name: c.name || "Untitled Campaign",
            description: c.description || "",
            ownerName: c.ownerName || c.owner?.name || "Verified Creator",
            category: c.category || "Technology",
            raised: Number(c.milestone?.progress || c.raised || 24000),
            goal: Number(c.milestone?.target || c.goal || 35000),
            backers: Number(c.payments?.count || c.backers || 112),
            daysLeft: c.daysLeft || 12,
            badge: "Live",
          }));
          setDbCampaigns(formatted);
        }

        if (isMounted && statsRes.status === "fulfilled" && statsRes.value) {
          const s = statsRes.value;
          setStats((prev) => ({
            totalRaised: s.paymentCount ? s.paymentCount * 100 : prev.totalRaised,
            totalCampaigns: s.campaignCount || prev.totalCampaigns,
            totalBackers: s.rewardCount ? s.rewardCount * 12 : prev.totalBackers,
          }));
        }
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-advance spotlight carousel every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % spotlightCampaigns.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentSpotlight = spotlightCampaigns[spotlightIndex];
  const spotlightPercent = Math.min(
    Math.round(
      ((currentSpotlight.raised || 0) / (currentSpotlight.goal || 1)) * 100
    ),
    999
  );

  // Combine live database campaigns with curated trending campaigns
  const allCampaigns = useMemo(() => {
    const combined = [...dbCampaigns, ...curatedTrendingCampaigns];
    // Remove duplicates if any
    const seen = new Set<string>();
    return combined.filter((c) => {
      if (seen.has(c._id)) return false;
      seen.add(c._id);
      return true;
    });
  }, [dbCampaigns]);

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    return allCampaigns
      .filter((c) => {
        if (activeCategory === "all") return true;
        const cat = (c.category || "").toLowerCase();
        if (activeCategory === "tech") return cat.includes("tech");
        if (activeCategory === "design") return cat.includes("design") || cat.includes("hardware");
        if (activeCategory === "games") return cat.includes("game");
        if (activeCategory === "arts") return cat.includes("art") || cat.includes("media");
        if (activeCategory === "community") return cat.includes("communit");
        return true;
      })
      .sort((a, b) => {
        if (activeSort === "ending") {
          return (a.daysLeft || 30) - (b.daysLeft || 30);
        }
        if (activeSort === "funded") {
          const percentA = ((a.raised || 0) / (a.goal || 1));
          const percentB = ((b.raised || 0) / (b.goal || 1));
          return percentB - percentA;
        }
        // Default: trending (by backers & raised)
        return (b.raised || 0) - (a.raised || 0);
      });
  }, [allCampaigns, activeCategory, activeSort]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* =========================================================================
          SECTION 1: HERO SECTION (High Impact & Conversion)
          ========================================================================= */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Ambient Dark Mesh & Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Geometric Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 backdrop-blur-md mb-8 shadow-glass hover:border-emerald-500/40 transition-colors cursor-pointer group">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold">PledgePilot 2.0</span>
            <span className="text-slate-600">•</span>
            <span className="group-hover:text-white transition-colors">
              Backer Guild XP & 0% Protocol Fees Live
            </span>
            <FiArrowRight className="text-slate-500 group-hover:text-emerald-400 transition-colors w-3 h-3" />
          </div>

          {/* Punchy Display Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest max-w-4xl leading-[1.08] text-white">
            Fund the future of{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 drop-shadow-[0_0_35px_rgba(16,185,129,0.3)]">
              indie innovation
            </span>{" "}
            & creator projects.
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Back revolutionary hardware, immersive games, and bold creative
            ideas before they hit the mass market. Earn Backer XP, unlock
            zero-fee perks, and co-create with visionary founders.
          </p>

          {/* Dual CTA Button Group */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="#campaigns"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-bold text-base shadow-glow-emerald hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Explore Campaigns</span>
              <FiArrowRight className="w-4 h-4 stroke-[2.5]" />
            </a>

            <button
              onClick={() => navigate("/create-campaign")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-100 font-heading font-semibold text-base border border-slate-700/80 hover:border-slate-500 backdrop-blur-md transition-all duration-200"
            >
              <FaRocket className="text-emerald-400 w-4 h-4" />
              <span>Start a Project</span>
            </button>
          </div>

          {/* Live Trust Stats Ticker */}
          <div className="mt-14 w-full max-w-4xl p-1 rounded-2xl bg-gradient-to-r from-slate-800/80 via-slate-800/40 to-slate-800/80 backdrop-blur-md shadow-2xl">
            <div className="bg-slate-900/90 rounded-xl px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-6 items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              <div className="flex flex-col items-center text-center">
                <span className="font-heading text-xl sm:text-2xl font-extrabold text-white flex items-center gap-1">
                  ${(stats.totalRaised / 1000000).toFixed(1)}M+
                </span>
                <span className="text-xs text-slate-400 font-medium mt-0.5">
                  Total Pledged
                </span>
              </div>

              <div className="flex flex-col items-center text-center pt-3 sm:pt-0">
                <span className="font-heading text-xl sm:text-2xl font-extrabold text-emerald-400 flex items-center gap-1">
                  {stats.totalCampaigns}+
                </span>
                <span className="text-xs text-slate-400 font-medium mt-0.5">
                  Funded Projects
                </span>
              </div>

              <div className="flex flex-col items-center text-center pt-3 sm:pt-0">
                <span className="font-heading text-xl sm:text-2xl font-extrabold text-white flex items-center gap-1">
                  {(stats.totalBackers / 1000).toFixed(0)}K+
                </span>
                <span className="text-xs text-slate-400 font-medium mt-0.5">
                  Active Backers
                </span>
              </div>

              <div className="flex flex-col items-center text-center pt-3 sm:pt-0">
                <span className="font-heading text-xl sm:text-2xl font-extrabold text-indigo-400 flex items-center gap-1">
                  99.4%
                </span>
                <span className="text-xs text-slate-400 font-medium mt-0.5">
                  Escrow Success Rate
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FEATURED CAMPAIGN CAROUSEL / HERO SPOTLIGHT
          ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FaFire className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                Featured Spotlight
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Top trending crowdfunding drop of the week
              </p>
            </div>
          </div>

          {/* Carousel Chevrons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSpotlightIndex(
                  (prev) =>
                    (prev - 1 + spotlightCampaigns.length) %
                    spotlightCampaigns.length
                )
              }
              aria-label="Previous Spotlight"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setSpotlightIndex(
                  (prev) => (prev + 1) % spotlightCampaigns.length
                )
              }
              aria-label="Next Spotlight"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wide Spotlight Card Container */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/90 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Visual Image Backdrop (Col 7) */}
            <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden bg-slate-950">
              <img
                src={currentSpotlight.image}
                alt={currentSpotlight.name}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />

              {/* Badges on image */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 flex items-center gap-1">
                  <HiSparkles className="w-3.5 h-3.5" />
                  {currentSpotlight.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                  {currentSpotlight.category}
                </span>
              </div>
            </div>

            {/* Campaign Details & Funding Progress (Col 5) */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-slate-900/95 backdrop-blur-md">
              <div>
                {/* Creator tag */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold">
                    {currentSpotlight.ownerName.charAt(0)}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    by <strong className="text-slate-200">{currentSpotlight.ownerName}</strong>
                  </span>
                  <FaCheckCircle className="text-emerald-400 text-xs" />
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
                  {currentSpotlight.name}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
                  {currentSpotlight.description}
                </p>
              </div>

              {/* Progress & Micro-Stats */}
              <div className="space-y-5 pt-4 border-t border-slate-800">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-heading text-2xl font-extrabold text-emerald-400">
                      ${currentSpotlight.raised?.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      pledged of ${currentSpotlight.goal?.toLocaleString()} (
                      <strong className="text-emerald-400 font-bold">
                        {spotlightPercent}%
                      </strong>
                      )
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 transition-all duration-700 shadow-glow-emerald"
                      style={{ width: `${Math.min(spotlightPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Backers & Time Left Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Backers</span>
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      <FiUsers className="text-emerald-400" />
                      {currentSpotlight.backers?.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Time Remaining</span>
                    <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                      <FiClock className="text-amber-400" />
                      {currentSpotlight.daysLeft} days left
                    </span>
                  </div>
                </div>

                {/* Direct Action */}
                <button
                  onClick={() =>
                    navigate(`/campaigns/campaign/${currentSpotlight._id}`)
                  }
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-bold text-sm shadow-glow-emerald hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <span>Back This Project</span>
                  <FiArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {spotlightCampaigns.map((_, i) => (
              <button
                key={i}
                onClick={() => setSpotlightIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === spotlightIndex
                    ? "w-8 bg-emerald-500"
                    : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 & 4: CATEGORY PILLS & CAMPAIGNS GRID
          ========================================================================= */}
      <section
        id="campaigns"
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <FiTrendingUp />
              <span>Explore Discoveries</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trending & Near-Completion Projects
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Handpicked innovative campaigns hitting milestones right now.
            </p>
          </div>

          {/* Sort Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs self-start md:self-auto">
            <button
              onClick={() => setActiveSort("trending")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeSort === "trending"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Trending Now
            </button>
            <button
              onClick={() => setActiveSort("ending")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeSort === "ending"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Ending Soon
            </button>
            <button
              onClick={() => setActiveSort("funded")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeSort === "funded"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Most Funded
            </button>
          </div>
        </div>

        {/* Horizontal Category Navigation Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-8">
          {categoryTabs.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-glow-emerald"
                    : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-slate-950" : "text-emerald-400"
                  }`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Campaign Cards Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.slice(0, 6).map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-slate-400 text-sm">
              No campaigns found matching this filter.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="mt-3 text-emerald-400 text-xs font-semibold hover:underline"
            >
              Reset Category Filter
            </button>
          </div>
        )}

        {/* View All Campaigns CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-heading font-semibold text-sm border border-slate-800 hover:border-emerald-500/40 shadow-glass transition-all hover:-translate-y-0.5"
          >
            <span>Explore All 150+ Live Campaigns</span>
            <FiArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: GAMIFICATION & BACKER GUILD TEASER BANNER
          ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 p-8 sm:p-12 shadow-2xl">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <FaCrown className="text-amber-400 text-xs" />
                <span>PLEDGEPILOT BACKER GUILD</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Level up your backer tier.{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300">
                  Unlock zero-fee pledges & VIP perks.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Every dollar you pledge earns Backer XP. Rise through Bronze,
                Silver, Gold, and Mythic ranks to unlock fee waivers, 2-hour
                early-bird drop alerts, and exclusive co-creator voting power.
              </p>

              {/* Benefit Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <FiAward className="text-indigo-400 text-lg mb-2" />
                  <h4 className="text-xs font-bold text-white mb-1">
                    10 XP per $1 Pledged
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Climb tiers automatically on every campaign you back.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <FiZap className="text-emerald-400 text-lg mb-2" />
                  <h4 className="text-xs font-bold text-white mb-1">
                    0% Platform Fees
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Waive processing fees on Gold & Mythic Backer tiers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <FiShield className="text-amber-400 text-lg mb-2" />
                  <h4 className="text-xs font-bold text-white mb-1">
                    VIP Drop Access
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Reserve limited early-bird slots 2 hours before launch.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/rewards")}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-heading font-semibold text-sm shadow-glow-indigo transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Explore Guild & Rewards</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Backer Pass Preview Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl p-6 bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/40 shadow-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                {/* Hologram sheen */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                      <FaCrown className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                        Backer Pass
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        Gold Tier Backer
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Level 14
                  </span>
                </div>

                {/* XP Progress Bar */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Guild XP</span>
                    <span className="text-indigo-300 font-bold">
                      7,450 / 10,000 XP
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-400 shadow-glow-indigo"
                      style={{ width: "74.5%" }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 block text-right">
                    2,550 XP to Mythic Tier
                  </span>
                </div>

                {/* Unlocked Perks List */}
                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-400 text-xs" />
                    <span>0% Processing Fees Activated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-400 text-xs" />
                    <span>2h Early-Bird Campaign Drop Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-400 text-xs" />
                    <span>Private Founder AMA & Beta Testing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FOOTER
          ========================================================================= */}
      <Footer />
    </div>
  );
}
