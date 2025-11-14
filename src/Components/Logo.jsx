import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <Calendar className="w-8 h-8 text-blue-600" />
      <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent line-clamp-1">
        TogetherPlan
      </span>
    </Link>
  );
};

export default Logo;