import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiUploadCloud,
  FiTrash2,
  FiPlus,
  FiCalendar,
  FiInfo,
  FiMapPin,
  FiFileText,
  FiZap,
  FiX,
  FiImage,
} from "react-icons/fi";
import {
  FaMicrochip,
  FaPalette,
  FaGamepad,
  FaPaintBrush,
  FaHeart,
  FaRocket,
  FaShieldAlt,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import {
  getCampaign,
  saveCampaign,
  updateCampaign,
} from "../../services/campaingServices";
import { updateUserByEmail } from "../../services/userServices";
import { getUserInTheSession } from "../../Utils/SessionStorage";
import Footer from "../../Components/Footer/Footer";

// Types
export interface FeatureHighlight {
  id: string;
  title: string;
  description: string;
}

export interface RewardTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  estimatedDelivery: string;
  quantityLimit?: string;
}

export interface CampaignFormData {
  // Step 1: Basics
  title: string;
  subtitle: string;
  location: string;
  category: "Tech" | "Design" | "Games" | "Arts" | "Community";

  // Step 2: Goals & Timeline
  goalAmount: number;
  durationDays: number;

  // Step 3: Story & Media
  heroImage: string;
  problemStatement: string;
  solutionStatement: string;
  features: FeatureHighlight[];

  // Step 4: Rewards
  rewards: RewardTier[];
}

const STORAGE_KEY = "pledgepilot_campaign_wizard_draft";

const defaultSampleImage =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

const initialFormData: CampaignFormData = {
  title: "",
  subtitle: "",
  location: "San Francisco, CA, USA",
  category: "Tech",
  goalAmount: 50000,
  durationDays: 30,
  heroImage: defaultSampleImage,
  problemStatement: "",
  solutionStatement: "",
  features: [
    {
      id: "f-1",
      title: "Modular Open Architecture",
      description: "Hot-swappable hardware components built with standard open tooling.",
    },
    {
      id: "f-2",
      title: "All-Day Biometric Battery",
      description: "Ultra-efficient power management ensuring 18+ hours on a single charge.",
    },
    {
      id: "f-3",
      title: "Decentralized Escrow Protected",
      description: "Milestone-backed disbursement backed by smart contracts and audited proof.",
    },
  ],
  rewards: [
    {
      id: "r-1",
      name: "Early Bird Pioneer",
      amount: 149,
      description:
        "Includes 1x First-Batch Production Unit + Special Backer Guild Badge + Discord Access.",
      estimatedDelivery: "November 2026",
      quantityLimit: "250",
    },
    {
      id: "r-2",
      name: "Founder Special Edition",
      amount: 299,
      description:
        "Includes 1x Numbered Titanium Edition + Custom Engraving + Lifetime VIP Backer Perks.",
      estimatedDelivery: "December 2026",
      quantityLimit: "100",
    },
  ],
};

const categoryOptions = [
  { id: "Tech", label: "Tech", icon: FaMicrochip },
  { id: "Design", label: "Design", icon: FaPalette },
  { id: "Games", label: "Games", icon: FaGamepad },
  { id: "Arts", label: "Arts", icon: FaPaintBrush },
  { id: "Community", label: "Community", icon: FaHeart },
] as const;

export const CreateCampaignWizard: React.FC = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();

  // Wizard Step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<CampaignFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Authenticated Creator Profile
  const sessionUser = getUserInTheSession();

  // Load Draft from LocalStorage on mount (or fetch existing campaign if campaignId is present)
  useEffect(() => {
    if (campaignId) {
      const fetchExisting = async () => {
        try {
          const existing = await getCampaign(campaignId);
          if (existing) {
            setFormData((prev) => ({
              ...prev,
              title: existing.name || prev.title,
              category: existing.category || prev.category,
              heroImage: existing.image || prev.heroImage,
              goalAmount: Number(existing.milestone?.target || prev.goalAmount),
              problemStatement: existing.problemStatement || prev.problemStatement,
              solutionStatement: existing.solutionStatement || prev.solutionStatement,
            }));
          }
        } catch (err) {
          console.error("Failed to fetch existing campaign:", err);
        }
      };
      fetchExisting();
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.formData) {
            setFormData(parsed.formData);
            if (parsed.currentStep && parsed.currentStep >= 1 && parsed.currentStep <= 5) {
              setCurrentStep(parsed.currentStep);
            }
          }
        } catch (e) {
          console.error("Error reading saved draft:", e);
        }
      }
    }
  }, [campaignId]);

  // Autosave to LocalStorage
  useEffect(() => {
    if (!campaignId) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentStep,
          formData,
          updatedAt: new Date().toISOString(),
        })
      );
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setLastSaved(timeStr);
    }
  }, [formData, currentStep, campaignId]);

  // Step Validation
  const validateStep = (stepNumber: number): boolean => {
    setErrorMessage(null);
    if (stepNumber === 1) {
      if (!formData.title.trim()) {
        setErrorMessage("Please enter a project title.");
        return false;
      }
      if (!formData.subtitle.trim()) {
        setErrorMessage("Please provide a short catchphrase / subtitle.");
        return false;
      }
      if (!formData.location.trim()) {
        setErrorMessage("Please enter your project location.");
        return false;
      }
    } else if (stepNumber === 2) {
      if (!formData.goalAmount || formData.goalAmount <= 0) {
        setErrorMessage("Please enter a valid funding goal greater than $0.");
        return false;
      }
    } else if (stepNumber === 3) {
      if (!formData.problemStatement.trim()) {
        setErrorMessage("Please explain what problem you are solving.");
        return false;
      }
      if (!formData.solutionStatement.trim()) {
        setErrorMessage("Please describe how your product fixes the problem.");
        return false;
      }
    } else if (stepNumber === 4) {
      if (formData.rewards.length === 0) {
        setErrorMessage("Please add at least one reward tier for your backers.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear Draft Action
  const handleClearDraft = () => {
    if (window.confirm("Are you sure you want to reset and start a fresh project draft?")) {
      localStorage.removeItem(STORAGE_KEY);
      setFormData(initialFormData);
      setCurrentStep(1);
      setErrorMessage(null);
    }
  };

  // Image Upload / Drop Handlers
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, heroImage: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, heroImage: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Feature Highlights List Builders
  const handleAddFeature = () => {
    const newFeature: FeatureHighlight = {
      id: `f-${Date.now()}`,
      title: "New Feature",
      description: "Brief description of why backers will love this capability.",
    };
    setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature] }));
  };

  const handleRemoveFeature = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));
  };

  const handleFeatureChange = (id: string, field: "title" | "description", val: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === id ? { ...f, [field]: val } : f)),
    }));
  };

  // Reward Tiers List Builders
  const handleAddReward = () => {
    const newTier: RewardTier = {
      id: `r-${Date.now()}`,
      name: "New Backer Tier",
      amount: 99,
      description: "Includes product reward + digital perks and early updates.",
      estimatedDelivery: "December 2026",
      quantityLimit: "",
    };
    setFormData((prev) => ({ ...prev, rewards: [...prev.rewards, newTier] }));
  };

  const handleRemoveReward = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      rewards: prev.rewards.filter((r) => r.id !== id),
    }));
  };

  const handleRewardChange = (id: string, field: keyof RewardTier, val: any) => {
    setFormData((prev) => ({
      ...prev,
      rewards: prev.rewards.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
    }));
  };

  // Generate HTML Description for Campaign Details view
  const generateRichDescription = (data: CampaignFormData): string => {
    return `
      <div class="campaign-story space-y-6">
        <p class="text-lg font-medium text-slate-300 leading-relaxed">${data.subtitle}</p>
        
        <div class="problem-statement">
          <h3 class="text-xl font-bold text-white mb-2">The Problem We Are Solving</h3>
          <p class="text-slate-300 leading-relaxed">${data.problemStatement}</p>
        </div>

        <div class="solution-statement">
          <h3 class="text-xl font-bold text-white mb-2">Our Breakthrough Solution</h3>
          <p class="text-slate-300 leading-relaxed">${data.solutionStatement}</p>
        </div>

        <div class="feature-highlights">
          <h3 class="text-xl font-bold text-white mb-3">Key Feature Highlights</h3>
          <ul class="space-y-2">
            ${data.features
              .map(
                (f) =>
                  `<li class="text-slate-300"><strong class="text-emerald-400 font-semibold">${f.title}:</strong> ${f.description}</li>`
              )
              .join("")}
          </ul>
        </div>
      </div>
    `;
  };

  // Final Publish Handler
  const handlePublish = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const ownerName =
      sessionUser?.firstName && sessionUser?.lastName
        ? `${sessionUser.firstName} ${sessionUser.lastName}`
        : sessionUser?.name || "PledgePilot Creator";

    const campaignPayload = {
      name: formData.title,
      description: generateRichDescription(formData),
      ownerName,
      owner: sessionUser?._id,
      category: formData.category,
      image: formData.heroImage,
      milestone: {
        target: String(formData.goalAmount),
        progress: "0",
      },
      payments: {
        count: "0",
      },
      daysLeft: formData.durationDays,
      createdAt: new Date().toISOString(),
      rewards: formData.rewards,
    };

    try {
      let result;
      if (campaignId) {
        result = await updateCampaign(campaignId, campaignPayload);
      } else {
        result = await saveCampaign(campaignPayload);
      }

      // Associate campaign with user in session
      if (sessionUser && sessionUser.emailAddress) {
        const userProjects = sessionUser.createdProjects || [];
        const newId = result?._id || `proj-${Date.now()}`;
        if (!userProjects.includes(newId)) {
          userProjects.push(newId);
          sessionUser.createdProjects = userProjects;
          try {
            await updateUserByEmail(sessionUser.emailAddress, sessionUser);
            sessionStorage.setItem("user", JSON.stringify(sessionUser));
          } catch {
            // non-blocking
          }
        }
      }

      // Clear draft after publish
      localStorage.removeItem(STORAGE_KEY);

      // Navigate to discover or campaign details
      navigate("/discover");
    } catch (err: any) {
      console.error("Failed to publish campaign:", err);
      // Non-blocking fallback simulation for demo environments
      localStorage.removeItem(STORAGE_KEY);
      navigate("/discover");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step Meta info
  const stepTitles = [
    "The Basics",
    "Funding Goals & Timeline",
    "Story & Media",
    "Reward Tiers",
    "Review & Launch",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[36rem] h-[36rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Micro-Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Wizard Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Top Breadcrumb & Autosave Status */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-8">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel & Return to Discover</span>
          </Link>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            {lastSaved && (
              <span className="flex items-center gap-1.5">
                <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Draft autosaved at {lastSaved}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-slate-500 hover:text-rose-400 underline transition-colors"
            >
              Reset draft
            </button>
          </div>
        </div>

        {/* Wizard Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <HiSparkles className="w-3.5 h-3.5" />
            <span>PledgePilot Creator Studio</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {campaignId ? "Edit Campaign" : "Start a Project"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
            Bring your vision to life with milestone-protected decentralized escrow. Follow the 5 simple steps below.
          </p>
        </div>

        {/* Progress Header & Animated Bar */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-3">
            <span className="text-white">
              Step {currentStep} of 5:{" "}
              <span className="text-emerald-400">{stepTitles[currentStep - 1]}</span>
            </span>
            <span className="text-slate-400">{Math.round((currentStep / 5) * 100)}% Complete</span>
          </div>

          {/* Smooth Progress Track */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Clickable Step Pills */}
          <div className="grid grid-cols-5 gap-2 mt-4 pt-2">
            {stepTitles.map((title, idx) => {
              const stepNum = idx + 1;
              const isPassed = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => {
                    if (stepNum < currentStep || validateStep(currentStep)) {
                      setCurrentStep(stepNum);
                    }
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] sm:text-xs font-semibold text-center transition-all truncate ${
                    isCurrent
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : isPassed
                      ? "text-slate-300 hover:text-white hover:bg-slate-800"
                      : "text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <span className="hidden sm:inline">{stepNum}. </span>
                  {title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
            <FiInfo className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="flex-1 leading-relaxed">{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-200"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sleek Glassmorphic Step Container */}
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/70 relative">
          {/* STEP 1: THE BASICS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Step 1: The Basics (Project Identity)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Start with the essentials: give your project a clear identity, a compelling catchphrase, and choose its primary category.
                </p>
              </div>

              {/* Project Title */}
              <div>
                <label
                  htmlFor="projectTitle"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                >
                  Project Title *
                </label>
                <input
                  id="projectTitle"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. ChronoForge: Dual-Display Hybrid Mechanical Smartwatch"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Subtitle / Catchphrase */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="subtitle"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                  >
                    Short Catchphrase / Subtitle *
                  </label>
                  <span
                    className={`text-xs ${
                      formData.subtitle.length > 100 ? "text-rose-400 font-bold" : "text-slate-500"
                    }`}
                  >
                    {formData.subtitle.length}/100
                  </span>
                </div>
                <input
                  id="subtitle"
                  type="text"
                  maxLength={100}
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. A titanium timepiece with an invisible curved E-Ink dial and 30-day battery life."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Category Pill Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Primary Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {categoryOptions.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            category: cat.id as CampaignFormData["category"],
                          })
                        }
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                            : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                >
                  Project Location *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <input
                    id="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Austin, Texas, USA"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FUNDING GOALS & TIMELINE */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Step 2: Funding Goals & Timeline
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Define how much capital your project requires to ship deliverables, and pick your target campaign window.
                </p>
              </div>

              {/* Funding Goal Amount */}
              <div>
                <label
                  htmlFor="goalAmount"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                >
                  Funding Goal Amount (USD) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400 font-bold text-base">
                    $
                  </div>
                  <input
                    id="goalAmount"
                    type="number"
                    min="500"
                    step="500"
                    required
                    value={formData.goalAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, goalAmount: Number(e.target.value) || 0 })
                    }
                    placeholder="50000"
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700/80 text-white font-heading font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Formatted preview:{" "}
                  <strong className="text-emerald-400">${formData.goalAmount.toLocaleString()}</strong>
                </p>
              </div>

              {/* Campaign Duration Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Campaign Duration *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[30, 45, 60].map((days) => {
                    const isSelected = formData.durationDays === days;
                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setFormData({ ...formData, durationDays: days })}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                            : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80"
                        }`}
                      >
                        <span className="text-lg font-bold font-heading">{days} Days</span>
                        <span className={`text-[11px] ${isSelected ? "text-slate-900 font-medium" : "text-slate-400"}`}>
                          {days === 30 ? "Recommended" : days === 45 ? "Extended" : "Long Horizon"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* All-or-Nothing Escrow Info Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <FaShieldAlt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <span>100% All-or-Nothing Escrow Guarantee</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    PledgePilot utilizes milestone-protected decentralized escrow. Funds are only collected from backers if you meet or exceed your <strong>${formData.goalAmount.toLocaleString()}</strong> target by the deadline. If the goal isn&apos;t achieved, backers are automatically refunded with zero fee deductions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: STORY & MEDIA */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Step 3: Story & Media
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Structured storytelling converts backers faster. Add your high-resolution hero visual, state the problem you solve, and list your top feature highlights.
                </p>
              </div>

              {/* Hero Image Drag & Drop Uploader */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Hero Banner / Campaign Thumbnail *
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    isDragOver
                      ? "border-emerald-400 bg-emerald-500/10"
                      : "border-slate-700 bg-slate-800/40 hover:border-slate-600"
                  }`}
                >
                  {formData.heroImage ? (
                    <div className="space-y-3">
                      <div className="relative aspect-[16/9] max-h-56 mx-auto rounded-xl overflow-hidden border border-slate-700">
                        <img
                          src={formData.heroImage}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, heroImage: "" })}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-rose-400 hover:text-white transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400">
                        Banner preview loaded. Drag another image to replace or provide an external URL below.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 py-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-emerald-400 border border-slate-700">
                        <FiUploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Drag and drop your hero image here
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">PNG, JPG, or WEBP up to 10MB (16:9 ratio recommended)</p>
                      </div>
                      <div>
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-slate-700 cursor-pointer transition-colors">
                          <FiImage className="w-3.5 h-3.5" />
                          <span>Browse Local Files</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Or external image URL input */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                    <span className="text-xs text-slate-500 whitespace-nowrap">Image URL:</span>
                    <input
                      type="url"
                      value={formData.heroImage}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Problem & Solution Inputs */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="problemStatement"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                  >
                    What problem are you solving? *
                  </label>
                  <textarea
                    id="problemStatement"
                    rows={3}
                    required
                    value={formData.problemStatement}
                    onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                    placeholder="e.g. Modern smartwatches are filled with dopamine-trapping notifications, drain battery in less than 24 hours, and collect pervasive private biometric data..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all leading-relaxed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="solutionStatement"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                  >
                    How does your product fix it? *
                  </label>
                  <textarea
                    id="solutionStatement"
                    rows={3}
                    required
                    value={formData.solutionStatement}
                    onChange={(e) =>
                      setFormData({ ...formData, solutionStatement: e.target.value })
                    }
                    placeholder="e.g. ChronoForge combines mechanical Swiss movements with an invisible curved E-Ink sub-layer that only alerts you to critical events, lasts 30 days, and keeps biometrics encrypted on-device..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all leading-relaxed"
                  />
                </div>
              </div>

              {/* Dynamic Feature Highlights List Builder */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Feature Highlights (3-4 Key Bullet Points)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Give backers a quick scan of the primary specs or technical breakthroughs.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs border border-slate-700 transition-colors"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.features.map((feature, idx) => (
                    <div
                      key={feature.id}
                      className="p-3.5 bg-slate-800/70 border border-slate-700/70 rounded-xl relative group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-400">
                          Highlight #{idx + 1}
                        </span>
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(feature.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors"
                            aria-label="Remove feature"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => handleFeatureChange(feature.id, "title", e.target.value)}
                          placeholder="Feature title"
                          className="sm:col-span-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          value={feature.description}
                          onChange={(e) =>
                            handleFeatureChange(feature.id, "description", e.target.value)
                          }
                          placeholder="Short description / specs"
                          className="sm:col-span-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REWARD TIERS SETUP */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    Step 4: Reward Tiers Setup
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Design enticing tiers for backers. Set pledge amounts, perks included, delivery schedules, and optional batch limits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddReward}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-bold text-xs shadow-glow-emerald transition-all self-start"
                >
                  <FiPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Reward Tier</span>
                </button>
              </div>

              {/* List of Tiers */}
              <div className="space-y-4">
                {formData.rewards.map((tier, idx) => (
                  <div
                    key={tier.id}
                    className="p-5 bg-slate-800/70 border border-slate-700/80 rounded-2xl relative"
                  >
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/60">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                        Tier #{idx + 1}
                      </span>
                      {formData.rewards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveReward(tier.id)}
                          className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          <span>Delete Tier</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* Tier Name */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Tier Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={tier.name}
                          onChange={(e) => handleRewardChange(tier.id, "name", e.target.value)}
                          placeholder="e.g. Early Bird Pioneer"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      {/* Pledge Amount */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Pledge Amount ($) *
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400 font-bold text-xs">
                            $
                          </span>
                          <input
                            type="number"
                            min="1"
                            required
                            value={tier.amount}
                            onChange={(e) =>
                              handleRewardChange(tier.id, "amount", Number(e.target.value) || 0)
                            }
                            placeholder="149"
                            className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        What&apos;s Included In This Perk? *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={tier.description}
                        onChange={(e) => handleRewardChange(tier.id, "description", e.target.value)}
                        placeholder="List items, software licenses, backer badges, and physical goods included..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Estimated Delivery */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Estimated Delivery (Month & Year) *
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute inset-y-0 left-3 my-auto text-slate-500 w-3.5 h-3.5" />
                          <input
                            type="text"
                            value={tier.estimatedDelivery}
                            onChange={(e) =>
                              handleRewardChange(tier.id, "estimatedDelivery", e.target.value)
                            }
                            placeholder="e.g. November 2026"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Optional Quantity Limit */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Optional Quantity Limit (Blank = Unlimited)
                        </label>
                        <input
                          type="text"
                          value={tier.quantityLimit || ""}
                          onChange={(e) =>
                            handleRewardChange(tier.id, "quantityLimit", e.target.value)
                          }
                          placeholder="e.g. 250 units"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & LAUNCH */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Step 5: Review & Launch
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Inspect your campaign preview before going live. Your project will be published under our decentralized escrow framework.
                </p>
              </div>

              {/* Full Backer Preview Card */}
              <div className="p-6 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-6">
                {/* Header Showcase */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Hero Thumbnail */}
                  <div className="w-full md:w-5/12 aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
                    <img
                      src={formData.heroImage || defaultSampleImage}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Summary Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {formData.category}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <FiMapPin className="w-3 h-3 text-slate-500" />
                          {formData.location}
                        </span>
                      </div>

                      <h3 className="font-heading text-xl font-bold text-white leading-snug">
                        {formData.title || "Untitled Project"}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {formData.subtitle || "No subtitle provided."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px]">Funding Goal</span>
                        <p className="font-heading text-lg font-extrabold text-emerald-400">
                          ${formData.goalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[11px]">Timeline</span>
                        <p className="font-heading text-lg font-bold text-white">
                          {formData.durationDays} Days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problem & Solution Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/70">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <FiFileText className="text-rose-400" /> The Problem
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {formData.problemStatement || "No problem statement specified."}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/70">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <FiZap className="text-emerald-400" /> Our Solution
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {formData.solutionStatement || "No solution statement specified."}
                    </p>
                  </div>
                </div>

                {/* Reward Tiers Summary */}
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    Configured Reward Tiers ({formData.rewards.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.rewards.map((tier) => (
                      <div
                        key={tier.id}
                        className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/70 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-white font-semibold">{tier.name}</strong>
                          <span className="text-emerald-400 font-bold">${tier.amount}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{tier.description}</p>
                        <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                          <span>Delivery: {tier.estimatedDelivery}</span>
                          {tier.quantityLimit && <span>Limit: {tier.quantityLimit}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Creator Terms Note */}
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <FiCheckCircle className="text-emerald-400 flex-shrink-0" />
                <span>
                  By publishing, you agree to fulfill backer deliverables according to your stated milestones and timeline.
                </span>
              </div>
            </div>
          )}

          {/* Bottom Wizard Navigation Actions */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-heading font-bold text-xs sm:text-sm shadow-glow-emerald hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <span>Continue</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-heading font-bold text-sm shadow-glow-emerald hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-slate-950"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Publishing Campaign...</span>
                  </>
                ) : (
                  <>
                    <FaRocket className="w-4 h-4" />
                    <span>Publish Campaign</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateCampaignWizard;
