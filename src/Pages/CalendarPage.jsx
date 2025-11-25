import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../redux/slices/eventsSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Clock,
} from "lucide-react";
import Loading from "../Components/ui/Loading";
import ClientSelect from "../Components/ui/ClientSelect";

export default function CalendarPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const { events, loading } = useSelector((state) => state.events);

  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [currentTitle, setCurrentTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setCurrentTitle(calendarApi.view.title);
    }
  }, []);

  // Convert events to FullCalendar format
  const calendarEvents = events
    .filter((event) => {
      const categoryMatch =
        !selectedCategory || event.category === selectedCategory.value;
      return categoryMatch;
    })
    .flatMap((event) => {
      // If event has date_options, create an event for each date
      if (event.date_options && event.date_options.length > 0) {
        return event.date_options.map((date, index) => ({
          id: `${event.id}-${index}`,
          title: event.title,
          start: date.proposed_date,
          backgroundColor: getEventColor(event.status, event.category),
          borderColor: getEventColor(event.status, event.category),
          extendedProps: {
            eventId: event.id,
            location: event.location,
            description: event.description,
            category: event.category,
            participants_count: event.participants?.length || 0,
            is_best_date: event.best_date_id === date.id,
          },
        }));
      }
      // Otherwise create a single event
      return [
        {
          id: event.id,
          title: event.title,
          start: event.start_date || event.date,
          backgroundColor: getEventColor(event.status, event.category),
          borderColor: getEventColor(event.status, event.category),
          extendedProps: {
            eventId: event.id,
            location: event.location,
            description: event.description,
            category: event.category,
            participants_count: event.participants?.length || 0,
          },
        },
      ];
    });
  // Get event color based on status and category
  function getEventColor(status, category) {
    if (status === "completed") return "#10b981"; // green
    if (status === "cancelled") return "#ef4444"; // red

    // Color by category for upcoming events
    const categoryColors = {
      meeting: "#3b82f6", // blue
      conference: "#8b5cf6", // purple
      workshop: "#f59e0b", // amber
      social: "#ec4899", // pink
      training: "#06b6d4", // cyan
    };

    return categoryColors[category] || "#6366f1"; // default indigo
  }

  // Handle event click
  const handleEventClick = (info) => {
    const eventId = info.event.extendedProps.eventId;
    navigate(`/events/${eventId}`);
  };

  // Handle date click
  const handleDateClick = (info) => {
    console.log("Date clicked:", info.dateStr);
    // You can open event creation form here
  };

  // Calendar navigation
  const handlePrevious = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setCurrentTitle(calendarApi.view.title);
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setCurrentTitle(calendarApi.view.title);
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    setCurrentTitle(calendarApi.view.title);
  };

  const handleViewChange = (view) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(view);
    setCurrentView(view);
    setCurrentTitle(calendarApi.view.title);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading label="Loading calendar..." />
      </div>
    );
  }

  // Get unique categories and statuses
  const uniqueCategories = [
    ...new Set(events.map((event) => event.category).filter(Boolean)),
  ];
  const categoryOptions = uniqueCategories.map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
  }));
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Calendar
            </h1>
          </div>
          <p className="text-gray-600 ml-3">
            Visualize all your events in the calendar
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-3xl p-5 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToday}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Today
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Previous"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                  {currentTitle}
                </h2>
                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Next"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Filters & View Toggle */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Category Filter */}
              <div className="min-w-[180px]">
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

              {/* View Toggle */}
              <div className="flex border-2 border-gray-200 rounded-full overflow-hidden">
                <button
                  onClick={() => handleViewChange("dayGridMonth")}
                  title="Month View"
                  className={`px-3 py-2 transition-colors ${currentView === "dayGridMonth"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleViewChange("timeGridWeek")}
                  title="Week View"
                  className={`px-3 py-2 transition-colors ${currentView === "timeGridWeek"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Clock className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleViewChange("listMonth")}
                  title="List View"
                  className={`px-3 py-2 transition-colors ${currentView === "listMonth"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            initialView="dayGridMonth"
            headerToolbar={false}
            events={calendarEvents}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={3}
            weekends={true}
            height="auto"
            locale="en"
            buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
              list: "List",
            }}
            eventContent={(eventInfo) => (
              <div className="px-1 py-0.5 truncate text-xs">
                <div className="font-medium truncate">
                  {eventInfo.event.title}
                </div>
                {eventInfo.event.extendedProps.location && (
                  <div className="text-xs opacity-80 truncate">
                    📍 {eventInfo.event.extendedProps.location}
                  </div>
                )}
                {eventInfo.event.extendedProps.is_best_date && (
                  <div className="text-xs">⭐</div>
                )}
              </div>
            )}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm text-gray-600">Meeting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span className="text-sm text-gray-600">Conference</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500"></div>
              <span className="text-sm text-gray-600">Workshop</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm text-gray-600">Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span className="text-sm text-gray-600">Best date</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
