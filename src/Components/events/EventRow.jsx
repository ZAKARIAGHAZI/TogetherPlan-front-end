import { Eye, MapPin } from "lucide-react";


const EventRow = ({ event, statusColors }) => {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
            <div className="font-medium text-gray-900">{event.title}</div>
            <div className="text-sm text-gray-500 line-clamp-1 mt-0.5">
            {event.description}
            </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
            <div className="text-sm text-gray-900">
            {new Date(event.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
            })}
            </div>
            <div className="text-xs text-gray-500">{event.time}</div>
        </td>

        <td className="px-6 py-4 text-sm text-gray-700 hidden md:table-cell">
            <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            <span className="truncate max-w-[200px]">{event.location}</span>
            </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
            {event.participants} participants
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
            <span
            className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                statusColors[event.status]
            }`}
            >
            {event.status === "upcoming"
                ? "À venir"
                : event.status === "completed"
                ? "Terminé"
                : "Annulé"}
            </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right">
            <button className="text-blue-600 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors">
            <Eye className="h-4 w-4" />
            </button>
        </td>
        </tr>
    );
}


export default EventRow;