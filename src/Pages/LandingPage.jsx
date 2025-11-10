import React from "react";
import Navbar from "../Components/NavBar";
import HeroSection from "../Components/HeroSection";
import FeaturesSection from "../Components/FeaturesSection";
import AboutSection from "../Components/AboutSection";
import CTASection from "../Components/CTASection";
import ContactSection from "../Components/ContactSection";
import Footer from "../Components/Footer";


const LandingPage = () => (
  <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <AboutSection />
    <CTASection />
    <ContactSection />
    <Footer />
  </div>
);

export default LandingPage;
