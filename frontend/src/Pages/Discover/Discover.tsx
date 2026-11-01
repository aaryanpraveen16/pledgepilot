import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiLayers,
  FiRefreshCw,
  FiSliders,
} from "react-icons/fi";
import {
  FaMicrochip,
  FaPalette,
  FaGamepad,
  FaPaintBrush,
  FaHeart,
} from "react-icons/fa";
import CampaignCard, {
  CampaignItem,
} from "../../Components/Campaign/CampaignCard";
import { discoverCampaign } from "../../services/discoverServices";
import Footer from "../../Components/Footer/Footer";

// Curated high-quality campaigns to ensure a rich catalog across all categories
const curatedCampaigns: CampaignItem[] = [
  {
    _id: "disc-1",
    name: "Aetheria: Modular Next-Gen ARM64 Portable Cyberdeck",
    description:
      "A hot-swappable mechanical cyberdeck featuring a sunlight-readable transflective display, hardware killswitches, and 18-hour field battery for hackers and field engineers.",
    ownerName: "Aether Dynamics",
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    raised: 184500,
    goal: 60000,
    backers: 1290,
    daysLeft: 6,
    badge: "Trending #1",
  },
  {
    _id: "disc-2",
    name: "NebulaOS: Open-Source Zero-Telemetry Mobile Operating System",
    description:
      "A privacy-respecting microkernel mobile OS with sandboxed containerized apps, native Linux compatibility, and zero tracking for next-gen smartphones.",
    ownerName: "Nebula Core Collective",
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    raised: 215000,
    goal: 100000,
    backers: 2410,
    daysLeft: 14,
    badge: "Trending",
  },
  {
    _id: "disc-3",
    name: "Lumina: Biophilic Desk Lamp with Adaptive Circadian Sky Lighting",
    description:
      "An aerospace-grade machined brass desk luminaire that synchronizes full-spectrum sunlight simulation to restore natural sleep rhythms and boost productivity.",
    ownerName: "Atelier Lumina",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
    raised: 92400,
    goal: 45000,
    backers: 812,
    daysLeft: 9,
    badge: "Staff Pick",
  },
  {
    _id: "disc-4",
    name: "Valkyrie Protocol: Tactical Sci-Fi Roguelike Deckbuilder",
    description:
      "A deep narrative strategy game combining procedural node map exploration, anime pixel art, responsive synthwave audio, and tactical card battles.",
    ownerName: "Ironclad Interactive",
    category: "Games",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    raised: 68200,
    goal: 30000,
    backers: 1420,
    daysLeft: 3,
    badge: "Ending Soon",
  },
  {
    _id: "disc-5",
    name: "Echoes of Solitude: Large-Format Hardcover Monograph",
    description:
      "A limited-edition cloth-bound artbook capturing brutalist architecture and forgotten remote research stations across the Arctic circle in medium format film.",
    ownerName: "Studio Monolith",
    category: "Arts",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    raised: 41800,
    goal: 20000,
    backers: 580,
    daysLeft: 18,
  },
  {
    _id: "disc-6",
    name: "SolShare: Open Hardware Solar Micro-Grid for Rural Communities",
    description:
      "Community-governed decentralized clean energy microgrids providing peer-to-peer electricity sharing and local battery storage without fossil dependencies.",
    ownerName: "SolShare Global",
    category: "Community",
    image:
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    raised: 154000,
    goal: 120000,
    backers: 1890,
    daysLeft: 21,
    badge: "Milestone Verified",
  },
  {
    _id: "disc-7",
    name: "PulseWave: Ultra-Low-Latency Wireless Studio Audiophile IEMs",
    description:
      "Lossless uncompressed 24-bit 96kHz wireless in-ear monitors equipped with dual planar magnetic drivers and titanium acoustic chambers for sound creators.",
    ownerName: "Pulse Acoustic Labs",
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
    raised: 135800,
    goal: 50000,
    backers: 1105,
    daysLeft: 11,
    badge: "Trending",
  },
  {
    _id: "disc-8",
    name: "Komorebi: Minimalist Ergonomic Mechanical Keyboard with Wooden Case",
    description:
      "CNC-milled Japanese walnut chassis with gasket mount, per-key RGB backlighting, custom POM switches, and brass weight plate.",
    ownerName: "Komorebi Keyboards",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
    raised: 87600,
    goal: 35000,
    backers: 940,
    daysLeft: 5,
  },
  {
    _id: "disc-9",
    name: "Mythos Reborn: Hand-Drawn 2D Metroidvania Indie RPG",
    description:
      "Traverse forgotten pantheons in a lavishly animated fantasy realm featuring fluid aerial combat, branching dialogue, and live orchestral soundscapes.",
    ownerName: "Nocturne Games",
    category: "Games",
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
    raised: 112000,
    goal: 75000,
    backers: 1895,
    daysLeft: 8,
    badge: "Staff Pick",
  },
  {
    _id: "disc-10",
    name: "Kinetic Sculpture #04: Precision Magnetic Fluid Clock",
    description:
      "An ambient kinetic timepiece manipulating dark ferrofluid droplets across an illuminated white canvas via 60 programmable electromagnets.",
    ownerName: "Kinetic Modern",
    category: "Arts",
    image:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    raised: 64500,
    goal: 40000,
    backers: 610,
    daysLeft: 16,
  },
  {
    _id: "disc-11",
    name: "TerraClean: Open Water Trash Skimmer & Ocean Plastic Recycler",
    description:
      "An autonomous solar-powered catamaran drone skimming floating debris in river deltas and compacting plastics for closed-loop upcycling.",
    ownerName: "CleanOceans Collective",
    category: "Community",
    image:
      "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=1200&q=80",
    raised: 198000,
    goal: 150000,
    backers: 2650,
    daysLeft: 2,
    badge: "Ending Soon",
  },
  {
    _id: "disc-12",
    name: "Helios VR: Featherweight Ultra-High-Resolution MicroOLED Headset",
    description:
      "A 190-gram PCVR headset with twin 4K MicroOLED panels, pancake optics, inside-out tracking, and magnetic prescription inserts for developers.",
    ownerName: "Helios Optical",
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1200&q=80",
    raised: 310000,
    goal: 150000,
    backers: 1720,
    daysLeft: 25,
    badge: "Trending",
  },
];

