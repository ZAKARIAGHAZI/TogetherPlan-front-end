import { Eye, MapPin, Edit2, Trash2, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventRow = ({ event, onEdit, onDelete, onInvite }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/events/${event.id}`);
    };

    const isPrivate = event.privacy === "private";

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <div>
                    <div className="font-semibold text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.category}</div>
                </div>
            </td>

            <td className="px-6 py-4 text-center hidden sm:table-cell">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isPrivate
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                    }`}>
                    {event.privacy || "Public"}
                </span>
            </td>

            <td className="px-6 py-4 text-center hidden md:table-cell">
                <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span className="truncate max-w-[200px]">{event.location}</span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-right">
                {onEdit || onDelete ? (
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => onEdit(event)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>

                        {onInvite && (
                            <button
                                onClick={() => onInvite(event)}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Invite participants"
                            >
                                <Mail className="h-4 w-4" />
                            </button>
                        )}

                        {onDelete && (
                            <button
                                onClick={() => onDelete(event.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={handleViewDetails}
                        className="text-blue-600 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                        title="View Details"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                )}
            </td>
        </tr>
    );
}

export default EventRow;