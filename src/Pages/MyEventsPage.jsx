import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchEvents,
    deleteEvent,
    updateEvent,
    createEvent,
} from "../redux/slices/eventsSlice";
import {
    Plus,
    Search,
    List,
    Grid3X3,
    Calendar,
} from "lucide-react";
import ClientSelect from "../Components/ui/ClientSelect.jsx";
import Loading from "../Components/ui/Loading";
import EventForm from "../Components/events/EventForm";
import UpdateEventForm from "../Components/events/UpdateEventForm";
import InviteModal from "../Components/events/InviteModal";
import EventCard from "../Components/events/EventCard";
import EventRow from "../Components/events/EventRow";

export default function MyEventsPage() {
    const dispatch = useDispatch();
    const { events, loading, actionLoading } = useSelector((state) => state.events);
    const { user } = useSelector((state) => state.auth);

    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading label="Loading your events..." />
            </div>
        );
    }

    // Filter only events created by current user
    const myEvents = events.filter((event) => event.created_by === user?.id);

    const uniqueCategories = [
        ...new Set(myEvents.map((event) => event.category).filter(Boolean)),
    ];
    const categoryOptions = uniqueCategories.map((cat) => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
    }));

    const filteredEvents = myEvents.filter((event) => {
        const categoryMatch =
            !selectedCategory || event.category === selectedCategory.value;
        const searchMatch = event.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
    });

    const handleCreateSubmit = async (data) => {
        try {
            await dispatch(createEvent(data)).unwrap();
            setIsEventFormOpen(false);
            setFormError(null);
        } catch (error) {
            setFormError(error);
        }
    };

    const handleUpdateSubmit = async (data) => {
        try {
            if (selectedEvent) {
                await dispatch(
                    updateEvent({ eventId: selectedEvent.id, eventData: data })
                ).unwrap();
                setIsUpdateFormOpen(false);
                setSelectedEvent(null);
                setFormError(null);
            }
        } catch (error) {
            setFormError(error);
        }
    };

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setIsUpdateFormOpen(true);
    };

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await dispatch(deleteEvent(eventId)).unwrap();
            } catch (error) {
                alert("Failed to delete event: " + error);
            }
        }
    };

    const handleInvite = (event) => {
        setSelectedEvent(event);
        setIsInviteModalOpen(true);
    };



    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    My Events
                                </h1>
                            </div>
                            <p className="text-gray-600 ml-3">Manage your created events</p>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedEvent(null);
                                setIsEventFormOpen(true);
                            }}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm hover:shadow"
                        >
                            <Plus className="h-4 w-4" />
                            Create Event
                        </button>
                    </div>
                </div>

                {/* Modals */}
                <EventForm
                    isOpen={isEventFormOpen}
                    onClose={() => {
                        setIsEventFormOpen(false);
                        setSelectedEvent(null);
                    }}
                    onSubmit={handleCreateSubmit}
                    errorMessage={formError}
                    isLoading={actionLoading}
                />

                <UpdateEventForm
                    isOpen={isUpdateFormOpen}
                    onClose={() => {
                        setIsUpdateFormOpen(false);
                        setSelectedEvent(null);
                    }}
                    onSubmit={handleUpdateSubmit}
                    errorMessage={formError}
                    initialData={selectedEvent}
                    isLoading={actionLoading}
                />

                <InviteModal
                    isOpen={isInviteModalOpen}
                    onClose={() => {
                        setIsInviteModalOpen(false);
                        setSelectedEvent(null);
                    }}
                    event={selectedEvent}
                />

                {/* Search and Filters */}
                <div className="bg-white rounded-3xl p-5 mb-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search your events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-150 outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap justify-end gap-3 w-full lg:w-auto">
                            <div className="min-w-[120px] sm:min-w-[200px]">
                                <ClientSelect
                                    options={categoryOptions}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    placeholder="All categories"
                                    isSearchable={false}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: "9999px",
                                            padding: "4px 8px",
                                            borderColor: "#f3f4f6",
                                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                            "&:hover": {
                                                borderColor: "#bfdbfe",
                                            },
                                        }),
                                    }}
                                />
                            </div>

                            <div className="flex border-2 border-gray-200 rounded-full overflow-hidden self-center ml-2">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    title="Grid View"
                                    className={`p-3 transition-colors ${viewMode === "grid"
                                        ? "bg-blue-600 text-white shadow-inner"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Grid3X3 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    title="List View"
                                    className={`p-3 transition-colors ${viewMode === "list"
                                        ? "bg-blue-600 text-white shadow-inner"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <List className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events Display */}
                {filteredEvents.length > 0 ? (
                    viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onInvite={handleInvite}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                                                Event
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase hidden sm:table-cell">
                                                Privacy
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase hidden md:table-cell">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredEvents.map((event) => (
                                            <EventRow
                                                key={event.id}
                                                event={event}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                                onInvite={handleInvite}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="max-w-sm mx-auto">
                            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No events found
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {myEvents.length === 0
                                    ? "Create your first event to get started."
                                    : "Try adjusting your filters."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
