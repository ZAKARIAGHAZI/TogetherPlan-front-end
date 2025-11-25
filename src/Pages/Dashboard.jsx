import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../redux/slices/eventsSlice";
import { fetchGroups } from "../redux/slices/groupsSlice";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  MapPin,
  CalendarDays
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);
  const { groups } = useSelector((state) => state.groups);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchGroups());
  }, [dispatch]);


  console.log(events);
  // --- Data Processing for Charts ---
  const stats = useMemo(() => {
    const totalEvents = events.length;

    // New metrics
    const publicEvents = events.filter(e => e.privacy === 'public').length;
    const privateEvents = events.filter(e => e.privacy === 'private').length;
    const userGroupsCount = groups.length;

    return { totalEvents, publicEvents, privateEvents, userGroupsCount };
  }, [events, groups]);

  const monthlyData = useMemo(() => {
    const months = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]}`;
      months[key] = 0;
    }

    events.forEach(e => {
      const bestDate = e.date_options?.find(d => d.id === e.best_date_id);
      if (bestDate) {
        const date = new Date(bestDate.proposed_date);
        const key = monthNames[date.getMonth()];
        if (months[key] !== undefined) {
          months[key]++;
        }
      }
    });

    return Object.entries(months).map(([name, count]) => ({ name, events: count }));
  }, [events]);

  const categoryData = useMemo(() => {
    const categories = {};
    events.forEach(e => {
      const cat = e.category || "Uncategorized";
      categories[cat] = (categories[cat] || 0) + 1;
    });

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [events]);

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

  return (
    <div className="p-6 min-h-screen bg-gray-50/50 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here's what's happening with your events today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={<CalendarDays className="text-blue-600" size={24} />}
          trend="All time"
          trendUp={true}
          color="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Public Events"
          value={stats.publicEvents}
          icon={<Users className="text-purple-600" size={24} />}
          trend="Open to all"
          trendUp={true}
          color="bg-purple-50 text-purple-700"
        />
        <StatCard
          title="Private Events"
          value={stats.privateEvents}
          icon={<Clock className="text-orange-600" size={24} />}
          trend="Invitation only"
          trendUp={true}
          color="bg-orange-50 text-orange-700"
        />
        <StatCard
          title="My Groups"
          value={stats.userGroupsCount}
          icon={<TrendingUp className="text-emerald-600" size={24} />}
          trend="Active memberships"
          trendUp={true}
          color="bg-emerald-50 text-emerald-700"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Events Overview</h3>
            <select className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1 text-gray-600 focus:ring-0 cursor-pointer hover:bg-gray-100 transition-colors">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEvents)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Categories</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-6">Event Name</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-6">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-6">Location</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">Loading events...</td>
                </tr>
              ) : events.slice(0, 5).map((event) => {
                const bestDate = event.date_options?.find(d => d.id === event.best_date_id);
                const dateStr = bestDate
                  ? new Date(bestDate.proposed_date).toLocaleDateString()
                  : "TBD";

                return (
                  <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.category || "General"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {dateStr}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="truncate max-w-[150px]">{event.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${event.privacy === 'private'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {event.privacy || 'Public'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Stats
function StatCard({ title, value, icon, trend, trendUp, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowUpRight size={12} className="rotate-90" />}
          {trend}
        </span>
        <span className="text-xs text-gray-400">vs last month</span>
      </div>
    </div>
  );
}

export default Dashboard;
