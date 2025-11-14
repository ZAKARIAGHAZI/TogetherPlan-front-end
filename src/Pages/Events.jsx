  import { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { fetchEvents, createEvent } from "../redux/slices/eventsSlice";
  import { Plus, Calendar, Search, List, Grid3X3,} from "lucide-react";
  import ClientSelect from "../Components/ui/ClientSelect.jsx";
  import Loading from "../Components/ui/Loading";
  import EventCard from "../Components/events/EventCard";
  import EventRow from "../Components/events/EventRow";
  import EventForm from "../Components/events/EventForm";



  export default function EventsPage() {
    const dispatch = useDispatch();
    const { events, loading } = useSelector((state) => state.events);
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const statusColors = {
      upcoming: "bg-amber-50 text-amber-700 border-l-4 border-amber-400",
      completed: "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-400",
      cancelled: "bg-rose-50 text-rose-700 border-l-4 border-rose-400",
    };

    useEffect(() => {
      dispatch(fetchEvents());
    }, [dispatch]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          {/* <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div> */}
          <Loading label="Loading..." />
        </div>
      );
    }

    const uniqueCategories = [...new Set(events.map((event) => event.category).filter(Boolean))];

    const categoryOptions = uniqueCategories.map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    }));

    const statusOptions = [
      { value: "upcoming", label: "À venir" },
      { value: "completed", label: "Terminé" },
      { value: "cancelled", label: "Annulé" },
    ];

    const filteredEvents = events.filter((event) => {
      const categoryMatch =
        !selectedCategory || event.category === selectedCategory.value;
      const statusMatch =
        !selectedStatus || event.status === selectedStatus.value;
      const searchMatch = event.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return categoryMatch && statusMatch && searchMatch;
    });

    const handleEventSubmit = async (data) => {
      try {
        await dispatch(createEvent(data)).unwrap(); // unwrap to catch errors
        setIsEventFormOpen(false); // close the form after creation
      } catch (error) {
        console.error("Failed to create event:", error);
      }
    };

    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Événements
                  </h1>
                </div>
                <p className="text-gray-600 ml-3">
                  Gérez et planifiez tous vos événements
                </p>
              </div>

              <button
                onClick={() => setIsEventFormOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm hover:shadow"
              >
                {console.log("event form open:", isEventFormOpen)}
                <Plus className="h-4 w-4" />
                Créer un événement
              </button>
            </div>
          </div>
          <EventForm
            isOpen={isEventFormOpen}
            onClose={() => setIsEventFormOpen(false)}
            onSubmit={handleEventSubmit}
          />
          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-3xl p-5 mb-8 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Barre de recherche */}
              <div className="flex-1 w-full relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un événement par titre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-full focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-150 shadow-sm outline-none"
                />
              </div>

              {/* Filtres et boutons de vue */}
              <div className="flex flex-wrap justify-end gap-3 w-full lg:w-auto">
                {/* Sélecteur de catégorie avec ClientSelect */}
                <div className="min-w-[120px] sm:min-w-[200px]">
                  <ClientSelect
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Toutes les catégories"
                    isSearchable={false}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "9999px", // full rounded
                        padding: "4px 8px", // vertical padding
                        borderColor: "#f3f4f6", // border-gray-100
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // shadow-sm
                        "&:hover": {
                          borderColor: "#bfdbfe", // blue-200 hover
                        },
                      }),
                    }}
                  />
                </div>

                {/* Sélecteur de statut avec ClientSelect */}
                <div className="min-w-[120px] sm:min-w-40">
                  <ClientSelect
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="Tous les statuts"
                    isSearchable={false}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "9999px", // full rounded
                        padding: "4px 8px", // vertical padding
                        borderColor: "#f3f4f6", // border-gray-100
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // shadow-sm
                        "&:hover": {
                          borderColor: "#bfdbfe", // blue-200 hover
                        },
                      }),
                    }}
                  />
                </div>

                {/* Boutons de vue */}
                <div className="flex border-2 border-gray-200 rounded-full overflow-hidden self-center ml-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    title="Vue Grille"
                    className={`p-3 transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white shadow-inner"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    title="Vue Liste"
                    className={`p-3 transition-colors ${
                      viewMode === "list"
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
                    statusColors={statusColors}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          Événement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden sm:table-cell">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden md:table-cell">
                          Lieu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden lg:table-cell">
                          Participants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEvents.map((event) => (
                        <EventRow
                          key={event.id}
                          event={event}
                          statusColors={statusColors}
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
                  Aucun événement
                </h3>
                <p className="text-gray-500 text-sm">
                  {events.length === 0
                    ? "Créez votre premier événement pour commencer."
                    : "Essayez d'ajuster vos filtres."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }




