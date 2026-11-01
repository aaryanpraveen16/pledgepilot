import React, { useEffect, useState } from "react";
import "./Stats.css";
import { campaignStats } from "../../services/statsServices";

const Stats = () => {
  const [campaignStatsData, setCampaignStatsData] = useState<number | null>(null);
  const [paymentStatsData, setPaymentStatsData] = useState<number | null>(null);
  const [rewardStatsData, setRewardStatsData] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCampaignData = async () => {
      try {
        const campaignStatsResponse: any = await campaignStats();
        if (isMounted && campaignStatsResponse) {
          setCampaignStatsData(campaignStatsResponse.campaignCount ?? 0);
          setPaymentStatsData(campaignStatsResponse.paymentCount ?? 0);
          setRewardStatsData(campaignStatsResponse.rewardCount ?? 0);
        }
      } catch (error) {
        console.error("Error fetching campaign stats:", error);
      }
    };
    fetchCampaignData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid-container">
      <div className="grid-item">
        {campaignStatsData != null ? campaignStatsData : "0"} <br /> campaigns listed
      </div>
      <div className="grid-item">
        ${paymentStatsData != null ? paymentStatsData : "0"} <br /> total donations made
      </div>
      <div className="grid-item">
        ${rewardStatsData != null ? rewardStatsData : "0"} <br /> total rewards earned
      </div>
    </div>
  );
};

export default Stats;
