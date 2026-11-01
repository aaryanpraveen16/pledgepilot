import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiClock,
  FiUsers,
  FiHeart,
  FiArrowUpRight,
  FiCheckCircle,
  FiBookmark,
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";

export interface CampaignItem {
  _id: string;
  name: string;
  description: string;
  ownerName: string;
  category?: string;
  image?: string;
  raised?: number;
  goal?: number;
  backers?: number;
  daysLeft?: number;
  badge?: "Trending" | "Ending Soon" | "Staff Pick" | string;
  milestone?: {
    target?: string | number;
    progress?: string | number;
  };
  payments?: {
    count?: string | number;
  };
}

interface CampaignCardProps {
  campaign: CampaignItem;
}

const defaultImages: Record<string, string> = {
  Technology:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  "Design & Hardware":
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  Games:
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
  "Arts & Media":
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
  Community:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  Default:
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Normalize metrics
  const goal = Number(campaign.milestone?.target || campaign.goal || 30000);
  const raised = Number(campaign.milestone?.progress || campaign.raised || 18500);
  const backers = Number(campaign.payments?.count || campaign.backers || 142);
  const daysLeft = campaign.daysLeft ?? 12;
  const percentFunded = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 999) : 0;

  const category = campaign.category || "Technology";
  const imageSrc =
    campaign.image || defaultImages[category] || defaultImages.Default;

  // Clean html tags from description if any
  const cleanDescription = (campaign.description || "")
    .replace(/(<([^>]+)>)/gi, "")
    .trim();

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="group relative flex flex-col bg-slate-900/80 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
      {/* Clickable wrapper */}
      <Link
        to={`/campaigns/campaign/${campaign._id}`}
        className="flex flex-col flex-1"
        aria-label={`View campaign: ${campaign.name}`}
      >
        {/* Media / Header Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
          <img
            src={imageSrc}
            alt={campaign.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-950/40" />

          {/* Floating Category Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-sm">
            <span>{category}</span>
          </div>

          {/* Floating Badge (e.g. Trending / Ending Soon) */}
          {campaign.badge && (
            <div className="absolute top-3 right-12 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30">
              <FaFire className="text-amber-400 text-[10px]" />
              <span>{campaign.badge}</span>
            </div>
          )}

          {/* Quick Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmark}
            title={isBookmarked ? "Remove Bookmark" : "Save Campaign"}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-slate-950/70 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-slate-900 transition-all"
          >
            {isBookmarked ? (
              <FiHeart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            ) : (
              <FiBookmark className="w-4 h-4" />
            )}
          </button>

          {/* Overlapping Creator Avatar nestled at the bottom edge */}
          <div className="absolute -bottom-3 left-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-indigo-600 p-[1.5px] shadow-lg">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">
                {(campaign.ownerName || "C").charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="text-xs font-medium text-slate-300 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-800 flex items-center gap-1">
              {campaign.ownerName || "Creator"}
              <FiCheckCircle className="text-emerald-400 text-[11px]" />
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-5 pt-6">
          {/* Title with hover emerald glow */}
          <h3 className="font-heading text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2 flex items-center justify-between">
            <span>{campaign.name}</span>
            <FiArrowUpRight className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-emerald-400 flex-shrink-0 ml-1 w-4 h-4" />
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
            {cleanDescription ||
              "Support this ambitious breakthrough project and unlock exclusive founder backer perks and early access."}
          </p>

          {/* Progress Bar & Target */}
          <div className="space-y-2 mt-auto pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400">
                {percentFunded}% funded
              </span>
              <span className="text-slate-400 font-medium">
                ${raised.toLocaleString()} of ${goal.toLocaleString()}
              </span>
            </div>

            {/* Glowing Emerald Progress Track */}
            <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                style={{ width: `${Math.min(percentFunded, 100)}%` }}
              />
            </div>
          </div>

          {/* Micro-Stats Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <FiUsers className="text-slate-500 w-3.5 h-3.5" />
              <span>
                <strong className="text-slate-200 font-semibold">
                  {backers.toLocaleString()}
                </strong>{" "}
                backers
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <FiClock className="text-slate-500 w-3.5 h-3.5" />
              <span>
                <strong
                  className={`font-semibold ${
                    daysLeft <= 3 ? "text-amber-400" : "text-slate-200"
                  }`}
                >
                  {daysLeft}
                </strong>{" "}
                days left
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CampaignCard;

