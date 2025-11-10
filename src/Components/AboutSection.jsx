import Lottie from "lottie-react";
import EventAnimation from "../assets/Event.json";

const AboutSection = () => (
    <section
        id="about"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-blue-50"
    >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
            <div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                Why Choose TogetherPlan?
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Coordinating schedules can be tough — TogetherPlan makes it simple,
                smart, and fun. Whether you're planning a family reunion, a team
                meeting, or a night out, we help you find the perfect time for
                everyone.
                </p>

                <ul className="space-y-4">
                {[
                    "Easy to use interface for all age groups",
                    "Secure and private — your data is protected",
                    "Free to start, upgrade as you grow",
                ].map((text, i) => (
                    <li key={i} className="flex items-start">
                    <div className="shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1">
                        <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                        </svg>
                    </div>
                    <span className="text-gray-700">{text}</span>
                    </li>
                ))}
                </ul>
            </div>

        <div className="flex justify-center items-center">
            <Lottie
            animationData={EventAnimation}
            loop={true}
            className="w-96 h-96"
            />
        </div>
        </div>
    </section>
);

export default AboutSection;
