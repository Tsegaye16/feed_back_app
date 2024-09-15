import React from "react";
import About from "./about/about";
import Contact from "./form/contact/contact";
import Footer from "./footer/footer";

const Home: React.FC = () => {
  return (
    <div>
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
