import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiShield,
  FiAlertCircle,
  FiX,
  FiCompass,
  FiAward,
} from "react-icons/fi";
import { FaShieldAlt, FaRocket } from "react-icons/fa";
import { registerUser } from "../../services/userServices";
import { userLogin } from "../../store/UserSlice";
import { AppDispatch } from "../../store/store";
import { registerUserViaOauth, userDB } from "../../services/oauthService";

const LogoIcon = require("../../assets/white-logo.png");
const LogoText = require("../../assets/pledge-pilot-text.png");

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Persona / Role Selection
  const [persona, setPersona] = useState<"backer" | "creator">("backer");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "bg-slate-700" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Good", color: "bg-teal-400" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "Too short", color: "bg-rose-500" };
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!emailAddress.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Split full name into first and last
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "Member";
      const currentDate = new Date().toISOString().split("T")[0];

      const registerPayload = {
        firstName,
        lastName,
        emailAddress: emailAddress.trim(),
        password,
        accountCreationDate: currentDate,
        role: persona,
      };

      const registerRes = await registerUser(registerPayload);

      if (registerRes) {
        setSuccessMessage("Account created successfully! Logging you in...");

        // Auto login on successful registration
        try {
          const loginRes = await dispatch(
            userLogin({
              emailAddress: emailAddress.trim(),
              password,
            })
          );
          if (loginRes.payload) {
            setTimeout(() => navigate("/dashboard"), 800);
            return;
          }
        } catch {
          // If auto login is not immediate, send to login page
        }

        setTimeout(() => navigate("/login"), 1200);
      } else {
        setErrorMessage("Registration failed. An account with this email may already exist.");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setErrorMessage(err?.message || "An unexpected error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth 2.0 Registration
  const signupWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setErrorMessage(null);
      try {
        const userInfoRes = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const googleUser = userInfoRes.data;

        const userPayload = {
          firstName: googleUser.given_name || "Google",
          lastName: googleUser.family_name || "User",
          emailAddress: googleUser.email,
          accountCreationDate: new Date().toISOString().split("T")[0],
          role: persona,
        };

        const existingUserRes = await userDB(googleUser.email);
        let targetUser = existingUserRes?.[0];

        if (!targetUser) {
          await registerUserViaOauth(userPayload);
          const newlyAdded = await userDB(googleUser.email);
          targetUser = newlyAdded?.[0];
        }

        const sessionData = targetUser || userPayload;
        sessionStorage.setItem("user", JSON.stringify(sessionData));
        localStorage.setItem("user", JSON.stringify(sessionData));

        navigate("/dashboard");
      } catch (err: any) {
        console.error("Google OAuth error:", err);
        setErrorMessage("Google registration could not be completed. Please try again.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setErrorMessage("Google Sign-In was cancelled or encountered an error.");
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-12 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Micro-Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Container: Refined Split Presentation on Desktop / Centered Card */}
      <div className="relative w-full max-w-5xl z-10 my-auto">
        {/* Brand Bar (Centered above) */}
        <div className="text-center mb-6 lg:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3 group transition-transform duration-200 hover:scale-105"
            aria-label="PledgePilot Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center p-1.5 overflow-hidden">
                <img
                  src={LogoIcon}
                  alt="PledgePilot Emblem"
                  className="w-full h-full object-contain brightness-125"
                />
              </div>
            </div>
            <img
              src={LogoText}
              alt="PledgePilot"
              className="h-8 w-auto object-contain brightness-110 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            />
          </Link>
        </div>

        {/* Main Grid Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl shadow-black/70 overflow-hidden">
          {/* Left Column: Trust, Social Proof & Benefits Showcase (Hidden on small, prominent on lg) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
            {/* Background subtle radial highlight */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Decentralized-Grade Crowdfunding
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Empowering visionary ideas with guaranteed escrow.
              </h2>

              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Whether you’re backing groundbreaking hardware or launching your creative vision, PledgePilot ensures security and transparency at every step.
              </p>

              {/* Value Proposition Items */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                    <FiShield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Milestone-Gated Escrow
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-normal">
                      Funds disburse in audited phases. You approve milestones before payments unlock.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                    <FiAward className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Backer Guild XP & Perks
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-normal">
                      Earn on-chain reputation points, unlock collector badges, and claim VIP discounts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                    <FaRocket className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Zero Hidden Platform Fees
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-normal">
                      Clean 0% surprise fees with direct Stripe integration and transparent conversion rates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof Stats at Bottom of Left Column */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="block text-lg font-extrabold text-white font-heading">
                    $4.8M+
                  </span>
                  <span className="text-slate-400 text-[11px]">Total Funded</span>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <span className="block text-lg font-extrabold text-white font-heading">
                    98.4%
                  </span>
                  <span className="text-slate-400 text-[11px]">Milestone Delivery</span>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <span className="block text-lg font-extrabold text-white font-heading">
                    28,000+
                  </span>
                  <span className="text-slate-400 text-[11px]">Active Backers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Registration Form */}
          <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center">
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Join the PledgePilot community
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Back innovative projects, earn XP rewards, and bring ideas to life.
              </p>
            </div>

            {/* Role / Persona Selector */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                I am joining as a
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setPersona("backer")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    persona === "backer"
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <FiCompass className="w-3.5 h-3.5" />
                  <span>I want to back projects</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPersona("creator")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    persona === "creator"
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <FaRocket className="w-3.5 h-3.5" />
                  <span>I want to launch a campaign</span>
                </button>
              </div>
            </div>

            {/* Error or Success Banner */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <FiAlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="flex-1 leading-normal">{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-red-400 hover:text-red-200 transition-colors"
                  aria-label="Dismiss error"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <FiCheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="flex-1 leading-normal">{successMessage}</span>
              </div>
            )}

            {/* Google OAuth 2.0 Registration Button */}
            <button
              type="button"
              onClick={() => signupWithGoogle()}
              disabled={isGoogleLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-100 font-semibold text-sm border border-slate-700/80 hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none group"
            >
              {isGoogleLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-emerald-400"
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
              ) : (
                /* Official Google 4-Color Vector Icon */
                <svg
                  className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>
                {isGoogleLoading ? "Connecting to Google..." : "Sign up with Google"}
              </span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-wider">
                  or sign up with email
                </span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="signupEmail"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input
                    id="signupEmail"
                    name="signupEmail"
                    type="email"
                    autoComplete="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Password & Confirm Password (2-col grid on tablet/desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password Field */}
                <div>
                  <label
                    htmlFor="signupPassword"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FiLock className="w-4 h-4" />
                    </div>
                    <input
                      id="signupPassword"
                      name="signupPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 chars"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FiLock className="w-4 h-4" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                        passwordsMatch
                          ? "border-emerald-500/80 focus:ring-emerald-500"
                          : "border-slate-700/80 focus:ring-emerald-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator Dots / Segments */}
              {password.length > 0 && (
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Password strength:</span>
                    <span
                      className={`font-semibold ${
                        passwordStrength.score >= 3
                          ? "text-emerald-400"
                          : passwordStrength.score === 2
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`rounded-full transition-all duration-300 ${
                          passwordStrength.score >= step
                            ? passwordStrength.color
                            : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  {passwordsMatch && (
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] mt-2">
                      <FiCheck className="w-3.5 h-3.5" />
                      <span>Passwords match</span>
                    </div>
                  )}
                </div>
              )}

              {/* Legal Agreement Checkbox */}
              <div className="flex items-start pt-1">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/40 focus:ring-offset-slate-900 cursor-pointer accent-emerald-500"
                />
                <label
                  htmlFor="agreeTerms"
                  className="ml-2 block text-xs text-slate-400 cursor-pointer select-none leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    to="/about"
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/about"
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* Primary CTA: Glowing Emerald "Create Account" Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isGoogleLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-heading font-bold text-sm tracking-wide shadow-glow-emerald hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950"
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <FiArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Navigation */}
            <div className="mt-6 text-center text-xs text-slate-400">
              <span>Already have an account?</span>{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>

        {/* Security Trust Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <FaShieldAlt className="text-emerald-500 text-xs" />
          <span>256-Bit SSL Encrypted • Non-Custodial Smart Escrow • Escrow Backer Protection</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
export { Signup as SignUp };
