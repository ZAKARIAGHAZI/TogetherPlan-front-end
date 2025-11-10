import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Calendar, MapPin, Loader2, AlertCircle } from "lucide-react";
import {
  fetchEvents,
  fetchEventDetails,
  setSearchTerm,
  clearError,
} from "../redux/slices/eventsSlice";
import EventCard from "../Components/EventCard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { filteredEvents, loading, error, searchTerm } = useSelector(
    (state) => state.events
  );
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    dispatch(setSearchTerm(value));
  };

  const handleViewDetails = (eventId) => {
    dispatch(fetchEventDetails(eventId));
  };

  const handleRefresh = () => {
    dispatch(clearError());
    dispatch(fetchEvents());
  };

return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📅 My Events Dashboard
          </h1>
          <p className="text-gray-600">
            Discover and manage your upcoming events
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events, locations..."
              value={localSearch}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start justify-between">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error loading events</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && (
          <>
            {filteredEvents.length > 0 ? (
              <>
                <div className="mb-4 text-gray-600">
                  Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No events found matching your search.' : 'No events available yet.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
