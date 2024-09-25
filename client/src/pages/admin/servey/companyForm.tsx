// CompanyForm.tsx
import React, { useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

interface CompanyFormProps {
  companyData: any;
  setCompanyData: React.Dispatch<React.SetStateAction<any>>;
  handleSave: (event: React.FormEvent) => Promise<void>;
  handleFileChange: (e: any) => void;
  onCancel: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  companyData,
  setCompanyData,
  handleSave,
  handleFileChange,
  onCancel,
}) => {
  return (
    <form encType="multipart/form-data" onSubmit={handleSave}>
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Design Your Navbar
        </Typography>
        <Box sx={{ my: 3 }}>
          <TextField
            label="Company Name"
            name="name"
            value={companyData.name}
            onChange={(event) =>
              setCompanyData({ ...companyData, name: event.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ my: 3 }}>
          <input
            type="file"
            id="logo"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Typography variant="caption">Upload Logo</Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <TextField
            label="Background Color"
            type="color"
            name="backGroundColor"
            value={companyData.backGroundColor}
            onChange={(event) =>
              setCompanyData({
                ...companyData,
                backGroundColor: event.target.value,
              })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ my: 3 }}>
          <TextField
            label="Text Color"
            type="color"
            name="textColor"
            value={companyData.textColor}
            onChange={(event) =>
              setCompanyData({
                ...companyData,
                textColor: event.target.value,
              })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
        </Box>
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            sx={{ mt: 3 }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 3 }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default CompanyForm;
