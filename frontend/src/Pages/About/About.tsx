import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiArrowRight,
  FiCheckCircle,
  FiLayers,
} from "react-icons/fi";
import {
  FaRocket,
  FaShieldAlt,
  FaGem,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Footer from "../../Components/Footer/Footer";
import { getUserInTheSession } from "../../Utils/SessionStorage";

const aaryanImg = require("../../assets/aaryan.jpeg");
const deepanshImg = require("../../assets/deepansh.jpeg");
const kartikeyImg = require("../../assets/kartikey.jpeg");
const kartikImg = require("../../assets/kartik.jpeg");

const founders = [
  {
    name: "Aaryan Praveen",
    role: "Full-Stack Architect & Core Protocol",
    image: aaryanImg,
    bio: "Pioneering distributed application architecture, high-conversion fintech interfaces, and decentralized escrow verification.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  {
    name: "Deepansh",
    role: "Smart Escrow & Platform Security",
    image: deepanshImg,
    bio: "Focused on non-custodial milestone-locked vaults, transparent payment pipelines, and zero-knowledge backer credential verification.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  {
    name: "Kartikey",
    role: "Product Design & Design Systems",
    image: kartikeyImg,
    bio: "Crafting fluid micro-interactions, dark-mode fintech aesthetics, and high-trust creator onboarding workflows.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  {
    name: "Kartik",
    role: "Distributed Systems & Cloud Backend",
    image: kartikImg,
    bio: "Architecting high-throughput database replication, real-time milestone telemetry, and Stripe payment webhooks.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
];

const corePillars = [
  {
    icon: FaShieldAlt,
    title: "Milestone-Gated Smart Escrow",
    color: "emerald",
    description:
      "Funds are never released in a single lump sum. Creators unlock financial tranches sequentially only when backers and protocol auditors verify proof of progress.",
  },
  {
    icon: FaGem,
    title: "Backer Guild XP & Perks",
    color: "indigo",
    description:
      "Backing projects earns on-chain reputation points, unlocks collector badges, VIP pledge discounts, and community governance voting power.",
  },
  {
    icon: FaRocket,
    title: "100% All-or-Nothing Escrow",
    color: "amber",
    description:
      "Zero risk of underfunded zombie projects. If a campaign falls short of its goal by the deadline, pledges are 100% refunded to backers with zero deduction fees.",
  },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Discover & Back Innovations",
    desc: "Explore breakthrough projects across Tech, Design, Games, Arts, and Community with verified creator identities.",
  },
  {
    step: "02",
    title: "Smart Escrow Vaulting",
    desc: "Your pledge is safely held in decentralized smart escrow contracts, protected from misappropriation or premature budget drain.",
  },
  {
    step: "03",
    title: "Milestone Deliverable Auditing",
    desc: "Creators upload tangible deliverables (tooling proofs, prototype tests, code releases) before requesting next funding tranches.",
  },
  {
    step: "04",
    title: "Delivery & Guild XP Rewards",
    desc: "Physical rewards ship with worldwide tracking while your backer profile gains permanent Guild XP and platform perks.",
  },
];

const testimonials = [
  {
    quote:
      "PledgePilot's milestone escrow was the single reason our community trusted us with $180,000 for our first hardware production run. It completely transformed our creator credibility.",
    author: "Elena Rostova",
    role: "Founder, ChronoForge Smartwatch",
    badge: "Funded $187k",
  },
  {
    quote:
      "As a serial hardware backer, I've lost thousands on other legacy platforms to ghosted campaigns. PledgePilot's milestone releases give me absolute confidence.",
    author: "Marcus Vance",
    role: "Senior Systems Engineer",
    badge: "Level 4 Backer • 14 Projects",
  },
  {
    quote:
      "The zero-hidden-fee structure and Stripe integration made collecting pledges seamless. The backer discussion board felt like a true co-creation community.",
    author: "Julian Chen",
    role: "Lead Architect, NebulaOS",
    badge: "Funded $215k",
  },
];

export const About: React.FC = () => {
  const navigate = useNavigate();
  const sessionUser = getUserInTheSession();

  const handleGetStarted = () => {
    if (sessionUser) {
      navigate("/discover");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[38rem] h-[38rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-[32rem] h-[32rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Micro-Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4 animate-fadeIn">
            <HiSparkles className="w-3.5 h-3.5" />
            <span>Decentralized-Grade Crowdfunding Protocol</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Pioneering the future of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              trustless crowdfunding
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            PledgePilot eliminates broken promises and opaque fundraising. By fusing milestone-gated smart escrow, all-or-nothing guarantees, and Backer Guild gamification, we empower visionary creators and protect passionate backers worldwide.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-heading font-extrabold text-sm shadow-glow-emerald hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Explore Campaigns</span>
              <FiArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 hover:border-slate-600 transition-all duration-200"
            >
              <FaRocket className="w-3.5 h-3.5 text-emerald-400" />
              <span>Start a Project</span>
            </Link>
          </div>
        </div>

        {/* PLATFORM METRICS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          <div className="p-6 rounded-3xl bg-slate-900/85 backdrop-blur-md border border-slate-800/80 shadow-xl text-center">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-white block mb-1">
              $4.8M+
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Funds Protected in Escrow
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/85 backdrop-blur-md border border-slate-800/80 shadow-xl text-center">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-400 block mb-1">
              98.4%
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Milestone Delivery Rate
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/85 backdrop-blur-md border border-slate-800/80 shadow-xl text-center">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-white block mb-1">
              28,500+
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Active Global Backers
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/85 backdrop-blur-md border border-slate-800/80 shadow-xl text-center">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-indigo-400 block mb-1">
              0%
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Hidden Platform Take Rate
            </span>
          </div>
        </div>

        {/* CORE PILLARS & MISSION */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why We Built PledgePilot
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Traditional crowdfunding is plagued by delayed deliverables, unfulfilled backer rewards, and zero creator accountability. We engineered a better foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {corePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                        pillar.color === "emerald"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : pillar.color === "indigo"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="font-heading text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-sm text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HOW IT WORKS TIMELINE */}
        <div className="mb-24 p-8 sm:p-12 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-emerald-400 mb-2">
              <FiLayers className="w-3.5 h-3.5" />
              <span>Transparent Architecture</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              The 4-Step Escrow Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              How capital moves safely from backer wallets to physical product delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {howItWorksSteps.map((item, index) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between relative group hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="font-heading text-3xl font-extrabold text-emerald-400/30 group-hover:text-emerald-400 transition-colors mb-4">
                    {item.step}
                  </div>
                  <h4 className="font-heading text-base font-bold text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MEET THE FOUNDERS */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-400 border border-emerald-500/20 mb-2">
              <FiUsers className="w-3.5 h-3.5" />
              <span>Leadership & Core Team</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Meet the Founders
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              The engineers, designers, and systems architects building decentralized crowdfunding infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {founders.map((founder) => (
              <div
                key={founder.name}
                className="bg-slate-900/85 backdrop-blur-md border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Photo with gradient ring */}
                <div className="relative w-28 h-28 rounded-2xl p-1 bg-gradient-to-tr from-emerald-500 to-indigo-600 mb-5 shadow-lg group-hover:shadow-emerald-500/20 transition-all">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-950">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                <h3 className="font-heading text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                  {founder.name}
                </h3>
                <span className="text-xs font-semibold text-emerald-400 mb-3 block">
                  {founder.role}
                </span>

                <p className="text-xs text-slate-400 leading-relaxed mb-5 flex-1">
                  {founder.bio}
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80 w-full justify-center text-slate-400">
                  <a
                    href={founder.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label={`${founder.name} GitHub`}
                  >
                    <FaGithub className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label={`${founder.name} LinkedIn`}
                  >
                    <FaLinkedin className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={founder.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label={`${founder.name} Twitter`}
                  >
                    <FaTwitter className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMMUNITY TESTIMONIALS */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Trusted by Innovators Worldwide
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              See what creators and backers say about milestone-backed crowdfunding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {t.badge}
                    </span>
                    <FiCheckCircle className="text-emerald-400 w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <h4 className="font-heading text-sm font-bold text-white">
                    {t.author}
                  </h4>
                  <span className="text-xs text-slate-400">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 p-8 sm:p-12 text-center shadow-2xl overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to launch your vision or back the next breakthrough?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join thousands of inventors, engineers, and passionate backers on the world&apos;s premier decentralized crowdfunding launchpad.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleGetStarted}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-heading font-extrabold text-sm shadow-glow-emerald hover:-translate-y-0.5 transition-all"
              >
                Get Started Today
              </button>
              <Link
                to="/discover"
                className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default About;
