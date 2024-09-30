import React from "react";
import About from "./about/about";

import Header from "./header/header";

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <About />
    </div>
  );
};

export default Home;
