import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCompass,
  FiPlusCircle,
  FiDollarSign,
  FiShield,
  FiLayers,
  FiSearch,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiFileText,
  FiUsers,
  FiRefreshCw,
  FiHeart,
} from "react-icons/fi";
import {
  FaRocket,
  FaGem,
  FaCoins,
  FaCrown,
  FaShieldAlt,
  FaEdit,
  FaBullhorn,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import CampaignCard, { CampaignItem } from "../../Components/Campaign/CampaignCard";
import Footer from "../../Components/Footer/Footer";
import { getUserByEmail, getUserPayments } from "../../services/userServices";
import { discoverCampaign } from "../../services/discoverServices";
import { getUserInTheSession } from "../../Utils/SessionStorage";
import { User } from "../../types/User";

interface MilestoneAuditItem {
  id: string;
  campaignName: string;
  phase: string;
  targetAmount: number;
  progressPercent: number;
  status: "Audited & Released" | "Community Review" | "Pending Deliverables";
  dueDate: string;
  deliverableNotes: string;
}

const mockMilestones: MilestoneAuditItem[] = [
  {
    id: "ms-1",
    campaignName: "ChronoForge Modular Smartwatch",
    phase: "Phase 2: PCB Tooling & Sensor Integration",
    targetAmount: 25000,
    progressPercent: 100,
    status: "Audited & Released",
    dueDate: "Completed Oct 2026",
    deliverableNotes: "Precision tooling molds verified by community audit panel. First 50 test PCBs passed telemetry checks.",
  },
  {
    id: "ms-2",
    campaignName: "Solaria Portable Solar Tent",
    phase: "Phase 1: Solar Cell Fabric Batch Production",
    targetAmount: 18000,
    progressPercent: 82,
    status: "Community Review",
    dueDate: "Voting ends in 3 days",
    deliverableNotes: "High-efficiency monocrystalline fabric sample tested for 48-hour waterproof UV resilience.",
  },
  {
    id: "ms-3",
    campaignName: "NebulaOS Open-Source Station",
    phase: "Phase 3: Hardware Housing Injection Molding",
    targetAmount: 30000,
    progressPercent: 35,
    status: "Pending Deliverables",
    dueDate: "Target: Dec 2026",
    deliverableNotes: "Tooling molds currently undergoing CNC refinement at the fabrication facility.",
  },
];

const mockTransactions = [
  {
    id: "TXN-89412-PP",
    campaign: "ChronoForge Modular Smartwatch",
    date: "Oct 24, 2026",
    amount: 250.0,
    escrowCredit: 30.0,
    method: "Stripe Escrow Vault",
    status: "Secured in Escrow",
  },
  {
    id: "TXN-74190-PP",
    campaign: "Solaria Portable Solar Tent",
    date: "Oct 12, 2026",
    amount: 180.0,
    escrowCredit: 21.6,
    method: "Stripe Escrow Vault",
    status: "Secured in Escrow",
  },
  {
    id: "TXN-58213-PP",
    campaign: "NebulaOS Open-Source Station",
    date: "Sep 28, 2026",
    amount: 100.0,
    escrowCredit: 12.0,
    method: "Stripe Escrow Vault",
    status: "Secured in Escrow",
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPaymentStats, setUserPaymentStats] = useState<any>(null);
  const [trendingRecommendations, setTrendingRecommendations] = useState<any[]>([]);
  
  // Dashboard UI State
  const [activeTab, setActiveTab] = useState<"followed" | "created" | "milestones" | "ledger">("followed");
  const [searchQuery, setSearchQuery] = useState("");
  const [votedMilestones, setVotedMilestones] = useState<Record<string, boolean>>({});
  const [voteToast, setVoteToast] = useState<string | null>(null);

  // Normalize campaign object for CampaignCard
  const normalizeCampaign = (c: any): CampaignItem => {
    return {
      _id: c?._id || c?.id || "",
      name: c?.name || "Untitled Innovation Project",
      description: c?.description || "",
      ownerName: c?.ownerName || c?.creatorName || "Verified Builder",
      category: c?.category || "Tech",
      image: c?.image,
      raised: Number(c?.milestone?.progress || c?.raised || 18500),
      goal: Number(c?.milestone?.target || c?.goal || 35000),
      backers: Number(c?.payments?.count || c?.backers || 124),
      daysLeft: c?.daysLeft ?? 18,
      badge: c?.badge || "Milestone Escrow",
    };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      try {
        const sessionUser = getUserInTheSession();
        if (!sessionUser) {
          navigate("/login?redirect=/dashboard");
          return;
        }

        const emailAddress = sessionUser.emailAddress;
        if (emailAddress) {
          const userRes = await getUserByEmail(emailAddress);
          const userData = userRes?.data || userRes;
          if (isMounted && userData) {
            setProfile(userData);
            sessionStorage.setItem("user", JSON.stringify(userData));

            // Fetch payment history
            const userId = userData._id || userData.id || userData.Id;
            if (userId) {
              const paymentRes = await getUserPayments(userId);
              if (isMounted && paymentRes) {
                setUserPaymentStats(paymentRes);
              }
            }
          }
        }

        // Fetch trending campaigns for recommendations
        const discoverList = await discoverCampaign();
        if (isMounted && Array.isArray(discoverList)) {
          setTrendingRecommendations(discoverList.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Derived user details
  const userFullName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || profile.emailAddress.split("@")[0]
    : "Explorer";

  const userInitial = userFullName.charAt(0).toUpperCase() || "P";
  const userRole = profile?.role || "Backer & Creator";

  // Campaigns lists
  const followedCampaigns = (profile?.projectsFollowed || [])
    .filter(Boolean)
    .map(normalizeCampaign);

  const createdCampaigns = (profile?.createdProjects || [])
    .filter(Boolean)
    .map(normalizeCampaign);

  // Financial & Escrow metrics
  const totalDonations = userPaymentStats?.totalDonations && userPaymentStats.totalDonations > 0
    ? userPaymentStats.totalDonations
    : followedCampaigns.length > 0 ? 530 : 0;

  const availableCashback = userPaymentStats?.totalRewards && userPaymentStats.totalRewards > 0
    ? userPaymentStats.totalRewards
    : (totalDonations * 0.12);

  // Gamified XP details
  const userXP = 4200;
  const nextTierXP = 5000;
  const xpPercent = Math.min(Math.round((userXP / nextTierXP) * 100), 100);

  // Filtered campaigns
  const filteredFollowed = followedCampaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCreated = createdCampaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Milestone voting simulation
  const handleVoteMilestone = (milestoneId: string, milestoneName: string) => {
    setVotedMilestones((prev) => ({ ...prev, [milestoneId]: true }));
    setVoteToast(`Audit vote recorded for "${milestoneName}"! +250 XP added to your Backer Guild profile.`);
    setTimeout(() => setVoteToast(null), 4000);
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-20 relative">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center animate-spin">
            <FiRefreshCw className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="font-heading font-bold text-lg text-white mb-1">
              Loading Mission Control...
            </h3>
            <p className="text-xs text-slate-400">
              Synchronizing non-custodial escrow balances & backer credentials
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[38rem] h-[38rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-[32rem] h-[32rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">

        {/* ============================================================== */}
        {/* EXECUTIVE MISSION CONTROL HEADER */}
        {/* ============================================================== */}
        <div className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/15 via-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            {/* User Identity Preview */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-600 p-[2px] shadow-lg">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center font-heading font-black text-2xl sm:text-3xl text-white">
                    {userInitial}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-xs text-amber-400 shadow-md">
                  <FaCrown className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-heading font-black text-xl sm:text-2xl text-white">
                    Welcome back, {userFullName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                    <FaGem className="w-3 h-3 text-indigo-400" />
                    <span>Silver Champion</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  {profile?.emailAddress} • Role: <span className="text-slate-300 font-medium capitalize">{userRole}</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <FiCheckCircle className="w-3.5 h-3.5" /> Backer Protocol Verified
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-indigo-400 flex items-center gap-1">
                    <FiShield className="w-3.5 h-3.5" /> Non-Custodial Escrow
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Link
                to="/create"
                className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-heading font-bold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all"
              >
                <FaRocket className="w-3.5 h-3.5" />
                <span>Start a Project</span>
              </Link>

              <Link
                to="/discover"
                className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-heading font-semibold text-xs border border-slate-700/80 flex items-center justify-center gap-2 transition-colors"
              >
                <FiCompass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Discover Campaigns</span>
              </Link>

              <Link
                to="/rewards"
                className="py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-indigo-300 font-heading font-semibold text-xs border border-indigo-500/30 flex items-center justify-center gap-2 transition-colors"
              >
                <FaCoins className="w-3.5 h-3.5 text-amber-400" />
                <span>Rewards Vault</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* FINANCIAL & ESCROW METRICS (4 CARDS) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Card 1: Lifetime Pledged in Escrow */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Lifetime Backed
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FiDollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-emerald-400">
                ${totalDonations.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">USD</span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <FaShieldAlt className="w-3 h-3 text-emerald-400" />
              <span>100% Phased Escrow Protected</span>
            </p>
          </div>

          {/* Card 2: Backed & Followed Projects */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Backed Projects
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <FiLayers className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-white">
                {followedCampaigns.length}
              </span>
              <span className="text-xs text-slate-400">Active</span>
            </div>
            <p className="text-xs text-slate-400">
              {followedCampaigns.length > 0 ? "Tracking live milestone releases" : "Explore projects to back today"}
            </p>
          </div>

          {/* Card 3: Launched Campaigns */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Created Campaigns
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FaRocket className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-amber-400">
                {createdCampaigns.length}
              </span>
              <span className="text-xs text-slate-400">Launched</span>
            </div>
            <p className="text-xs text-slate-400">
              {createdCampaigns.length > 0 ? "Managing deliverables & tranches" : "Ready to launch your vision?"}
            </p>
          </div>

          {/* Card 4: Available Escrow Cashback */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 relative overflow-hidden group hover:border-teal-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Escrow Credit
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <FaCoins className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-teal-400">
                ${availableCashback.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">USD</span>
            </div>
            <Link
              to="/rewards"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Redeem in Rewards Vault</span>
              <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Milestone Audit Vote Toast */}
        {voteToast && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{voteToast}</span>
            </div>
            <Link to="/rewards" className="font-bold underline text-emerald-400 shrink-0 hover:text-emerald-300 ml-4">
              View XP &rarr;
            </Link>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB NAVIGATION & SEARCH CONTROLS */}
        {/* ============================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab("followed")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "followed"
                  ? "bg-emerald-500 text-slate-950 shadow-glow-emerald"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <FiHeart className="w-3.5 h-3.5" />
              <span>Backed Projects</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === "followed" ? "bg-slate-950/30 text-slate-950" : "bg-slate-800 text-slate-300"}`}>
                {followedCampaigns.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("created")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "created"
                  ? "bg-emerald-500 text-slate-950 shadow-glow-emerald"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <FaRocket className="w-3.5 h-3.5" />
              <span>My Campaigns</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === "created" ? "bg-slate-950/30 text-slate-950" : "bg-slate-800 text-slate-300"}`}>
                {createdCampaigns.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("milestones")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "milestones"
                  ? "bg-emerald-500 text-slate-950 shadow-glow-emerald"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <FaShieldAlt className="w-3.5 h-3.5" />
              <span>Milestone Audits</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === "milestones" ? "bg-slate-950/30 text-slate-950" : "bg-slate-800 text-slate-300"}`}>
                {mockMilestones.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("ledger")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "ledger"
                  ? "bg-emerald-500 text-slate-950 shadow-glow-emerald"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <FiClock className="w-3.5 h-3.5" />
              <span>Escrow Ledger</span>
            </button>
          </div>

          {/* Search bar within followed/created lists */}
          {(activeTab === "followed" || activeTab === "created") && (
            <div className="relative w-full md:w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Filter campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: BACKED & FOLLOWED CAMPAIGNS */}
        {/* ============================================================== */}
        {activeTab === "followed" && (
          <div>
            {filteredFollowed.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredFollowed.map((campaign) => (
                  <CampaignCard key={campaign._id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <div className="space-y-10 mb-12">
                {/* Empty State Card */}
                <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xl">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                    <FiLayers />
                  </div>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white mb-2">
                    No Backed Campaigns Yet
                  </h3>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    You haven't backed or followed any campaigns. Explore the latest hardware, games, and software innovations with non-custodial milestone escrow protection.
                  </p>
                  <Link
                    to="/discover"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-heading font-bold text-xs shadow-glow-emerald hover:opacity-95 transition-opacity"
                  >
                    <FiCompass className="w-4 h-4" />
                    <span>Explore Live Campaigns</span>
                  </Link>
                </div>

                {/* Recommended Campaigns Showcase */}
                {trendingRecommendations.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                          Recommended For You
                        </span>
                        <h4 className="font-heading font-bold text-lg text-white">
                          Trending Milestone Campaigns
                        </h4>
                      </div>
                      <Link
                        to="/discover"
                        className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <span>View All</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trendingRecommendations.map((campaign) => (
                        <CampaignCard key={campaign._id} campaign={normalizeCampaign(campaign)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: CREATED CAMPAIGNS (CREATOR MISSION CONTROL) */}
        {/* ============================================================== */}
        {activeTab === "created" && (
          <div>
            {filteredCreated.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredCreated.map((campaign) => (
                  <div key={campaign._id} className="flex flex-col space-y-3">
                    <CampaignCard campaign={campaign} />

                    {/* Creator Quick Actions Bar */}
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <Link
                        to={`/campaigns/campaign/${campaign._id}`}
                        className="text-slate-300 hover:text-emerald-400 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FiExternalLink className="w-3.5 h-3.5" />
                        <span>Public View</span>
                      </Link>

                      <Link
                        to={`/AddBlog/${campaign._id}`}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FaBullhorn className="w-3.5 h-3.5" />
                        <span>Post Update</span>
                      </Link>

                      <Link
                        to={`/BlogDashboard/${campaign._id}`}
                        className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FaEdit className="w-3.5 h-3.5" />
                        <span>Manage Updates</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xl mb-12">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                  <FaRocket />
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white mb-2">
                  Launch Your Breakthrough Project
                </h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  You haven't launched any campaigns yet. Turn your hardware, software, or community vision into reality with milestone-gated escrow funding and 0% upfront platform fees.
                </p>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-heading font-bold text-xs shadow-glow-emerald hover:opacity-95 transition-opacity"
                >
                  <FiPlusCircle className="w-4 h-4" />
                  <span>Start Your First Campaign</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MILESTONE DELIVERABLES & ESCROW AUDITS */}
        {/* ============================================================== */}
        {activeTab === "milestones" && (
          <div className="space-y-6 mb-12">
            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-300 flex items-start gap-3">
              <FaShieldAlt className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong>Milestone Governance Protocol:</strong> Pledged funds are unlocked sequentially in tranches. As a verified backer, your review and deliverable votes dictate whether funding tranches are safely released to creators.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {mockMilestones.map((ms) => {
                const isVoted = votedMilestones[ms.id];

                return (
                  <div
                    key={ms.id}
                    className="rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 sm:p-7 shadow-xl hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                          {ms.campaignName}
                        </span>
                        <h4 className="font-heading font-extrabold text-lg text-white">
                          {ms.phase}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            ms.status === "Audited & Released"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : ms.status === "Community Review"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          {ms.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {ms.dueDate}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                      <strong>Deliverable Notes:</strong> {ms.deliverableNotes}
                    </p>

                    {/* Tranche Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Tranche Funding Progress</span>
                        <span className="font-mono font-bold text-white">
                          ${((ms.targetAmount * ms.progressPercent) / 100).toLocaleString()} / ${ms.targetAmount.toLocaleString()} ({ms.progressPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                          style={{ width: `${ms.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <FiUsers className="w-3.5 h-3.5 text-indigo-400" />
                        <span>348 Community Backer Votes Cast</span>
                      </span>

                      {ms.status === "Community Review" && (
                        <div className="flex items-center gap-2">
                          {isVoted ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                              <FiCheckCircle className="w-4 h-4" /> Vote Verified (+250 XP)
                            </span>
                          ) : (
                            <button
                              onClick={() => handleVoteMilestone(ms.id, ms.phase)}
                              className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <HiSparkles className="w-3.5 h-3.5" />
                              <span>Audit & Approve Tranche</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: TRANSACTION & ESCROW LEDGER */}
        {/* ============================================================== */}
        {activeTab === "ledger" && (
          <div className="rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 overflow-hidden shadow-xl mb-12">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-heading font-extrabold text-lg text-white">
                  Payment History & Escrow Records
                </h4>
                <p className="text-xs text-slate-400">
                  Every contribution is logged on the non-custodial smart escrow ledger.
                </p>
              </div>
              <button
                onClick={() => alert("Downloading official PDF statement...")}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <FiFileText className="w-3.5 h-3.5" />
                <span>Export Statement</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                    <th className="py-3.5 px-6">Transaction ID</th>
                    <th className="py-3.5 px-6">Campaign</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6">Cashback</th>
                    <th className="py-3.5 px-6">Method</th>
                    <th className="py-3.5 px-6 text-right">Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {mockTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-400">{tx.id}</td>
                      <td className="py-4 px-6 font-bold text-white">{tx.campaign}</td>
                      <td className="py-4 px-6 text-slate-400">{tx.date}</td>
                      <td className="py-4 px-6 text-white font-mono font-bold">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-emerald-400 font-mono font-bold">
                        +${tx.escrowCredit.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-slate-300">{tx.method}</td>
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <FiCheckCircle className="w-3 h-3" /> {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* GAMIFIED GUILD XP ACCELERATOR BANNER */}
        {/* ============================================================== */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl shrink-0">
                <FaGem />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-base sm:text-lg text-white mb-1">
                  Backer Guild Tier: Silver Champion ({userXP.toLocaleString()} XP)
                </h4>
                <p className="text-xs text-slate-400">
                  Earn 800 more XP to unlock Gold Patron with 15% cashback and direct creator AMAs.
                </p>
              </div>
            </div>

            <div className="w-full md:w-64">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Tier Progress</span>
                <span className="text-emerald-400 font-bold">{xpPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            <Link
              to="/rewards"
              className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs border border-slate-700 shrink-0 flex items-center gap-2 transition-colors"
            >
              <span>View Rewards Vault</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
