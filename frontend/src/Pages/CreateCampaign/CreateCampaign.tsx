import React, { useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Container,
  MenuItem,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { saveCampaign, updateCampaign } from "../../services/campaingServices";
import { updateUserByEmail } from "../../services/userServices";

const CATEGORIES = [
  'technology',
  'art',
  'film',
  'music',
  'games',
  'publishing',
  'fashion',
  'food',
  'education',
  'nonprofit',
  'social_cause',
  'environment',
  'health',
  'community',
  'other'
];
interface CampaignData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  owners: Array<{
    user: string;
    role: string;
    permissions: string[];
  }>;
  startDate: string;
  endDate: string;
  isActive: boolean;
  milestone: {
    target: number;
    progress: number;
    isPublicProgress: boolean;
  };
  budget: {
    total: number;
    spent: number;
    dailyLimit: number;
  };
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    averageOrderValue: number;
  };
}
const CreateCampaign = () => {
  const navigate = useNavigate();
  const profile = JSON.parse(sessionStorage.getItem("user") ?? "{}");
  const { campaignId } = useParams();
  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    owners: [{
      user: profile._id,
      role: "primary",
      permissions: [
        'edit_campaign',
        'manage_funds',
        'post_updates',
        'moderate_community',
        'view_analytics'
      ]
    }],
    startDate: "",
    endDate: "",
    isActive: true,
    milestone: {
      target: 0,
      progress: 0,
      isPublicProgress: true
    },
    budget: {
      total: 0,
      spent: 0,
      dailyLimit: 0
    },
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      averageOrderValue: 0
    }
  } as CampaignData);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCampaignData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (
    section: keyof CampaignData, 
    field: string, 
    value: any
  ) => {
    setCampaignData((prev: CampaignData) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value
      }
    }));
  };
  const handleEditorChange = (_event: any, editor: any) => {
    const data = editor.getData();
    setCampaignData((prev) => ({ ...prev, description: data }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let campaign;
      if (!campaignId) {
        campaign = await saveCampaign(campaignData);
      } else {
        campaign = await updateCampaign(campaignId, campaignData);
      }

      profile.createdProjects.push(campaign._id);
      await updateUserByEmail(profile.emailAddress, profile);
      sessionStorage.setItem("user", JSON.stringify(profile));
      navigate("/discover");
    } catch (error) {
      console.error("Error saving campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}>
          Create Campaign
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Campaign Title"
                name="name"
                value={campaignData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={campaignData.category}
                  label="Category"
                  onChange={(e: SelectChangeEvent) => 
                    handleInputChange(e as any)
                  }
                  name="category"
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.replace('_', ' ').toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Subcategory"
                name="subcategory"
                value={campaignData.subcategory}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            {/* Campaign Duration */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Start Date"
                type="date"
                name="startDate"
                value={campaignData.startDate}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="End Date"
                type="date"
                name="endDate"
                value={campaignData.endDate}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Fundraising Goals */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Fundraising Details</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Fundraising Goal"
                type="number"
                name="fundraisingGoal"
                value={campaignData.milestone.target}
                onChange={(e) => handleNestedInputChange('milestone', 'target', Number(e.target.value))}
                fullWidth
                required
              />
            </Grid>

            {/* Budget Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Budget Information</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Total Budget"
                type="number"
                name="totalBudget"
                value={campaignData.budget.total}
                onChange={(e) => handleNestedInputChange('budget', 'total', Number(e.target.value))}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Daily Budget Limit"
                type="number"
                name="dailyLimit"
                value={campaignData.budget.dailyLimit}
                onChange={(e) => handleNestedInputChange('budget', 'dailyLimit', Number(e.target.value))}
                fullWidth
              />
            </Grid>

            {/* Campaign Description */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Campaign Description</Typography>
              <Box sx={{ mt: 2, mb: 2 }}>
                <CKEditor
                  editor={ClassicEditor}
                  data={campaignData.description}
                  onChange={handleEditorChange}
                  config={{
                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
                  }}
                />
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#EF476F",
                  "&:hover": { backgroundColor: "#D3365E" },
                  padding: "10px",
                  fontWeight: "bold",
                  mt: 2
                }}
              >
                {loading ? "Creating Campaign..." : "Create Campaign"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateCampaign;