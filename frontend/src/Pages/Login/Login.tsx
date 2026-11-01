import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiAlertCircle,
  FiX,
  FiZap,
} from "react-icons/fi";
import { FaShieldAlt } from "react-icons/fa";
import { userLogin } from "../../store/UserSlice";
import { AppDispatch } from "../../store/store";
import { registerUserViaOauth, userDB } from "../../services/oauthService";

const LogoIcon = require("../../assets/white-logo.png");
const LogoText = require("../../assets/pledge-pilot-text.png");

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Role toggle: 'creator' | 'backer'
  const [accountType, setAccountType] = useState<"creator" | "backer">("creator");

  // Form states
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);

  // Quick Demo Autofill Helper
  const handleQuickFill = (type: "creator" | "backer") => {
    setAccountType(type);
    setErrorMessage(null);
    if (type === "creator") {
      setEmailAddress("creator@pledgepilot.io");
      setPassword("PledgePilot2026!");
    } else {
      setEmailAddress("backer@pledgepilot.io");
      setPassword("PledgePilot2026!");
    }
  };

  // Standard Email/Password Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailAddress.trim() || !password.trim()) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(
        userLogin({
          emailAddress: emailAddress.trim(),
          password,
        })
      );

      if (result.payload) {
        navigate("/dashboard");
      } else {
        setErrorMessage(
          "Invalid email or password. Please verify your credentials."
        );
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMessage(
        err?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth 2.0 Integration
  const loginWithGoogle = useGoogleLogin({
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
        setErrorMessage(
          "Google authentication could not be completed. Please try again."
        );
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setErrorMessage("Google Sign-In was cancelled or encountered an error.");
    },
  });

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setIsForgotSubmitting(true);
    setTimeout(() => {
      setIsForgotSubmitting(false);
      setForgotSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Dynamic Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Micro-Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
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

        {/* Sleek Slate-900 Card with Subtle Glassmorphism */}
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/60 relative">
          {/* Account Type Toggle */}
          <div className="flex p-1 bg-slate-800/90 rounded-xl border border-slate-700/60 mb-6">
            <button
              type="button"
              onClick={() => setAccountType("creator")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                accountType === "creator"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Creator Account
            </button>
            <button
              type="button"
              onClick={() => setAccountType("backer")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                accountType === "backer"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Backer Account
            </button>
          </div>

          {/* Heading & Subtitle */}
          <div className="text-center mb-7">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {accountType === "creator"
                ? "Welcome back, creator"
                : "Log in to your backer account"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              {accountType === "creator"
                ? "Manage your active campaigns, deliverable milestones, and backer updates."
                : "Track backed innovations, claim tier perks, and level up your Backer Guild XP."}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
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

          {/* High-Friction-Reducing Google OAuth 2.0 Button */}
          <button
            type="button"
            onClick={() => loginWithGoogle()}
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
              {isGoogleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-wider">
                or continue with email
              </span>
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="emailAddress"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="email"
                  autoComplete="email"
                  required
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder={
                    accountType === "creator"
                      ? "creator@pledgepilot.io"
                      : "backer@pledgepilot.io"
                  }
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center pt-1">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/40 focus:ring-offset-slate-900 cursor-pointer accent-emerald-500"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-xs text-slate-400 cursor-pointer select-none"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Primary CTA: Glowing Emerald-500 to Emerald-600 Button */}
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
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Autofill Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-400">
              <FiZap className="w-3 h-3 text-amber-400" /> Demo preview:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("creator")}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors border border-slate-700"
              >
                Creator
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("backer")}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors border border-slate-700"
              >
                Backer
              </button>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <span>Don't have an account?</span>{" "}
            <Link
              to="/register"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Security & Escrow Trust Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <FaShieldAlt className="text-emerald-500 text-xs" />
          <span>256-Bit SSL Encrypted • Escrow Backer Protection</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSubmitted(false);
                setForgotEmail("");
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>

            {forgotSubmitted ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Recovery Link Dispatched
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We've sent password reset instructions to{" "}
                  <strong className="text-slate-200">{forgotEmail}</strong>.
                  Please check your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                    setForgotEmail("");
                  }}
                  className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="text-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                    <FiShield className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    Reset Password
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your email to receive recovery instructions.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="forgotEmail"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="forgotEmail"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isForgotSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all disabled:opacity-50"
                >
                  {isForgotSubmitting ? "Sending Link..." : "Send Recovery Link"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
