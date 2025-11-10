import React from "react";
import { Calendar, Users, Zap, Bell } from "lucide-react";

const features = [
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Smart Event Scheduling",
    description:
      "Find the perfect time for everyone using intelligent algorithms.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Group Voting on Dates",
    description: "Vote democratically on preferred times with live updates.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Instant Invitations",
    description:
      "Send beautiful invites instantly via email or shareable links.",
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: "Real-time Updates",
    description: "Stay informed with instant notifications when plans change.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
        Powerful Features for Seamless Planning
      </h2>
      <p className="text-xl text-gray-600 mb-16">
        Everything you need to organize and coordinate events with ease.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-linear-to-br flex flex-col items-center justify-center from-blue-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-6 shadow-lg">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
