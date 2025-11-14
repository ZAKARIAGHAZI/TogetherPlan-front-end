import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../redux/slices/eventsSlice";
import { Calendar, Users, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const totalEvents = events.length;
  const totalParticipants = events.reduce(
    (acc, e) => acc + (e.participants?.length || 0),
    0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-5 rounded-[22px] border border-gray-200 flex items-center gap-4">
          <Calendar className="text-indigo-500" size={36} />
          <div>
            <h3 className="text-gray-600">Total Events</h3>
            <p className="text-2xl font-bold">{totalEvents}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[22px] border border-gray-200 flex items-center gap-4">
          <Users className="text-green-500" size={36} />
          <div>
            <h3 className="text-gray-600">Total Participants</h3>
            <p className="text-2xl font-bold">{totalParticipants}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[22px] border border-gray-200 flex items-center gap-4">
          <BarChart3 className="text-orange-500" size={36} />
          <div>
            <h3 className="text-gray-600">Upcoming</h3>
            <p className="text-2xl font-bold">
              {events.filter((e) => new Date(e.date) > new Date()).length}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-[22px] border border-gray-200 p-5">
        <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="border rounded-lg p-4 hover:shadow-md transition bg-white"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-500 mb-2">{event.location}</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {event.description || "No description provided."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
