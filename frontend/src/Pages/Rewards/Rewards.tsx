import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiAward,
  FiZap,
  FiClock,
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiCopy,
  FiCheck,
  FiDollarSign,
  FiShield,
  FiX,
  FiUser,
  FiExternalLink,
} from "react-icons/fi";
import {
  FaGem,
  FaCrown,
  FaGift,
  FaRocket,
  FaTrophy,
  FaCoins,
  FaVideo,
  FaBook,
  FaTicketAlt,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Footer from "../../Components/Footer/Footer";
import { getUserInTheSession } from "../../Utils/SessionStorage";
import { getUserPayments } from "../../services/userServices";

interface RewardItem {
  id: string;
  title: string;
  category: "digital" | "physical" | "access";
  tierRequired: "Bronze" | "Silver" | "Gold" | "Diamond";
  tierMinXP: number;
  description: string;
  valueEst: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  claimed?: boolean;
  claimCode?: string;
  details: string;
}

const TIER_THRESHOLDS = {
  Bronze: { min: 0, max: 1999, multiplier: "1.0x", cashback: "10%", badgeColor: "text-amber-500", borderColor: "border-amber-500/40" },
  Silver: { min: 2000, max: 4999, multiplier: "1.25x", cashback: "12%", badgeColor: "text-slate-300", borderColor: "border-slate-400/40" },
  Gold: { min: 5000, max: 9999, multiplier: "1.5x", cashback: "15%", badgeColor: "text-amber-400", borderColor: "border-amber-400/40" },
  Diamond: { min: 10000, max: 25000, multiplier: "2.0x", cashback: "20%", badgeColor: "text-cyan-400", borderColor: "border-cyan-400/40" },
};

const initialRewardsList: RewardItem[] = [
  {
    id: "rw-1",
    title: 'The Hardware Maker\'s Blueprint & Schematics',
    category: "digital",
    tierRequired: "Bronze",
    tierMinXP: 500,
    description: "Full-color 140-page architectural PDF, PCB CAD diagrams, and prototyping checklist from top funded creators.",
    valueEst: "$45 Value",
    icon: FaBook,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    claimed: true,
    claimCode: "PILOT-BLUEPRINT-2026",
    details: "Instantly download the verified maker handbook and schematic files packaged for Eagle/KiCad.",
  },
  {
    id: "rw-2",
    title: "Official Backer Guild Enamel Pin & Holographic Pack",
    category: "physical",
    tierRequired: "Silver",
    tierMinXP: 2000,
    description: "Solid zinc-alloy laser-cut backer badge pin with holographic collector stickers mailed worldwide.",
    valueEst: "$30 Value",
    icon: FaGift,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    claimed: false,
    details: "Physical shipment via expedited courier. Claiming locks your shipping address for the next production batch.",
  },
  {
    id: "rw-3",
    title: "Personalized Video Shoutout from Campaign Founder",
    category: "access",
    tierRequired: "Silver",
    tierMinXP: 2500,
    description: "Receive a dedicated 2-minute personalized video greeting and milestone breakdown directly from the creator.",
    valueEst: "$75 Value",
    icon: FaVideo,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    claimed: false,
    details: "Creators record and deliver via private unlisted link within 7 business days of milestone approval.",
  },
  {
    id: "rw-4",
    title: "Closed Alpha / Beta Software Access Key",
    category: "digital",
    tierRequired: "Silver",
    tierMinXP: 3000,
    description: "Early access activation key to test creator beta software, developer APIs, and firmware builds before public rollout.",
    valueEst: "$120 Value",
    icon: FiZap,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    claimed: true,
    claimCode: "BETA-NX-7842-PILOT",
    details: "Redeemable in the creator portal or Steam/GitHub test flight release tracks.",
  },
  {
    id: "rw-5",
    title: "Commemorative Founder 3D Figurine Voucher",
    category: "physical",
    tierRequired: "Gold",
    tierMinXP: 5000,
    description: "Hand-finished resin collectible figurine celebrating PledgePilot's inaugural escrow cohort.",
    valueEst: "$150 Value",
    icon: FaTrophy,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    claimed: false,
    details: "Individually serialized collector art piece. Includes certificate of authenticity and on-chain verification.",
  },
  {
    id: "rw-6",
    title: "VIP Creator Studio & Lab Virtual Backstage Tour",
    category: "access",
    tierRequired: "Gold",
    tierMinXP: 6000,
    description: "Live interactive 60-minute virtual workshop and hardware teardown session with lead engineers.",
    valueEst: "$200 Value",
    icon: FaTicketAlt,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    claimed: false,
    details: "Scheduled quarterly. VIP attendees can ask live questions and review upcoming unannounced prototypes.",
  },
  {
    id: "rw-7",
    title: "Laser-Engraved Titanium Backer Smart Keycard",
    category: "physical",
    tierRequired: "Diamond",
    tierMinXP: 10000,
    description: "Aerospace-grade titanium card with NFC authentication chip linking to your on-chain backer reputation vault.",
    valueEst: "$350 Value",
    icon: FaCrown,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    claimed: false,
    details: "Custom engraved with your Backer Guild ID and founding badge status. Shipped in premium velvet presentation box.",
  },
  {
    id: "rw-8",
    title: "Annual Backer Summit & Escrow Council Seat",
    category: "access",
    tierRequired: "Diamond",
    tierMinXP: 15000,
    description: "Exclusive governance voting seat on community escrow dispute panels and guest pass to annual summit.",
    valueEst: "Priceless",
    icon: FaGem,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    claimed: false,
    details: "Allows staking governance votes on contested milestone releases and direct protocol roadmap suggestions.",
  },
];

const mockRecentActivity = [
  {
    campaign: "ChronoForge Modular Smartwatch",
    date: "Oct 24, 2026",
    pledge: 250,
    xpEarned: 312,
    rewardCredit: 30.0,
    status: "Credited",
  },
  {
    campaign: "Solaria Portable Solar Tent",
    date: "Oct 12, 2026",
    pledge: 180,
    xpEarned: 225,
    rewardCredit: 21.6,
    status: "Credited",
  },
  {
    campaign: "NebulaOS Open-Source Station",
    date: "Sep 28, 2026",
    pledge: 100,
    xpEarned: 125,
    rewardCredit: 12.0,
    status: "Credited",
  },
];

export const Rewards: React.FC = () => {
  const navigate = useNavigate();
  const sessionUser = getUserInTheSession();

  // Redirect or guard if user is not logged in
  useEffect(() => {
    if (!sessionUser) {
      navigate("/login?redirect=/rewards");
    }
  }, [sessionUser, navigate]);

  const [rewardsList, setRewardsList] = useState<RewardItem[]>(initialRewardsList);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "digital" | "physical" | "access">("all");
  const [userPaymentStats, setUserPaymentStats] = useState<{ totalDonations: number; totalRewards: number } | null>(null);

  // Modal / Claim Action State
  const [activeModalReward, setActiveModalReward] = useState<RewardItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);
  const [redeemCreditsSuccess, setRedeemCreditsSuccess] = useState<boolean>(false);

  // Dynamic user data
  const userFullName =
    sessionUser?.firstName && sessionUser?.lastName
      ? `${sessionUser.firstName} ${sessionUser.lastName}`
      : sessionUser?.name || sessionUser?.emailAddress?.split("@")[0] || "Backer";

  const userEmail = sessionUser?.emailAddress || "backer@pledgepilot.io";
  const userInitial = userFullName.charAt(0).toUpperCase();

  // Load user payment stats from API
  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const userId = sessionUser?._id || sessionUser?.id || sessionUser?.Id;
        if (userId) {
          const res = await getUserPayments(userId);
          if (isMounted && res) {
            setUserPaymentStats({
              totalDonations: typeof res.totalDonations === "number" ? res.totalDonations : 0,
              totalRewards: typeof res.totalRewards === "number" ? res.totalRewards : 0,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load user payments:", err);
      }
    };

    if (sessionUser) {
      fetchStats();
    }

    return () => {
      isMounted = false;
    };
  }, [sessionUser]);

  // Derived XP and Gamified Tier Calculations
  // Base 4,200 XP for active verified demo account or calculated from donations
  const totalDonations = userPaymentStats?.totalDonations && userPaymentStats.totalDonations > 0
    ? userPaymentStats.totalDonations
    : 530;

  const availableRewardsCredit = userPaymentStats?.totalRewards && userPaymentStats.totalRewards > 0
    ? userPaymentStats.totalRewards
    : (totalDonations * 0.12);

  const userXP = 4200; // Baseline current active demo backer XP
  const nextTierXP = 5000;
  const currentTierName: keyof typeof TIER_THRESHOLDS = "Silver";
  const xpProgressPercent = Math.min(Math.round((userXP / nextTierXP) * 100), 100);
  const xpNeeded = nextTierXP - userXP;

  // Filter rewards
  const filteredRewards = rewardsList.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  // Handle Claiming
  const handleOpenClaimModal = (reward: RewardItem) => {
    setActiveModalReward(reward);
    setClaimSuccessMessage(null);
  };

  const handleConfirmClaim = () => {
    if (!activeModalReward) return;

    const generatedCode = `PILOT-${activeModalReward.tierRequired.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setRewardsList((prev) =>
      prev.map((item) =>
        item.id === activeModalReward.id
          ? { ...item, claimed: true, claimCode: generatedCode }
          : item
      )
    );

    setActiveModalReward((prev) => (prev ? { ...prev, claimed: true, claimCode: generatedCode } : null));
    setClaimSuccessMessage(`Perk successfully redeemed! Instructions & verification voucher have been recorded.`);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRedeemCreditsToNextCampaign = () => {
    setRedeemCreditsSuccess(true);
    setTimeout(() => setRedeemCreditsSuccess(false), 4000);
  };

  // If user is not logged in, show access guard fallback
  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-20 relative">
        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5 text-2xl">
            <FiLock />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-white mb-2">
            Backer Rewards Vault
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            The Backer Guild Rewards and Milestone Cashback vault is exclusively accessible to verified logged-in backers.
          </p>
          <div className="space-y-3">
            <Link
              to="/login?redirect=/rewards"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-heading font-bold text-sm shadow-glow-emerald flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            >
              <FiUser className="w-4 h-4" />
              <span>Log In to View Rewards</span>
            </Link>
            <Link
              to="/register"
              className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-heading font-semibold text-sm border border-slate-700/60 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Create Free Account</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[36rem] h-[36rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-72 right-10 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">
        
        {/* ============================================================== */}
        {/* TOP HERO & USER STATUS BANNER */}
        {/* ============================================================== */}
        <div className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/15 via-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            {/* User Avatar + Identity */}
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
                  <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                    {userFullName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                    <FaGem className="w-3 h-3 text-indigo-400" />
                    <span>{currentTierName} Champion Tier</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  {userEmail} • Backer ID: <span className="text-slate-300 font-mono">PLT-88219</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <FiCheckCircle className="w-3.5 h-3.5" /> Identity Verified
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-indigo-400 flex items-center gap-1">
                    <FiShield className="w-3.5 h-3.5" /> Milestone Escrow Protected
                  </span>
                </div>
              </div>
            </div>

            {/* Backer XP Progress Bar */}
            <div className="w-full lg:w-96 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <FiAward className="w-4 h-4 text-amber-400" />
                  <span>Guild XP Progress</span>
                </span>
                <span className="font-heading font-bold text-white">
                  <span className="text-emerald-400">{userXP.toLocaleString()}</span> / {nextTierXP.toLocaleString()} XP
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span>{xpProgressPercent}% Completed</span>
                <span className="text-amber-400 font-medium">
                  {xpNeeded} XP to Gold Patron
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* REWARDS WALLET & PERKS METRICS GRID */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Card 1: Available Escrow Credit */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Available Reward Credit
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FaCoins className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-emerald-400">
                ${availableRewardsCredit.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">USD</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              12% escrow backing cashback available for your next pledge.
            </p>
            <button
              onClick={handleRedeemCreditsToNextCampaign}
              className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <HiSparkles className="w-3.5 h-3.5" />
              <span>Apply to Next Pledge</span>
            </button>
          </div>

          {/* Card 2: Total Backed Volume */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Lifetime Backed
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <FiDollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-white">
                ${totalDonations.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">USD</span>
            </div>
            <p className="text-xs text-slate-400">
              Contributed across 3 verified campaigns in non-custodial escrow.
            </p>
          </div>

          {/* Card 3: Active Tier Multipliers */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Multiplier
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FiZap className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-amber-400">
                1.25x
              </span>
              <span className="text-xs text-slate-400">XP Boost</span>
            </div>
            <p className="text-xs text-slate-400">
              Silver perk: Earn +25% bonus XP on every milestone verification.
            </p>
          </div>

          {/* Card 4: Unlocked Perks */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 relative overflow-hidden group hover:border-teal-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Guild Perks
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <FaGift className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-teal-400">
                4 / 8
              </span>
              <span className="text-xs text-slate-400">Available</span>
            </div>
            <p className="text-xs text-slate-400">
              2 claimed • 2 ready to redeem in Silver tier catalog.
            </p>
          </div>
        </div>

        {/* Success Toast for Credit Redemption */}
        {redeemCreditsSuccess && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>Escrow Credit Active!</strong> Your ${availableRewardsCredit.toFixed(2)} balance will automatically be deducted at checkout on your next backed campaign.
              </span>
            </div>
            <Link to="/discover" className="font-bold underline text-emerald-400 ml-4 shrink-0 hover:text-emerald-300">
              Explore Campaigns &rarr;
            </Link>
          </div>
        )}

        {/* ============================================================== */}
        {/* BACKER GUILD TIERS SHOWCASE */}
        {/* ============================================================== */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <FaGem className="w-3.5 h-3.5" />
                <span>Guild Status Roadmap</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">
                Backer Tier Progression & Privileges
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Your tier elevates automatically as you back projects, audit milestone releases, and participate in community voting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Bronze Pioneer */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                    Level 1
                  </span>
                  <span className="text-xs text-slate-500 font-mono">0 - 1,999 XP</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">
                  Bronze Pioneer
                </h3>
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>1.0x Base XP Multiplier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>10% Escrow Cashback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Backer Discord Community Access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Standard Milestone Voting Weight</span>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-slate-800 text-center">
                <span className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
                  <FiCheckCircle className="w-3.5 h-3.5" /> Unlocked
                </span>
              </div>
            </div>

            {/* Silver Champion (ACTIVE / CURRENT) */}
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/20 border-2 border-emerald-500/60 p-5 relative flex flex-col justify-between shadow-glow-emerald">
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] tracking-wide uppercase shadow-md flex items-center gap-1">
                <FaCrown className="w-2.5 h-2.5" /> Your Current Tier
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Level 2
                  </span>
                  <span className="text-xs text-slate-400 font-mono">2,000 - 4,999 XP</span>
                </div>
                <h3 className="font-heading font-extrabold text-lg text-emerald-400 mb-2">
                  Silver Champion
                </h3>
                <ul className="space-y-2 text-xs text-slate-200 mb-6">
                  <li className="flex items-start gap-2 font-medium">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>1.25x XP Multiplier (+25%)</span>
                  </li>
                  <li className="flex items-start gap-2 font-medium">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>12% Escrow Cashback Bonus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>2-Hour Early Bird Launch Alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Silver Backer Hexagonal Profile Ring</span>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-slate-800 text-center">
                <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <HiSparkles className="w-3.5 h-3.5" /> Active Benefits
                </span>
              </div>
            </div>

            {/* Gold Patron */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Level 3
                  </span>
                  <span className="text-xs text-slate-500 font-mono">5,000 - 9,999 XP</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">
                  Gold Patron
                </h3>
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  <li className="flex items-start gap-2">
                    <FiLock className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                    <span>1.5x XP Multiplier (+50%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiLock className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                    <span>15% Escrow Cashback Bonus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiLock className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                    <span>Direct Creator Video Q&A Invites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiLock className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                    <span>2x Milestone Audit Voting Weight</span>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-slate-800 text-center">
                <span className="text-xs font-semibold text-amber-400 flex items-center justify-center gap-1">
                  <FiLock className="w-3.5 h-3.5" /> {xpNeeded} XP Needed
                </span>
              </div>
            </div>

            {/* Diamond Guildmaster */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Level 4
                  </span>
                  <span className="text-xs text-slate-500 font-mono">10,000+ XP</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">
                  Diamond Guildmaster
                </h3>
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  <li className="flex items-start gap-2">
                    <FiLock className="w-3.5 h-3.5 text-cyan-400/80 shrink-0 mt-0.5" />
                    <span>2.0x XP Multiplier (+100%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiLock className="w-3.5 h-3.5 text-cyan-400/80 shrink-0 mt-0.5" />
                    <span>20% Escrow Cashback Bonus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiLock className="w-3.5 h-3.5 text-cyan-400/80 shrink-0 mt-0.5" />
                    <span>Physical Swag Box & Titanium Card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiLock className="w-3.5 h-3.5 text-cyan-400/80 shrink-0 mt-0.5" />
                    <span>0% Platform Escrow Processing Fees</span>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-slate-800 text-center">
                <span className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
                  <FiLock className="w-3.5 h-3.5" /> Locked
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* REWARDS CATALOG & PERKS REDEMPTION */}
        {/* ============================================================== */}
        <section className="mb-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <FaGift className="w-3.5 h-3.5" />
                <span>Rewards Vault</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">
                Exclusive Backer Perks & Collectibles
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedCategory === "all"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Perks
              </button>
              <button
                onClick={() => setSelectedCategory("digital")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedCategory === "digital"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Digital Perks
              </button>
              <button
                onClick={() => setSelectedCategory("physical")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedCategory === "physical"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Physical Swag
              </button>
              <button
                onClick={() => setSelectedCategory("access")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedCategory === "access"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Creator Access
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => {
              const IconComponent = reward.icon;
              const isLocked = userXP < reward.tierMinXP;
              const isClaimed = reward.claimed;

              return (
                <div
                  key={reward.id}
                  className={`rounded-3xl bg-slate-900/80 backdrop-blur-md border transition-all duration-200 p-6 flex flex-col justify-between group ${
                    isClaimed
                      ? "border-emerald-500/30 bg-emerald-950/10"
                      : isLocked
                      ? "border-slate-800/80 opacity-75"
                      : "border-slate-800 hover:border-slate-700 hover:shadow-xl hover:-translate-y-0.5"
                  }`}
                >
                  <div>
                    {/* Header: Category Badge + Value */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            reward.tierRequired === "Bronze"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : reward.tierRequired === "Silver"
                              ? "bg-slate-300/10 text-slate-300 border-slate-400/20"
                              : reward.tierRequired === "Gold"
                              ? "bg-amber-400/10 text-amber-300 border-amber-400/20"
                              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                          }`}
                        >
                          {reward.tierRequired} Tier+
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {reward.tierMinXP.toLocaleString()} XP
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-slate-400">
                        {reward.valueEst}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 mb-3">
                      <div
                        className={`w-12 h-12 rounded-2xl ${reward.iconBg} ${reward.iconColor} flex items-center justify-center shrink-0 text-xl`}
                      >
                        <IconComponent />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {reward.title}
                        </h4>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-slate-800/80">
                    {isClaimed ? (
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <FiCheckCircle className="w-4 h-4" /> Claimed
                        </span>
                        {reward.claimCode && (
                          <button
                            onClick={() => handleCopyCode(reward.claimCode!)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
                          >
                            {copiedCode === reward.claimCode ? (
                              <>
                                <FiCheck className="text-emerald-400" /> Copied
                              </>
                            ) : (
                              <>
                                <FiCopy /> {reward.claimCode}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ) : isLocked ? (
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <FiLock className="w-3.5 h-3.5 text-amber-500/70" />
                          <span>Unlocks at {reward.tierRequired}</span>
                        </span>
                        <span className="text-slate-600 font-mono">
                          +{reward.tierMinXP - userXP} XP to unlock
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenClaimModal(reward)}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <HiSparkles className="w-3.5 h-3.5" />
                        <span>Claim Reward</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================== */}
        {/* RECENT REWARD ACTIVITY & ESCROW LEDGER */}
        {/* ============================================================== */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <FiClock className="w-3.5 h-3.5" />
                <span>Ledger Activity</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">
                Recent Escrow Cashback & XP History
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Pledges</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                    <th className="py-3.5 px-6">Backed Project</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Pledged</th>
                    <th className="py-3.5 px-6">XP Gained</th>
                    <th className="py-3.5 px-6">Escrow Cashback</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {mockRecentActivity.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>{item.campaign}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">{item.date}</td>
                      <td className="py-4 px-6 text-slate-200 font-mono font-semibold">
                        ${item.pledge.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-emerald-400 font-bold font-mono">
                        +{item.xpEarned} XP
                      </td>
                      <td className="py-4 px-6 text-indigo-400 font-bold font-mono">
                        +${item.rewardCredit.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <FiCheckCircle className="w-3 h-3" /> {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* HOW TO EARN MORE REWARDS (GAMIFICATION GUIDE) */}
        {/* ============================================================== */}
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 p-8 sm:p-10 mb-10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                <FiZap className="w-4 h-4" />
                <span>Accelerate Leveling</span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mb-3">
                How to Earn More XP & Escrow Rewards
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Backing campaigns is just one way to progress through the Backer Guild. Earn high-multiplier rewards by actively participating in the protocol ecosystem.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">
                    1. Back Projects
                  </span>
                  <span className="text-slate-400">
                    Earn 10 XP per $1 backed + 10-20% tier cashback.
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-indigo-400 block mb-1">
                    2. Audit Milestones
                  </span>
                  <span className="text-slate-400">
                    Earn +250 XP per deliverable review and verified tranche vote.
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">
                    3. Invite Backers
                  </span>
                  <span className="text-slate-400">
                    Receive +500 XP and $15 escrow credit per funded referral.
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-3 w-full sm:w-auto">
              <Link
                to="/discover"
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-heading font-bold text-sm shadow-glow-emerald hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                <FaRocket className="w-4 h-4" />
                <span>Explore Live Campaigns</span>
              </Link>
              <Link
                to="/about"
                className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-heading font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Read Protocol Escrow Docs</span>
                <FiExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ============================================================== */}
      {/* CLAIM REWARD MODAL */}
      {/* ============================================================== */}
      {activeModalReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveModalReward(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-14 h-14 rounded-2xl ${activeModalReward.iconBg} ${activeModalReward.iconColor} flex items-center justify-center text-2xl shrink-0`}
              >
                <activeModalReward.icon />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  {activeModalReward.tierRequired} Tier Perk
                </span>
                <h3 className="font-heading font-extrabold text-xl text-white">
                  {activeModalReward.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              {activeModalReward.description}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Fulfillment Category:</span>
                <span className="font-bold text-white capitalize">
                  {activeModalReward.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Estimated Value:</span>
                <span className="font-bold text-emerald-400">
                  {activeModalReward.valueEst}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Redemption Delivery:</span>
                <span className="font-mono text-slate-300">
                  {activeModalReward.details}
                </span>
              </div>
            </div>

            {/* Success Message or Action */}
            {claimSuccessMessage ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  <p className="font-bold flex items-center gap-2 mb-1">
                    <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Redemption Confirmed!</span>
                  </p>
                  <p>{claimSuccessMessage}</p>
                </div>

                {activeModalReward.claimCode && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Voucher Redemption Key
                      </span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {activeModalReward.claimCode}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(activeModalReward.claimCode!)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedCode === activeModalReward.claimCode ? (
                        <>
                          <FiCheck className="text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <FiCopy /> Copy Key
                        </>
                      )}
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setActiveModalReward(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleConfirmClaim}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-heading font-bold text-sm shadow-glow-emerald hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                >
                  <HiSparkles className="w-4 h-4" />
                  <span>Confirm & Redeem Perk</span>
                </button>
                <button
                  onClick={() => setActiveModalReward(null)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-heading font-semibold text-xs border border-slate-700/60 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Rewards;
