// Servey.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Paper, Box, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import TrueFalse from "./questionCategory/trueFalse/trueFalse";
import Rate from "./questionCategory/rate/rate";
import MultipleChoice from "./questionCategory/multipleChoice/multipleChoice";
import Essay from "./questionCategory/essay/essay";
import GenerateQR from "./QR/GenerateQR";
import CompanyForm from "./companyForm";
import CompanyNav from "./companyNav";
import { addCompanyInfo, getCompanyById } from "../../../redux/action/company";

const Servey: React.FC = () => {
  const dispatch = useDispatch();
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [companyData, setCompanyData] = useState<any>({
    name: "",
    logo: null,
    backGroundColor: "#bcb9b9",
    textColor: "#000000",
  });

  const token = useSelector((state: any) => state.auth?.authData);
  const decodedToken: any = jwtDecode(token);
  const managerId = decodedToken.id;

  useEffect(() => {
    if (managerId) {
      dispatch(getCompanyById(managerId) as any);
    }
  }, [dispatch, managerId]);

  const companyInfo = useSelector(
    (state: any) => state.company?.companyData?.result
  );

  useEffect(() => {
    if (companyInfo) {
      setCompanyData({
        name: companyInfo.name,
        logo: companyInfo.logo,
        backGroundColor: companyInfo.backGroundColor,
        textColor: companyInfo.textColor,
      });
    }
  }, [companyInfo]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", companyData.name);
    if (companyData.logo) {
      formData.append("logo", companyData.logo);
    }
    formData.append("backGroundColor", companyData.backGroundColor);
    formData.append("textColor", companyData.textColor);
    formData.append("managerId", managerId);

    await dispatch(addCompanyInfo(formData) as any);
  };

  const handleFileChange = (e: any) => {
    const logo = e.target.files[0];
    setCompanyData((prevData: any) => ({
      ...prevData,
      logo: logo,
    }));
  };

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
        `http://localhost:4000/${companyInfo?.logo}` ||
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
        <CompanyForm
          companyData={companyData}
          setCompanyData={setCompanyData}
          handleSave={handleSave}
          handleFileChange={handleFileChange}
          onCancel={() => setShowNavbar(true)}
        />
      ) : (
        <>
          <CompanyNav
            companyData={companyData}
            logo={logo}
            onLogoClick={() => setShowNavbar(false)}
          />
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
