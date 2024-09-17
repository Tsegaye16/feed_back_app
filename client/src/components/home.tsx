import React from "react";
import About from "./about/about";
import Contact from "./form/contact/contact";
import Footer from "./footer/footer";
import Header from "./header/header";

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
