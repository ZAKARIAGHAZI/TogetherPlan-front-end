import React from "react";
import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-blue-800">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-extrabold text-white mb-6">
        Ready to Simplify Your Planning?
      </h2>
      <p className="text-xl text-blue-100 mb-10">
        Join thousands of users already planning smarter with TogetherPlan.
        Start organizing your events today — completely free!
      </p>
      <Link
        to="/register"
        className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
      >
        Create Your Account
      </Link>
    </div>
  </section>
);

export default CTASection;
