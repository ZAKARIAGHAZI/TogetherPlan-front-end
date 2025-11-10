import React from "react";
import { Calendar, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold">TogetherPlan</span>
          </div>
          <p className="text-gray-400">
            Making event planning simple, collaborative, and enjoyable for
            everyone.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {["Home", "Features", "About", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} TogetherPlan. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
