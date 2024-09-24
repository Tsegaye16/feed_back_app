import * as React from "react";
import { styled } from "@mui/material/styles";

import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

interface logoType {
  logo: any;
}

const CustomizedTooltips: React.FC<logoType> = ({ logo }) => {
  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <Typography color="inherit">Your company info</Typography>
          <em>{"And here's"}</em> <b>{"you can add some"}</b>{" "}
          <u>{"amazing content"}</u>. {" Right?"}
        </React.Fragment>
      }
    >
      {logo}
    </HtmlTooltip>
  );
};
export default CustomizedTooltips;
