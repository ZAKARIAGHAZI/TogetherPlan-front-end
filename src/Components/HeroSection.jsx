import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import heroIllustration from "../assets/landing-image.webp";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Event planning made simple</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Plan your events together,{" "}
              <span className="bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                effortlessly.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
              Invite friends, vote for the best date, and never struggle to find
              a time that works for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg transition-all duration-200"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 font-semibold rounded-lg hover:bg-blue-50 shadow-md transition-all duration-200"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-200/30 to-blue-400/30 blur-3xl rounded-full"></div>
            <img
              src={heroIllustration}
              alt="People collaborating on event planning"
              className="relative w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
