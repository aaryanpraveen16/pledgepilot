import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Button, 
  Box, 
  Typography, 
  Grid, 
  Divider,
  Chip,
  Avatar, 
  LinearProgress
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { PaymentButton } from "../../Components/Payment/PaymentButton";
import { RedirectButton } from "../../Components/Payment/RedirectButton";
import FollowButton from "../../Components/Buttons/FollowButton";
import { Milestone } from "../../Components/Milestone/Milestone";
import { getUserInTheSession } from "../../Utils/SessionStorage";
import { getCampaign } from "../../services/campaingServices";
import { getUserById } from "../../services/userServices";

const CampaignPage = () => {
  const [campaign, setCampaign] = useState<any>(null);
  const [owners, setOwners] = useState<any[]>([]);
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const sessionUser = getUserInTheSession();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const campaignResponse = await getCampaign(campaignId);
        setCampaign(campaignResponse);

        // Fetch all owners' data
        const ownersData = await Promise.all(
          campaignResponse.owners.map(async (owner: any) => {
            const userData = await getUserById(owner.user);
            return { ...owner, userData };
          })
        );
        setOwners(ownersData);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  const isOwner = sessionUser && campaign?.owners.some(
    (owner: any) => owner.user === sessionUser._id
  );

  if (!campaign) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "20vh" }}>
        <Typography variant="h4" color="error">
          404: Campaign Not Found!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "40px", maxWidth: "1200px", margin: "5vh auto" }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
        {campaign.name}
      </Typography>
      
      {/* Category */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Chip 
          label={campaign.category.toUpperCase()} 
          color="primary" 
          sx={{ mr: 1 }}
        />
        {campaign.subcategory && (
          <Chip 
            label={campaign.subcategory} 
            variant="outlined"
          />
        )}
      </Box>

      <Milestone campaignId={campaignId} />
      <Divider sx={{ mb: 4, borderWidth: "2px" }} />

      <Grid container spacing={4}>
        {/* Left Section */}
        <Grid item xs={12} md={8}>
          <Box sx={{ backgroundColor: "#fff", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Campaign Description</Typography>
            <div
              className="ck-content"
              dangerouslySetInnerHTML={{ __html: campaign.description }}
            />
          </Box>

          {/* Campaign Owners */}
          <Box sx={{ backgroundColor: "#fff", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Campaign Team</Typography>
            <Grid container spacing={2}>
              {owners.map((owner, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {owner.userData.firstName} {owner.userData.lastName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {owner.role.charAt(0).toUpperCase() + owner.role.slice(1)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {isOwner && (
            <Button
              variant="contained"
              onClick={() => navigate(`/create/${campaignId}`)}
              sx={{ mt: 2 }}
            >
              Edit Campaign
            </Button>
          )}
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={4}>
          <Box sx={{ backgroundColor: "#fff", p: 3, borderRadius: 2 }}>
            {/* Campaign Stats */}
            <Typography variant="h6" sx={{ mb: 2 }}>Campaign Progress</Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary">
                Goal: ${campaign.milestone.target}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Raised: ${campaign.milestone.progress}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(campaign.milestone.progress / campaign.milestone.target) * 100} 
                sx={{ mt: 1 }}
              />
            </Box>

            <FollowButton campaign={campaign} />
            {sessionUser ? (
              <PaymentButton campaign={campaign} />
            ) : (
              <RedirectButton />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CampaignPage;