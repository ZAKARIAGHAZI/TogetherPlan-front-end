import { Calendar, Clock, Eye, MapPin, UserPen } from "lucide-react";




const EventCard = ({ event, statusColors }) => {
    const formattedDate = new Date(event.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
        {/* Header with linear */}
        <div className="h-2 bg-linear-to-r from-blue-500 via-blue-600 to-blue-700"></div>

        <div className="p-5 flex-1 flex flex-col">
            {/* Status and Category */}
            <div className="flex items-start justify-between mb-4">
            <span
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                statusColors[event.status]
                }`}
            >
                {event.status === "upcoming"
                ? "À venir"
                : event.status === "completed"
                ? "Terminé"
                : "Annulé"}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md capitalize">
                {event.category}
            </span>
            </div>

            {/* Title and Description */}
            <div className="mb-4 flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {event.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
                {event.description}
            </p>
            </div>

            {/* Details */}
            <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-700">
                <Calendar className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                <span>{formattedDate}</span>
                <Clock className="h-4 w-4 text-gray-400 ml-4 mr-2 shrink-0" />
                <span>{event.time}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
                <UserPen className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                <span className="truncate">{event.creator.name}</span>
            </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors">
            <Eye className="h-4 w-4" />
            Voir les détails
            </button>
        </div>
        </div>
    );
}

export default EventCard;