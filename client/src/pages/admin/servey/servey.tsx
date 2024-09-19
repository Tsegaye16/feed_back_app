import React, { useState, useEffect } from "react";

import {
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  Input,
  Typography,
} from "@mui/material";
import "./servey.css";
import TrueFalse from "./questionCategory/trueFalse/trueFalse";
import Rate from "./questionCategory/rate/rate";
import MultipleChoice from "./questionCategory/multipleChoice/multipleChoice";
import Essay from "./questionCategory/essay/essay";
import GenerateQR from "./QR/GenerateQR";
import { useResolvedPath } from "react-router-dom";

const Servey: React.FC = () => {
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [companyName, setCompanyName] = useState<string>("");
  const [showNavbar, setShowNavbar] = useState<boolean>(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setLogo(file);
      } else {
        alert("Please upload a valid image file.");
      }
    }
  };

  useEffect(() => {
    if (logo) {
      const url = URL.createObjectURL(logo);
      setLogoUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [logo]);

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBgColor(e.target.value);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  };

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const handleSave = () => {
    setShowNavbar(true);
  };

  // Components array for page navigation
  const components = [
    <TrueFalse />,
    <MultipleChoice />,
    <Essay />,
    <Rate />,
    <GenerateQR />,
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < components.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Handle the submission logic here
    alert("Survey submitted!");
  };

  return (
    <div>
      {!showNavbar ? (
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
            <Input
              type="file"
              onChange={handleLogoChange}
              inputProps={{ accept: "image/*" }}
              sx={{ display: "block", mb: 2 }}
            />
            <Typography variant="caption">Upload Logo</Typography>
          </Box>

          <Box sx={{ my: 3 }}>
            <TextField
              label="Background Color"
              type="color"
              value={bgColor}
              onChange={handleBgColorChange}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Box>

          <Box sx={{ my: 3 }}>
            <TextField
              label="Text Color"
              type="color"
              value={textColor}
              onChange={handleTextColorChange}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Box>

          <Box sx={{ my: 3 }}>
            <TextField
              label="Company Name"
              value={companyName}
              onChange={handleCompanyNameChange}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
            sx={{ mt: 3 }}
          >
            Save
          </Button>
        </Box>
      ) : (
        <>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: bgColor,
              color: textColor,
              padding: "10px 20px",
              height: "100px",
              width: "100%",
              position: "fixed",
              top: "0",
              left: "0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Company Logo"
                style={{
                  height: "60%",
                  marginRight: "20px",
                  objectFit: "contain",
                }}
              />
            )}
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              {companyName}
            </div>
          </nav>
          <div style={{ paddingTop: "120px" }}>
            <Grid container justifyContent="center">
              <Grid item xs={12} md={8}>
                {/* Container with box shadow */}
                <Paper elevation={3}>
                  <Box p={4} boxShadow={3} borderRadius={2}>
                    {/* Displaying the current component */}
                    <Box>{components[currentIndex]}</Box>

                    {/* Navigation Buttons */}
                    <Box mt={3} display="flex" justifyContent="space-between">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBack}
                        disabled={currentIndex === 0}
                      >
                        Back
                      </Button>
                      {currentIndex === components.length - 1 ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleNext}
                        >
                          Next
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};

export default Servey;
