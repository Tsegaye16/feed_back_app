// CompanyNav.tsx
import React from "react";
import { Box } from "@mui/material";
import CustomizedTooltips from "./toolTip";

interface CompanyNavProps {
  companyData: any;
  logo: JSX.Element;
  onLogoClick: () => void;
}

const CompanyNav: React.FC<CompanyNavProps> = ({
  companyData,
  logo,
  onLogoClick,
}) => {
  return (
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
  );
};

export default CompanyNav;
