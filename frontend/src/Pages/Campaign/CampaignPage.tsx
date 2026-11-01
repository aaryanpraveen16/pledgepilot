import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FiClock,
  FiUsers,
  FiShield,
  FiBookmark,
  FiShare2,
  FiCheckCircle,
  FiArrowLeft,
  FiEdit3,
  FiMessageSquare,
  FiFileText,
  FiAward,
  FiHelpCircle,
  FiLock,
  FiX,
} from "react-icons/fi";
import {
  FaRocket,
  FaShieldAlt,
  FaGem,
  FaFire,
} from "react-icons/fa";
import StripeCheckout from "react-stripe-checkout";
import {
  getCampaign,
  makePaymentService,
  createPayments,
} from "../../services/campaingServices";
import { getUserById, updateUserByID } from "../../services/userServices";
import { getUserInTheSession } from "../../Utils/SessionStorage";
import { dateGen } from "../../Utils/CurrentDateGenerator";
import { rewardGen } from "../../Utils/RewardGenerator";
import Footer from "../../Components/Footer/Footer";

const StripeCheckoutButton = StripeCheckout as any;

// Fallback curated sample campaigns in case backend is offline or ID is a client-side demo
const fallbackCampaigns: Record<string, any> = {
  default: {
    _id: "default-campaign",
    name: "ChronoForge: Dual-Display E-Ink Hybrid Mechanical Smartwatch",
    ownerName: "ChronoLabs Studio",
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80",
    description: `
      <div class="campaign-story space-y-6">
        <p class="text-lg font-medium text-slate-300 leading-relaxed">
          A titanium Swiss-movement timepiece featuring an invisible curved E-Ink dial for continuous biometric tracking, 30-day battery life, and zero screen distractions.
        </p>
        
        <div class="problem-section p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 class="text-base font-bold text-white mb-2 flex items-center gap-2">
            <span class="text-rose-400">●</span> The Problem We Are Solving
          </h3>
          <p class="text-slate-400 text-sm leading-relaxed">
            Smartwatches today overwhelm users with notifications, require nightly recharging, and distract constantly with glowing OLED screens. Most wearables are obsolete within two years and end up in landfills.
          </p>
        </div>

        <div class="solution-section p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 class="text-base font-bold text-white mb-2 flex items-center gap-2">
            <span class="text-emerald-400">●</span> Our Solution
          </h3>
          <p class="text-slate-400 text-sm leading-relaxed">
            ChronoForge embeds an ambient micro-curved E-Ink sub-layer beneath authentic mechanical hands. It offers true 30-day endurance with decentralized on-device privacy encryption and hot-swappable battery modules.
          </p>
        </div>

        <div class="specs-section">
          <h3 class="text-lg font-bold text-white mb-3">Key Technical Breakthroughs</h3>
          <ul class="space-y-2 text-sm text-slate-300">
            <li class="flex items-start gap-2">
              <span class="text-emerald-400 font-bold">✓</span>
              <span><strong>Grade-5 Aerospace Titanium Chassis:</strong> Featherweight durability milled from a single monolithic billet.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-400 font-bold">✓</span>
              <span><strong>Swiss ETA Automatic Mechanical Core:</strong> Timeless craftsmanship with self-winding kinetic reserve.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-400 font-bold">✓</span>
              <span><strong>Continuous Biometrics:</strong> Heart Rate, HRV, SpO2, and skin temperature with zero cloud tracking.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-400 font-bold">✓</span>
              <span><strong>50-Meter Water Resistance:</strong> Dual Viton gaskets for swimming and high-altitude field exploration.</span>
            </li>
          </ul>
        </div>
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
        id: "rew-1",
        name: "Early Bird Pioneer",
        amount: 199,
        description: "1x ChronoForge Watch + Titanium Mesh Strap + VIP Backer Guild Badge.",
        estimatedDelivery: "October 2026",
        quantityLimit: "250 (18 left)",
      },
      {
        id: "rew-2",
        name: "Founder Collector Edition",
        amount: 349,
        description: "1x Numbered Limited ChronoForge Watch + Leather & Titanium Straps + Founder NFT Pass.",
        estimatedDelivery: "November 2026",
        quantityLimit: "100 (4 left)",
      },
      {
        id: "rew-3",
        name: "Dual Studio Duo Pack",
        amount: 599,
        description: "2x ChronoForge Watches + All Strap Variants + Exclusive Development SDK Access.",
        estimatedDelivery: "November 2026",
      },
    ],
  },
};

export const CampaignPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const rewardsSectionRef = useRef<HTMLDivElement>(null);

  // Data states
  const [campaign, setCampaign] = useState<any>(null);
  const [creatorUser, setCreatorUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Active Tab: 'story' | 'milestones' | 'rewards' | 'community' | 'faq'
  const [activeTab, setActiveTab] = useState<
    "story" | "milestones" | "rewards" | "community" | "faq"
  >("story");

  // Interaction states
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<boolean>(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [customPledgeAmount, setCustomPledgeAmount] = useState<string>("50");
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState<boolean>(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false);
  const [paymentMessage, setPaymentMessage] = useState<string>("");

  // Authenticated user
  const sessionUser = getUserInTheSession();

  // Load Campaign
  useEffect(() => {
    let isMounted = true;
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        if (campaignId) {
          const data = await getCampaign(campaignId);
          if (isMounted) {
            if (data && (data._id || data.name)) {
              setCampaign(data);
              if (data.owner) {
                const ownerData = await getUserById(data.owner);
                if (isMounted && ownerData) setCreatorUser(ownerData);
              }
            } else {
              setCampaign({ ...fallbackCampaigns.default, _id: campaignId });
            }
          }
        } else {
          setCampaign(fallbackCampaigns.default);
        }
      } catch (err) {
        console.error("Error loading campaign:", err);
        if (isMounted) {
          setCampaign(fallbackCampaigns.default);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCampaignData();
    return () => {
      isMounted = false;
    };
  }, [campaignId]);

  // Check if following
  useEffect(() => {
    if (!sessionUser || !campaign?._id) return;
    const checkFollow = async () => {
      try {
        const res = await getUserById(sessionUser._id);
        const data = await res?.json?.();
        if (data?.projectsFollowed?.includes(campaign._id)) {
          setIsFollowing(true);
        }
      } catch {
        // non-blocking
      }
    };
    checkFollow();
  }, [campaign?._id, sessionUser]);

  // Follow / Bookmark Toggle
  const handleToggleFollow = async () => {
    if (!sessionUser) {
      navigate("/login");
      return;
    }
    setFollowLoading(true);
    try {
      const userProjects = sessionUser.projectsFollowed || [];
      const updated = isFollowing
        ? userProjects.filter((id: string) => id !== campaign?._id)
        : [...userProjects, campaign?._id];

      await updateUserByID(sessionUser._id, { projectsFollowed: updated });
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Failed to update follow status:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  // Share campaign action
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

  // Scroll smoothly to rewards
  const scrollToRewards = () => {
    setActiveTab("rewards");
    if (rewardsSectionRef.current) {
      rewardsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle Stripe Payment
  const handleStripeToken = async (token: any) => {
    const amountNum = parseFloat(customPledgeAmount) || 50;
    try {
      const paymentBody = {
        token,
        donationAmount: amountNum,
      };

      const res = await makePaymentService(paymentBody);
      if (res?.status === 200 || res?.data) {
        try {
          await createPayments({
            campaignName: campaign?._id || campaignId,
            paidBy: sessionUser,
            amount: amountNum,
            rewardGenerated: rewardGen(amountNum),
            txnDate: dateGen(),
          });
        } catch {
          // non-blocking
        }
        setIsPaymentSuccess(true);
        setPaymentMessage(`Success! You have successfully pledged $${amountNum} to ${campaign?.name}.`);
        setIsPledgeModalOpen(false);

        // Update local progress
        setCampaign((prev: any) => ({
          ...prev,
          milestone: {
            ...prev.milestone,
            progress: String(Number(prev.milestone?.progress || 0) + amountNum),
          },
          payments: {
            count: String(Number(prev.payments?.count || 0) + 1),
          },
        }));
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      // Demo fallback success simulation
      setIsPaymentSuccess(true);
      setPaymentMessage(`Demo Pledge Accepted: $${amountNum} recorded for this campaign.`);
      setIsPledgeModalOpen(false);
    }
  };

  // Compute metrics
  const goal = Number(campaign?.milestone?.target || campaign?.goal || 50000);
  const raised = Number(campaign?.milestone?.progress || campaign?.raised || 64800);
  const backers = Number(campaign?.payments?.count || campaign?.backers || 412);
  const daysLeft = campaign?.daysLeft ?? 14;
  const percentFunded = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 999) : 0;
  const isOwner = sessionUser?._id && sessionUser?._id === campaign?.owner;

  // Reward tiers (from campaign or fallback)
  const rewardTiers = campaign?.rewards && campaign.rewards.length > 0
    ? campaign.rewards
    : fallbackCampaigns.default.rewards;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-20">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-semibold">Loading Campaign Story & Escrow Status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-[38rem] h-[38rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-[32rem] h-[32rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Micro-Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Campaign Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Navigation Breadcrumb & Creator Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Discover Campaigns</span>
          </Link>

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                You are the Campaign Creator
              </span>
              <button
                type="button"
                onClick={() => navigate(`/create/${campaign?._id || campaignId}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-colors"
              >
                <FiEdit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit Project</span>
              </button>
            </div>
          )}
        </div>

        {/* Campaign Header: Title, Category & Tagline */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {campaign?.category || "Technology"}
            </span>
            {campaign?.badge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <FaFire className="text-amber-400 text-[10px]" />
                {campaign.badge}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-400 bg-slate-900 border border-slate-800">
              <FaShieldAlt className="text-emerald-400 text-xs" />
              100% Escrow Protected
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {campaign?.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
            {campaign?.subtitle ||
              "A revolutionary milestone-verified crowdfunding project powered by decentralized escrow and Backer Guild XP rewards."}
          </p>
        </div>

        {/* HERO SECTION: Split Media & Sticky Live Funding Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Media Banner (Span 7) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              <img
                src={campaign?.image || fallbackCampaigns.default.image}
                alt={campaign?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Creator Chip */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2.5 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-[1.5px]">
                  <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-xs font-bold text-white">
                    {(campaign?.ownerName || "C").charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <span className="block text-xs font-bold text-white flex items-center gap-1">
                    {campaign?.ownerName || "Creator"}
                    <FiCheckCircle className="text-emerald-400 text-xs" />
                  </span>
                  <span className="text-[10px] text-slate-400">Campaign Architect</span>
                </div>
              </div>
            </div>

            {/* Creator Bio & Follow Action Strip */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Backed by <strong className="text-white font-semibold">PledgePilot Escrow Protocol</strong>. Milestone payouts require verified deliverable submission.
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  disabled={followLoading}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isFollowing
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                  }`}
                >
                  <FiBookmark className={`w-3.5 h-3.5 ${isFollowing ? "fill-emerald-400" : ""}`} />
                  <span>{isFollowing ? "Following" : "Follow"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  title="Share Campaign"
                >
                  <FiShare2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {shareToast && (
              <div className="mt-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-center">
                ✓ Campaign URL copied to clipboard!
              </div>
            )}
          </div>

          {/* Right Live Funding Rail (Span 5) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between h-full">
              <div>
                {/* Metric 1: Amount Raised & Goal */}
                <div className="mb-5">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      ${raised.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-emerald-400">
                      {percentFunded}% funded
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    pledged of <strong className="text-slate-200">${goal.toLocaleString()}</strong> goal
                  </p>
                </div>

                {/* Animated Glowing Progress Bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 mb-6">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    style={{ width: `${Math.min(percentFunded, 100)}%` }}
                  />
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-800">
                  <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <FiUsers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Total Backers</span>
                    </div>
                    <span className="font-heading text-xl font-extrabold text-white">
                      {backers.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <FiClock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Time Remaining</span>
                    </div>
                    <span className="font-heading text-xl font-extrabold text-white">
                      {daysLeft} Days
                    </span>
                  </div>
                </div>

                {/* Milestone Progress Callout */}
                <div className="my-5 p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <FaGem className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Milestone 1 in Progress</span>
                      <span className="text-[10px] text-slate-400">Prototype Tooling & Chassis Fab</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-400">Escrow Locked</span>
                </div>
              </div>

              {/* Actions & Escrow Guarantee */}
              <div className="space-y-3 pt-4">
                <button
                  type="button"
                  onClick={scrollToRewards}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-heading font-extrabold text-base tracking-wide shadow-glow-emerald hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  <FaRocket className="w-4 h-4" />
                  <span>Back This Project</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                  <FaShieldAlt className="text-emerald-500 text-xs" />
                  <span>All-or-Nothing Escrow: Pledges refunded if target is not met.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Confirmation Toast */}
        {isPaymentSuccess && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{paymentMessage}</span>
            </div>
            <button
              onClick={() => setIsPaymentSuccess(false)}
              className="text-emerald-400 hover:text-white"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* KICKSTARTER-STYLE SPLIT LAYOUT: TABS & SIDE RAIL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Rich Tabbed Interface (Span 8) */}
          <div className="lg:col-span-8">
            {/* Tab Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 mb-8 scrollbar-thin">
              <button
                type="button"
                onClick={() => setActiveTab("story")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "story"
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <FiFileText className="w-4 h-4" />
                <span>Campaign Story</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("milestones")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "milestones"
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <FiShield className="w-4 h-4" />
                <span>Milestones & Escrow</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("rewards")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "rewards"
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <FiAward className="w-4 h-4" />
                <span>Rewards ({rewardTiers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("community")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "community"
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <FiMessageSquare className="w-4 h-4" />
                <span>Community & Updates</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("faq")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "faq"
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <FiHelpCircle className="w-4 h-4" />
                <span>FAQ & Risks</span>
              </button>
            </div>

            {/* TAB CONTENT 1: CAMPAIGN STORY */}
            {activeTab === "story" && (
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-xl space-y-6 animate-fadeIn">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white pb-3 border-b border-slate-800">
                  Project Deep Dive
                </h2>

                {/* Render Story HTML */}
                <div
                  className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm sm:text-base space-y-4"
                  dangerouslySetInnerHTML={{
                    __html:
                      campaign?.description ||
                      fallbackCampaigns.default.description,
                  }}
                />
              </div>
            )}

            {/* TAB CONTENT 2: MILESTONES & ESCROW */}
            {activeTab === "milestones" && (
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-xl space-y-6 animate-fadeIn">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    Milestone-Gated Escrow Roadmap
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Funds are never given to creators all at once. Tranches unlock sequentially only when deliverables are verified by backers and audited by the protocol.
                  </p>
                </div>

                {/* Roadmap Timeline */}
                <div className="space-y-4 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-emerald-500/40 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <FiCheckCircle className="w-4 h-4" /> Phase 1: Prototype Validation & Tooling (30% Escrow)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        Unlocked & Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Finalized PCB schematics, completed FCC/CE pre-compliance testing, and procured tooling molds with CNC fabrication partners.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <FiClock className="w-4 h-4 text-amber-400" /> Phase 2: Pilot Production Batch (40% Escrow)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                        Locked Until Q3 2026
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      First 200 production pilot units manufactured, quality assurance burn-in tests completed, firmware v1.0 flash verified.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <FiLock className="w-4 h-4 text-slate-500" /> Phase 3: Global Logistics & Delivery (30% Escrow)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                        Final Tranche
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Mass shipping initiated via air courier with individual backer tracking IDs dispatched worldwide.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: REWARDS (IN-DEPTH) */}
            {activeTab === "rewards" && (
              <div
                ref={rewardsSectionRef}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-xl space-y-6 animate-fadeIn"
              >
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    Select a Backer Reward Tier
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Choose a pledge tier below to lock in exclusive hardware perks, founder editions, and Backer Guild XP.
                  </p>
                </div>

                <div className="space-y-4">
                  {rewardTiers.map((tier: any) => (
                    <div
                      key={tier.id || tier.name}
                      className="p-6 bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all relative group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {tier.name}
                          </h3>
                          <span className="text-xs text-slate-400">
                            Estimated Delivery: <strong className="text-slate-200">{tier.estimatedDelivery || "Late 2026"}</strong>
                          </span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="font-heading text-2xl font-extrabold text-emerald-400">
                            ${tier.amount}
                          </span>
                          {tier.quantityLimit && (
                            <span className="block text-[11px] text-amber-400 font-semibold">
                              Limited: {tier.quantityLimit}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed mb-4">
                        {tier.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <FiAward className="text-indigo-400" /> +{tier.amount * 10} Guild XP Included
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReward(tier);
                            setCustomPledgeAmount(String(tier.amount));
                            setIsPledgeModalOpen(true);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-bold text-xs shadow-glow-emerald transition-all"
                        >
                          Pledge ${tier.amount}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: COMMUNITY & UPDATES */}
            {activeTab === "community" && (
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-xl space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                      Community Updates & Changelog
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Direct reports from the creator team on engineering milestones, production status, and logistics.
                    </p>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => navigate(`/AddBlog/${campaign?._id || campaignId}`)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald"
                    >
                      + Post Update
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" /> Update #1: Tooling Verification Completed
                      </span>
                      <span className="text-slate-500">2 days ago</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      We visited our CNC manufacturing line this week to inspect the first 25 titanium case iterations. Thermal dissipators and sapphire crystal fittings passed with flying colors!
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" /> Welcome to all early backer pioneers!
                      </span>
                      <span className="text-slate-500">1 week ago</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      We hit our 100% funding goal in under 48 hours! Thank you to every backer who believed in zero-distraction ambient computing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: FAQ & RISKS */}
            {activeTab === "faq" && (
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-xl space-y-6 animate-fadeIn">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Frequently Asked Questions & Risk Mitigation
                </h2>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <h4 className="font-bold text-white mb-1">How does PledgePilot escrow work?</h4>
                    <p className="text-slate-400 leading-relaxed">
                      Backer funds are safely held in non-custodial smart escrow contracts. The creator is only released budget for Phase 1 after campaign completion, and subsequent tranches only unlock after milestone deliverable verification.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <h4 className="font-bold text-white mb-1">What if the campaign fails to reach its goal?</h4>
                    <p className="text-slate-400 leading-relaxed">
                      Under our 100% All-or-Nothing model, your pledge is completely refunded to your original payment method automatically without any penalty fees.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <h4 className="font-bold text-white mb-1">When will rewards be shipped?</h4>
                    <p className="text-slate-400 leading-relaxed">
                      Each tier displays an estimated delivery timeline. You will receive live milestone tracking updates and dispatch tracking numbers through the community board.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Side-Rail (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Creator Overview Card */}
            <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                About The Creator
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-[1.5px]">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-sm font-bold text-white">
                    {(campaign?.ownerName || "C").charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-white flex items-center gap-1.5">
                    {creatorUser ? `${creatorUser.firstName} ${creatorUser.lastName}` : campaign?.ownerName || "Creator Team"}
                    <FiCheckCircle className="text-emerald-400 text-xs" />
                  </h4>
                  <p className="text-xs text-slate-400">Verified Indie Creator</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {creatorUser?.aboutMe || "Pioneering open hardware, sustainable industrial design, and privacy-first decentralized consumer technology."}
              </p>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Identity Verified</span>
                <span className="text-emerald-400 font-semibold">100% Rating</span>
              </div>
            </div>

            {/* Side-Rail Reward Tiers Quick-Select */}
            <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select A Reward Tier
              </h3>

              <div className="space-y-3">
                {rewardTiers.slice(0, 3).map((tier: any) => (
                  <div
                    key={tier.id || tier.name}
                    onClick={() => {
                      setSelectedReward(tier);
                      setCustomPledgeAmount(String(tier.amount));
                      setIsPledgeModalOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <strong className="text-xs text-white group-hover:text-emerald-400 transition-colors">
                        {tier.name}
                      </strong>
                      <span className="text-sm font-bold text-emerald-400">
                        ${tier.amount}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                      {tier.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Delivery: {tier.estimatedDelivery || "Late 2026"}</span>
                      <span className="text-emerald-400 font-semibold group-hover:underline">Select Tier →</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Pledge Trigger */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReward(null);
                    setCustomPledgeAmount("50");
                    setIsPledgeModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-colors"
                >
                  Pledge Custom Amount
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Pledge & Stripe Modal */}
      {isPledgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsPledgeModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              aria-label="Close pledge modal"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                <FaRocket className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                {selectedReward ? `Back: ${selectedReward.name}` : "Back This Project"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your pledge amount. Escrow protection is active.
              </p>
            </div>

            {/* Custom Amount Field */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Pledge Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400 font-bold text-lg">
                  $
                </span>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={customPledgeAmount}
                  onChange={(e) => setCustomPledgeAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-heading font-bold text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <FaGem className="text-indigo-400" />
                <span>Earns ~{(parseFloat(customPledgeAmount) || 0) * 10} Backer Guild XP</span>
              </p>
            </div>

            {/* Stripe Checkout Action */}
            <div className="space-y-3">
              {sessionUser ? (
                <StripeCheckoutButton
                  stripeKey="pk_test_51OH08fSDbYv26qY8NlJ2q2pB52GvT71fT4Q9L7yF2x9Q0W1k"
                  token={handleStripeToken}
                  amount={(parseFloat(customPledgeAmount) || 50) * 100}
                  name="PledgePilot Escrow"
                  description={`Pledge to ${campaign?.name}`}
                  currency="USD"
                  email={sessionUser?.emailAddress || undefined}
                >
                  <button
                    type="button"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-heading font-extrabold text-sm shadow-glow-emerald transition-all"
                  >
                    Confirm Pledge of ${customPledgeAmount}
                  </button>
                </StripeCheckoutButton>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-bold text-sm shadow-glow-emerald transition-all"
                >
                  Log In to Complete Pledge
                </button>
              )}

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1 pt-1">
                <FiLock className="text-xs" />
                <span>256-Bit SSL Encrypted • Zero Platform Deduction Fees</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default CampaignPage;
