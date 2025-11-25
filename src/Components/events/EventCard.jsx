import { Calendar, Clock, Eye, MapPin, UserPen, Edit2, Trash2, Mail, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event, onEdit, onDelete, onInvite }) => {
    const navigate = useNavigate();

    const bestdate = event.date_options?.find(e => e.id === event.best_date_id) || null;

    const formattedDate = () => {
        if (bestdate === null) return "Date à définir";
        return new Date(bestdate.proposed_date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const handleViewDetails = () => {
        navigate(`/events/${event.id}`);
    };

    const isPrivate = event.privacy === "private";

    return (
        <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
            {/* Header with linear */}
            <div className={`h-2 ${isPrivate ? "bg-purple-500" : "bg-linear-to-r from-blue-500 via-blue-600 to-blue-700"}`}></div>

            <div className="p-5 flex-1 flex flex-col">
                {/* Status and Category */}
                <div className="flex items-start justify-between mb-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${isPrivate
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                        }`}>
                        {event.privacy || "Public"}
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
                        {event.description || "No description"}
                    </p>
                </div>

                {/* Details */}
                <div className="space-y-2.5 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                        <span>{formattedDate()}</span>
                        {bestdate && (
                            <>
                                <Clock className="h-4 w-4 text-gray-400 ml-4 mr-2 shrink-0" />
                                <span>{bestdate.proposed_time}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                        <span className="truncate">{event.location}</span>
                    </div>
                    {event.creator && (
                        <div className="flex items-center text-sm text-gray-700">
                            <UserPen className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                            <span className="truncate">{event.creator.name}</span>
                        </div>
                    )}
                    {event.participants && (
                        <div className="flex items-center text-sm text-gray-700">
                            <Users className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                            <span>{event.participants.length} participants</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
                {onEdit || onDelete ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(event)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit
                        </button>

                        {onInvite && (
                            <button
                                onClick={() => onInvite(event)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                            >
                                <Mail className="h-4 w-4" />
                                Invite
                            </button>
                        )}

                        {onDelete && (
                            <button
                                onClick={() => onDelete(event.id)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={handleViewDetails}
                        className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                        Voir les détails
                    </button>
                )}
            </div>
        </div>
    );
}

export default EventCard;