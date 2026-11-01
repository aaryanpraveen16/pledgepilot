import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaDiscord,
  FaGithub,
  FaYoutube,
  FaLinkedin,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";

const Logo = require("../../assets/pledge-pilot-text.png");

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800/80 relative z-10 overflow-hidden">
      {/* Subtle background ambient mesh */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main Grid: 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Trust Badges (Span 4) */}
          <div className="lg:col-span-4 flex flex-col space-y-5">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={Logo}
                alt="PledgePilot Logo"
                className="h-9 w-auto brightness-110 object-contain"
              />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier decentralized-grade crowdfunding launchpad. Empowering
              visionary founders and passionate backers to co-create the next
              wave of indie hardware, software, and creative breakthroughs.
            </p>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <FaShieldAlt className="text-emerald-400 text-xs" />
                <span>Stripe Escrow Verified</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <FiLock className="text-indigo-400 text-xs" />
                <span>256-Bit SSL Protection</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <FaCheckCircle className="text-emerald-400 text-xs" />
                <span>Zero-Fraud Escrow</span>
              </div>
            </div>
          </div>

          {/* Column 2: Discover (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading text-sm font-semibold text-white tracking-wider uppercase">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  to="/discover"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Explore All Campaigns
                </Link>
              </li>
              <li>
                <Link
                  to="/discover?category=tech"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Technology & Hardware
                </Link>
              </li>
              <li>
                <Link
                  to="/discover?category=games"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Indie Games
                </Link>
              </li>
              <li>
                <Link
                  to="/discover?category=design"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Product Design
                </Link>
              </li>
              <li>
                <Link
                  to="/rewards"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  Backer Guild XP
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    New
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Creators (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading text-sm font-semibold text-white tracking-wider uppercase">
              Creators
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  to="/create-campaign"
                  className="hover:text-emerald-400 transition-colors font-medium text-emerald-400 flex items-center gap-1"
                >
                  Start a Campaign
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Creator Handbook
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Pricing & 0% Fees
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Fulfillment Partners
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Milestone Escrow Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Community (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-heading text-sm font-semibold text-white tracking-wider uppercase">
              Stay Ahead of the Curve
            </h4>
            <p className="text-sm text-slate-400">
              Join 40,000+ backers. Get high-conviction campaign drops and
              exclusive early-bird perks in your inbox weekly.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-sm flex items-center gap-2">
                <FaCheckCircle />
                <span>You're subscribed! Welcome to the insider circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500/60 p-1.5 transition-all">
                  <FiMail className="ml-2.5 text-slate-500 w-4 h-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-md shadow-emerald-500/20"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}

            {/* Social Icons */}
            <div className="pt-2 flex items-center space-x-3 text-slate-400">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-800 transition-all"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-slate-800 transition-all"
                aria-label="Discord"
              >
                <FaDiscord className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all"
                aria-label="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-800 transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-red-400 hover:border-red-500/40 hover:bg-slate-800 transition-all"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & System Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span>© {new Date().getFullYear()} PledgePilot Inc.</span>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-400 transition-colors">
              Security & Escrow
            </Link>
          </div>

          {/* Operational Status Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400 font-medium">
              All Systems Operational • Escrow Contract Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
