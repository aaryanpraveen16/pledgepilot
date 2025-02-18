import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  CircularProgress,
  Avatar,
  AvatarGroup
} from "@mui/material";
import { getUserById } from "../../services/userServices";

const cardImg = require("../../assets/sample-image.jpg");

const CampaignTile = ({ campaignObject }: any) => {
  console.log(campaignObject)
  const [owners, setOwners] = useState<any[]>([]);
  const DESCRIPTION_THRESHOLD = 35;

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const ownersData = await Promise.all(
          campaignObject.owners.map(async (owner: any) => {
            const userData = await getUserById(owner.user);
            return { ...owner, userData };
          })
        );
        setOwners(ownersData);
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    fetchOwners();
  }, [campaignObject.owners]);

  const descriptionContent =
    campaignObject.description.length > DESCRIPTION_THRESHOLD
      ? `${campaignObject.description.substring(0, DESCRIPTION_THRESHOLD)}...`
      : campaignObject.description;
  const regex = /(<([^>]+)>)/gi;

  // Calculate progress percentage
  const progress = (campaignObject.milestone.progress / campaignObject.milestone.target) * 100;

  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: "16px",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
        },
        textDecoration: "none",
        overflow: "hidden",
        position: "relative"
      }}
      component={Link}
      to={`/campaigns/campaign/${campaignObject._id}`}
    >
      {/* Status Badge */}
      <Chip
        label={campaignObject.isActive ? "Active" : "Inactive"}
        color={campaignObject.isActive ? "success" : "default"}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1
        }}
      />

      {/* Campaign Image */}
      <CardMedia
        component="img"
        height="180"
        image={cardImg}
        alt={`${campaignObject.name} campaign`}
        sx={{
          objectFit: "cover",
          borderBottom: "1px solid #ddd",
        }}
      />

      {/* Progress Circle */}
      <Box
        sx={{
          position: "absolute",
          top: 150,
          right: 20,
          backgroundColor: "white",
          borderRadius: "50%",
          padding: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={60}
          thickness={4}
          sx={{
            color: progress >= 100 ? "success.main" : "primary.main",
            backgroundColor: "#f0f0f0",
            borderRadius: "50%"
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      </Box>

      {/* Campaign Content */}
      <CardContent>
        {/* Category */}
        <Chip 
          label={campaignObject.category.toUpperCase()} 
          size="small" 
          sx={{ mb: 1 }}
        />

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: "8px",
          }}
        >
          {campaignObject.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#555",
            fontStyle: "italic",
            marginBottom: "12px",
          }}
        >
          {descriptionContent.replace(regex, "")}
        </Typography>

        {/* Owners */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <AvatarGroup max={3} sx={{ mr: 1 }}>
            {owners.map((owner, index) => (
              <Avatar 
                key={index} 
                alt={`${owner.userData.firstName} ${owner.userData.lastName}`}
                src={owner.userData.avatar}
              >
                {owner.userData.firstName[0]}
              </Avatar>
            ))}
          </AvatarGroup>
          <Typography variant="caption" color="text.secondary">
            {owners.length > 1 ? `${owners.length} contributors` : "1 contributor"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CampaignTile;