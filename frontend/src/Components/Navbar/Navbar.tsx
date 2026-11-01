import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSearch,
  FiBell,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiCompass,
  FiChevronDown,
  FiAward,
  FiLayers,
  FiCheckCircle,
  FiCheck,
  FiExternalLink,
} from "react-icons/fi";
import { FaGem, FaRocket } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { AppDispatch } from "../../store/store";
import { userLogout } from "../../store/UserSlice";

const LogoIcon = require("../../assets/white-logo.png");
const LogoText = require("../../assets/pledge-pilot-text.png");

interface NavbarProps {
  onSearch?: (searchQuery: string) => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "success" | "xp" | "campaign";
}

const sampleNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Project Milestone Verified!",
    description: "ChronoForge successfully completed Milestone 1 (Escrow Disbursed).",
    time: "25m ago",
    read: false,
    type: "success",
  },
  {
    id: "notif-2",
    title: "+500 Guild XP Earned",
    description: "You backed NebulaOS early and leveled up your Backer Rank.",
    time: "3h ago",
    read: false,
    type: "xp",
  },
  {
    id: "notif-3",
    title: "Campaign Update Dispatched",
    description: "Aether Dynamics published a production manufacturing update.",
    time: "1d ago",
    read: true,
    type: "campaign",
  },
];

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux user state
  const reduxUser = useSelector((state: any) => state.user?.loginResponse);

  // Retrieve cached user from sessionStorage / localStorage
  const [cachedUser, setCachedUser] = useState<any>(null);

  useEffect(() => {
    const sessionStr = sessionStorage.getItem("user");
    const localStr = localStorage.getItem("user");
    try {
      if (sessionStr) {
        setCachedUser(JSON.parse(sessionStr));
      } else if (localStr) {
        setCachedUser(JSON.parse(localStr));
      } else {
        setCachedUser(null);
      }
    } catch {
      setCachedUser(null);
    }
  }, [reduxUser, location.pathname]);

  const currentUser = reduxUser?.user || reduxUser || cachedUser;
  const isLoggedIn = Boolean(currentUser);

  // User display name & initials
  const userFullName =
    currentUser?.firstName && currentUser?.lastName
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : currentUser?.name || currentUser?.emailAddress?.split("@")[0] || "Explorer";

  const userInitial = userFullName.charAt(0).toUpperCase() || "P";

  // Gamified Backer Tier data
  const userXP = 4200;
  const nextTierXP = 5000;
  const userTierName = "Silver Tier";
  const xpPercent = Math.min(Math.round((userXP / nextTierXP) * 100), 100);

  // UI Interactive States
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Refs for click outside handling
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
  }, [location.pathname]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      }
      navigate(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    dispatch(userLogout());
    setCachedUser(null);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  // Mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Check active navigation link
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Left: Brand Identity & Desktop Navigation */}
          <div className="flex items-center gap-8">
            {/* Brand Logo with Sparkle */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-105"
              aria-label="PledgePilot Home"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-0.5 shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center p-1.5 overflow-hidden">
                  <img
                    src={LogoIcon}
                    alt="PledgePilot Emblem"
                    className="w-full h-full object-contain brightness-125"
                  />
                </div>
                {/* Emerald Gradient Sparkle Accent */}
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 flex items-center justify-center shadow-sm">
                  <HiSparkles className="w-2.5 h-2.5 text-slate-950" />
                </div>
              </div>
              <img
                src={LogoText}
                alt="PledgePilot"
                className="h-7 sm:h-8 w-auto object-contain brightness-110 drop-shadow-[0_0_12px_rgba(16,185,129,0.3)] hidden xs:block"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                to="/discover"
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive("/discover")
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Discover
              </Link>
              <Link
                to={isLoggedIn ? "/dashboard" : "/login"}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                My Backing
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive("/about")
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                About & Community
              </Link>
              <Link
                to={isLoggedIn ? "/rewards" : "/login"}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive("/rewards")
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Rewards
              </Link>
            </nav>
          </div>

          {/* Center: Integrated Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiSearch className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns, creators, tech..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Right Actions: CTAs, Notifications & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Glowing Emerald "Start a Project" CTA */}
            <button
              type="button"
              onClick={() => navigate("/create")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-bold text-xs sm:text-sm shadow-glow-emerald hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <FaRocket className="w-3.5 h-3.5" />
              <span>Start a Project</span>
            </button>

            {/* Notification Bell with Live Status Dot */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="View notifications"
                className={`relative p-2.5 rounded-xl border transition-all ${
                  isNotificationsOpen
                    ? "bg-slate-800 text-emerald-400 border-slate-700"
                    : "bg-slate-900/80 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700"
                }`}
              >
                <FiBell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-sm text-white">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto mt-2">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`py-3 px-2 rounded-xl transition-colors ${
                          !item.read ? "bg-slate-800/40" : "hover:bg-slate-800/20"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              item.type === "success"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : item.type === "xp"
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {item.type === "success" && <FiCheckCircle className="w-3.5 h-3.5" />}
                            {item.type === "xp" && <FaGem className="w-3.5 h-3.5" />}
                            {item.type === "campaign" && <FaRocket className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-semibold text-white">{item.title}</h5>
                              <span className="text-[10px] text-slate-500">{item.time}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 mt-2 text-center">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
                    >
                      <span>View all platform updates</span>
                      <FiExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown & Gamified Backer Tier */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all group"
                  aria-label="User menu"
                >
                  {/* Avatar Initial with gradient border */}
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-[1.5px] shadow-sm">
                    <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {userInitial}
                    </div>
                  </div>

                  {/* Desktop Gamified Backer Tier Badge Preview */}
                  <div className="hidden xl:flex flex-col items-start text-left">
                    <span className="text-xs font-bold text-white line-clamp-1">
                      {userFullName}
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-400 flex items-center gap-1">
                      <FaGem className="text-[9px]" /> {userTierName} • {userXP} XP
                    </span>
                  </div>

                  <FiChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Popover with Gamification Stats */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-72 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-4 z-50 animate-fadeIn">
                    {/* User Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-[1.5px]">
                        <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-sm font-bold text-white">
                          {userInitial}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-sm text-white truncate">
                          {userFullName}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          {currentUser?.emailAddress || currentUser?.email || "Backer Account"}
                        </p>
                      </div>
                    </div>

                    {/* Gamified Backer Tier Card */}
                    <div className="my-3 p-3 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-850 to-slate-900 border border-indigo-500/30">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                          <FaGem className="text-indigo-400 text-xs" /> {userTierName}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {userXP} / {nextTierXP} XP
                        </span>
                      </div>
                      {/* XP Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                          style={{ width: `${xpPercent}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                        <FiCheck className="text-emerald-400" />
                        <span>+5% Backer Rewards perk active</span>
                      </p>
                    </div>

                    {/* Menu Links */}
                    <div className="space-y-1 text-xs">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <FiCompass className="w-4 h-4 text-emerald-400" />
                        <span>My Dashboard & Pledges</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <FiUser className="w-4 h-4 text-indigo-400" />
                        <span>Creator & Backer Profile</span>
                      </Link>
                      <Link
                        to="/rewards"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <FiAward className="w-4 h-4 text-amber-400" />
                        <span>Guild XP & Perks</span>
                      </Link>
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-2 mt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Non-authenticated Actions */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-glow-emerald transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle navigation drawer"
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 pt-3 pb-6 animate-fadeIn">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-4">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns, tech, games..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </form>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-1 mb-5">
            <Link
              to="/discover"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive("/discover")
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <FiCompass className="w-4 h-4 text-emerald-400" />
              <span>Discover Campaigns</span>
            </Link>

            <Link
              to={isLoggedIn ? "/dashboard" : "/login"}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive("/dashboard")
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <FiLayers className="w-4 h-4 text-indigo-400" />
              <span>My Backing</span>
            </Link>

            <Link
              to="/about"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive("/about")
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <FiCheckCircle className="w-4 h-4 text-teal-400" />
              <span>Community & About</span>
            </Link>

            <Link
              to={isLoggedIn ? "/rewards" : "/login"}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive("/rewards")
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <FiAward className="w-4 h-4 text-amber-400" />
              <span>Backer Rewards & XP</span>
            </Link>
          </nav>

          {/* Gamified Backer Tier in Mobile Drawer (if logged in) */}
          {isLoggedIn && (
            <div className="mb-4 p-3 rounded-2xl bg-slate-900 border border-indigo-500/30">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <FaGem className="text-indigo-400" /> {userTierName}
                </span>
                <span className="font-semibold text-emerald-400">{userXP} XP</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Mobile Start Project CTA */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/create");
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-heading font-bold text-sm shadow-glow-emerald flex items-center justify-center gap-2"
            >
              <FaRocket className="w-4 h-4" />
              <span>Start a Project</span>
            </button>

            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
              >
                Sign Out ({userFullName})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  className="py-2.5 rounded-xl bg-slate-900 text-center text-xs font-semibold text-slate-300 border border-slate-800"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="py-2.5 rounded-xl bg-emerald-500 text-center text-xs font-bold text-slate-950"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
