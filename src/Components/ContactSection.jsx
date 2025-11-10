import React from "react";

const ContactSection = () => (
  <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
        Get in Touch
      </h2>
      <p className="text-xl text-gray-600 mb-10">
        Have questions? We'd love to hear from you. Send us a message and we'll
        respond as soon as possible.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <a
          href="mailto:support@togetherplan.com"
          className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Email Us
        </a>
        <span className="text-gray-600">or</span>
        <a
          href="#"
          className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Schedule a Demo
        </a>
      </div>
    </div>
  </section>
);

export default ContactSection;