// Available categories
const categories = [
  { id: "All", label: "All", icon: FiLayers },
  { id: "Tech", label: "Tech", icon: FaMicrochip },
  { id: "Design", label: "Design", icon: FaPalette },
  { id: "Games", label: "Games", icon: FaGamepad },
  { id: "Arts", label: "Arts", icon: FaPaintBrush },
  { id: "Community", label: "Community", icon: FaHeart },
];

// Sorting options
type SortOption = "Trending" | "Most Funded" | "Recently Launched" | "Ending Soon";

const ITEMS_PER_PAGE = 9;

export const Discover: React.FC = () => {
  const navigate = useNavigate();
  const gridTopRef = useRef<HTMLDivElement>(null);

  // Data states
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Trending");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch campaigns from backend, falling back gracefully to curated demo list
  useEffect(() => {
    let isMounted = true;
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const data = await discoverCampaign();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            // Normalize backend campaigns
            const normalized = data.map((item: any) => ({
              _id: item._id || item.id || `backend-${Math.random()}`,
              name: item.name || "Untitled Campaign",
              description: item.description || "",
              ownerName: item.ownerName || item.owner || "PledgePilot Creator",
              category: item.category || "Tech",
              image: item.image || item.campaignImage,
              raised: Number(item.milestone?.progress || item.raised || 0),
              goal: Number(item.milestone?.target || item.goal || 10000),
              backers: Number(item.payments?.count || item.backers || 0),
              daysLeft: item.daysLeft ?? 14,
              badge: item.badge,
            }));

            // Merge with curated campaigns to provide rich depth
            const merged = [...normalized, ...curatedCampaigns];
            // Deduplicate by ID
            const uniqueMap = new Map();
            merged.forEach((c) => uniqueMap.set(c._id, c));
            setCampaigns(Array.from(uniqueMap.values()));
          } else {
            setCampaigns(curatedCampaigns);
          }
        }
      } catch (err) {
        console.error("Error fetching discover campaigns:", err);
        if (isMounted) {
          setCampaigns(curatedCampaigns);
        }
      } finally {
        if (isMounted) {
          setTimeout(() => setIsLoading(false), 300);
        }
      }
    };

    fetchCampaigns();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedCampaigns = useMemo(() => {
    let result = [...campaigns];

    // 1. Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((c) => {
        const cat = (c.category || "").toLowerCase();
        const target = selectedCategory.toLowerCase();
        if (target === "tech") return cat.includes("tech") || cat.includes("hardware");
        if (target === "design") return cat.includes("design");
        if (target === "games") return cat.includes("game");
        if (target === "arts") return cat.includes("art") || cat.includes("media");
        if (target === "community") return cat.includes("community") || cat.includes("social");
        return cat === target;
      });
    }

    // 2. Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.ownerName.toLowerCase().includes(q) ||
          (c.category && c.category.toLowerCase().includes(q))
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      const aGoal = Number(a.milestone?.target || a.goal || 1);
      const aRaised = Number(a.milestone?.progress || a.raised || 0);
      const aPercent = aGoal > 0 ? aRaised / aGoal : 0;
      const aBackers = Number(a.payments?.count || a.backers || 0);

      const bGoal = Number(b.milestone?.target || b.goal || 1);
      const bRaised = Number(b.milestone?.progress || b.raised || 0);
      const bPercent = bGoal > 0 ? bRaised / bGoal : 0;
      const bBackers = Number(b.payments?.count || b.backers || 0);

      switch (sortBy) {
        case "Trending":
          // Weighted score: backers + % funded
          return bBackers * 2 + bPercent * 100 - (aBackers * 2 + aPercent * 100);
        case "Most Funded":
          return bRaised - aRaised;
        case "Ending Soon":
          return (a.daysLeft ?? 30) - (b.daysLeft ?? 30);
        case "Recently Launched":
          return (b.daysLeft ?? 0) - (a.daysLeft ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [campaigns, selectedCategory, searchQuery, sortBy]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedCampaigns.length / ITEMS_PER_PAGE) || 1;
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedCampaigns.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedCampaigns, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("Trending");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-12 left-1/4 w-[36rem] h-[36rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Micro-Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Decentralized Crowdfunding Launchpad
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Discover Campaigns
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Explore breakthrough tech, gaming, design, and community initiatives with milestone-protected escrow guarantees.
            </p>
          </div>

          {/* Action button: Create Campaign */}
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate("/create")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-heading font-bold text-sm shadow-glow-emerald hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <FiPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Launch a Campaign</span>
            </button>
          </div>
        </div>

        {/* Top Search & Filter Header Container */}
        <div className="mt-8 space-y-6">
          {/* Row 1: Search Bar & Sorting Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input (Span 8) */}
            <div className="md:col-span-8 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns by title, keywords, creator, or topic..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-md"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown (Span 4) */}
            <div className="md:col-span-4 relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiSliders className="w-4 h-4 text-emerald-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort campaigns by"
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-md appearance-none cursor-pointer"
              >
                <option value="Trending" className="bg-slate-900 text-slate-100">
                  Sort: Trending
                </option>
                <option value="Most Funded" className="bg-slate-900 text-slate-100">
                  Sort: Most Funded
                </option>
                <option value="Recently Launched" className="bg-slate-900 text-slate-100">
                  Sort: Recently Launched
                </option>
                <option value="Ending Soon" className="bg-slate-900 text-slate-100">
                  Sort: Ending Soon
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 2: Category Pills Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                      : "bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-emerald-400"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}

            {/* Clear Filters Button if any filters are active */}
            {(selectedCategory !== "All" || searchQuery !== "" || sortBy !== "Trending") && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 bg-slate-900/40 transition-colors whitespace-nowrap flex-shrink-0 ml-auto"
              >
                <FiRefreshCw className="w-3 h-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>

          {/* Results Summary Bar */}
          <div ref={gridTopRef} className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <div>
              Showing{" "}
              <strong className="text-white font-semibold">
                {filteredAndSortedCampaigns.length === 0
                  ? 0
                  : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                -
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedCampaigns.length)}
              </strong>{" "}
              of{" "}
              <strong className="text-white font-semibold">
                {filteredAndSortedCampaigns.length}
              </strong>{" "}
              campaigns
              {selectedCategory !== "All" && (
                <span>
                  {" "}
                  in <span className="text-emerald-400 font-medium">{selectedCategory}</span>
                </span>
              )}
              {searchQuery && (
                <span>
                  {" "}
                  matching &ldquo;<span className="text-slate-200">{searchQuery}</span>&rdquo;
                </span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-4 text-slate-500 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Escrow Protected
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> XP Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Campaign Grid Section */}
        <div className="mt-6">
          {isLoading ? (
            /* Skeleton Loading Grid Placeholders */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((sk) => (
                <div
                  key={sk}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-pulse flex flex-col"
                >
                  <div className="aspect-[16/10] bg-slate-800/80 w-full" />
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="h-5 bg-slate-800 rounded-md w-3/4" />
                      <div className="h-3.5 bg-slate-800/60 rounded-md w-full" />
                      <div className="h-3.5 bg-slate-800/60 rounded-md w-4/5" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="h-3 bg-slate-800/70 rounded-md w-1/3" />
                      <div className="h-2 bg-slate-800 rounded-full w-full" />
                    </div>
                    <div className="pt-3 border-t border-slate-800/60 flex justify-between">
                      <div className="h-3 bg-slate-800/60 rounded w-16" />
                      <div className="h-3 bg-slate-800/60 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedCampaigns.length > 0 ? (
            /* Active 3-Column Campaign Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCampaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          ) : (
            /* Empty Search/Filter State */
            <div className="text-center py-20 px-4 bg-slate-900/40 rounded-3xl border border-slate-800/80 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                No campaigns match your search
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                We couldn&apos;t find any campaigns matching your current filter criteria. Try adjusting your search query or selecting a different category.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors shadow-sm"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 order-2 sm:order-1">
              Page <strong className="text-white">{currentPage}</strong> of{" "}
              <strong className="text-white">{totalPages}</strong>
            </div>

            <div className="inline-flex items-center gap-1.5 order-1 sm:order-2">
              {/* Previous Page Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              {/* Numbered Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                const isActive = pageNumber === currentPage;
                // Show first, last, and pages adjacent to current page
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(pageNumber - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      className={`min-w-[2.5rem] h-10 px-3 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                          : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span
                      key={pageNumber}
                      className="px-1 text-slate-600 select-none text-xs"
                    >
                      …
                    </span>
                  );
                }
                return null;
              })}

              {/* Next Page Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Brand Footer */}
      <Footer />
    </div>
  );
};

export default Discover;
export { Discover as DiscoverPage };
