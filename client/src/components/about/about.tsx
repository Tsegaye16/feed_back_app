import React from "react";
import { useNavigate } from "react-router-dom";

import "./about.css";

const About: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="responsive-container-block bigContainer">
      <div className="responsive-container-block Container">
        <img
          className="mainImg"
          src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/eaboutus1.svg"
          alt=""
        />
        <div className="allText aboveText">
          <p className="text-blk headingText">About</p>
          <p className="text-blk description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fermentum
            pulvinar ullamcorper suspendisse ac eget. Pellentesque tempus leo in
            ullamcorper quis vestibulum ligula elementum ut.
          </p>
          <button className="explore" onClick={() => navigate("/auth")}>
            Let's Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
