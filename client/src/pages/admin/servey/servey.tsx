import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Paper, Box, TextField, Button, Typography } from "@mui/material";
import Tooltip from "@mui/material";
import TrueFalse from "./questionCategory/trueFalse/trueFalse";
import Rate from "./questionCategory/rate/rate";
import MultipleChoice from "./questionCategory/multipleChoice/multipleChoice";
import Essay from "./questionCategory/essay/essay";
import GenerateQR from "./QR/GenerateQR";
import { addCompanyInfo } from "../../../logics/action/company";
import CustomizedTooltips from "./toolTip";
import { jwtDecode } from "jwt-decode";
//import { jwtDecode } from "jwt-decode"; // Ensure correct import

const Servey: React.FC = () => {
  const dispatch = useDispatch();
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const [companyData, setCompanyData] = useState<any>({
    name: "",
    logo: "",
    backGroundColor: "#bcb9b9",
    textColor: "#000000",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const token = useSelector((state: any) => state.auth?.authData);
  const decodedToken: any = jwtDecode(token);
  const managerId = decodedToken.id;
  console.log("managerId: ", managerId);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append("name", companyData.name);
    formData.append("backGroundColor", companyData.backGroundColor);
    formData.append("textColor", companyData.textColor);

    if (logoFile) {
      formData.append("logo", logoFile); // Append logo file to form data
    }

    // Add any other form data you need to send to backend

    setShowNavbar(true);

    // Dispatch FormData to the backend
    await dispatch(addCompanyInfo(formData) as any);
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
    alert("Survey submitted!");
  };

  const logo = (
    <img
      src={
        companyData.logo ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyBB8FzTKP7KAP2No_Ow0TjIOLTch2COaLHMJ-VvsDz2rfl5v1FPbmSfyhaf_9cr2Kg7U&usqp=CAU"
      }
      alt="Company Logo"
      style={{
        height: "60%",
        marginRight: "20px",
        objectFit: "contain",
        cursor: "pointer",
        borderRadius: "50%",
      }}
      onClick={() => setShowNavbar(false)}
    />
  );

  return (
    <div>
      {!showNavbar ? (
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
                accept="image/*"
                name="logo"
                onChange={(event: any) => {
                  setLogoFile(event?.target.files[0]);
                }}
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

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 3 }}
            >
              Save
            </Button>
          </Box>
        </form>
      ) : (
        <>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: companyData.backGroundColor,
              color: companyData.textColor,
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
            {<CustomizedTooltips logo={logo} />}
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              {companyData.name || "Anonymous"}
            </div>
          </nav>
          <div style={{ paddingTop: "120px" }}>
            <Grid container justifyContent="center">
              <Grid item xs={12} md={8}>
                <Paper elevation={3}>
                  <Box p={4} boxShadow={3} borderRadius={2}>
                    <Box>{components[currentIndex]}</Box>
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
