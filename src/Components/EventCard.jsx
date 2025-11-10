import { Calendar, MapPin } from "lucide-react";

const EventCard = ({ event, onViewDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const eventDate =
    event.event_date || event.date || event.start_date || event.created_at;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-1">
          {event.title || "Untitled Event"}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description || "No description available"}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">
              {event.location || "Location TBA"}
            </span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatDate(eventDate)}</span>
          </div>
        </div>
        <button
          onClick={() => onViewDetails(event.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default EventCard;
