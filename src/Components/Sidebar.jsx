import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  MessageCircle,
  BarChart2,
  CalendarDays,
  Users,
  Settings,
  ChevronRight,
} from "lucide-react";
import Logo from "./Logo";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Events",
      icon: <CalendarDays size={20} />,
      path: "/events",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Calendar",
      icon: <Calendar size={20} />,
      path: "/calendar",
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Chat",
      icon: <MessageCircle size={20} />,
      path: "/chat",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Statistics",
      icon: <BarChart2 size={20} />,
      path: "/stats",
      color: "from-indigo-500 to-blue-500",
    },
    {
      name: "Groups",
      icon: <Users size={20} />,
      path: "/groups",
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
      color: "from-gray-500 to-slate-600",
    },
  ];

  return (
    <div className="relative">
      <aside
        style={{
          width: showSidebar ? "280px" : "0px",
        }}
        className="h-screen bg-linear-to-b from-slate-50 to-white border-r border-gray-200/80 flex flex-col transition-all duration-500 ease-out overflow-hidden shadow-sm"
      >
        {/* Logo Section */}
        <div className="py-6 px-5 border-b border-gray-100">
          <div
            className="transition-all duration-300"
            style={{
              opacity: showSidebar ? 1 : 0,
              transform: showSidebar ? "translateX(0)" : "translateX(-20px)",
            }}
          >
            <Logo />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3">
          <ul className="space-y-1.5">
            {navItems.map((item, index) => (
              <li
                key={item.name}
                style={{
                  transitionDelay: showSidebar ? `${index * 40}ms` : "0ms",
                  opacity: showSidebar ? 1 : 0,
                  transform: showSidebar
                    ? "translateX(0)"
                    : "translateX(-30px)",
                }}
                className="transition-all duration-300"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-white text-gray-900 shadow-md"
                        : "text-gray-600 hover:bg-white/70 hover:text-gray-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Gradient background on active */}
                      {isActive && (
                        <div
                          className={`absolute inset-0 rounded-xl bg-linear-to-r ${item.color} opacity-10`}
                        />
                      )}

                      {/* Icon with gradient on hover/active */}
                      <div
                        className={`relative z-10 transition-transform duration-200 ${
                          hoveredItem === item.name || isActive
                            ? "scale-110"
                            : ""
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg ${
                            isActive
                              ? `bg-linear-to-br ${item.color} text-white shadow-sm`
                              : "text-gray-500 group-hover:text-gray-700"
                          }`}
                        >
                          {item.icon}
                        </div>
                      </div>

                      {/* Text */}
                      <span
                        className={`relative z-10 font-medium transition-all duration-200 ${
                          isActive ? "translate-x-1" : ""
                        }`}
                      >
                        {item.name}
                      </span>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute right-3 w-1.5 h-1.5 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full animate-pulse" />
                      )}

                      {/* Hover indicator */}
                      {hoveredItem === item.name && !isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-linear-to-b transition-all duration-200"
                          style={{
                            backgroundImage: `linear-gradient(to bottom, var(--tw-gradient-stops))`,
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom section with subtle decoration */}
        <div className="p-4 border-t border-gray-100">
          <div
            className="transition-all duration-300 delay-200"
            style={{
              opacity: showSidebar ? 1 : 0,
              transform: showSidebar ? "translateY(0)" : "translateY(10px)",
            }}
          >
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-100/50">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs text-gray-600 font-medium">
                All systems operational
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        type="button"
        className="absolute top-6 -right-4 z-20 group"
      >
        <div
          className={`h-10 w-10 bg-white border-2 transition-all duration-300 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl ${
            showSidebar
              ? "border-blue-200 hover:border-blue-300"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <ChevronRight
            style={{
              transform: `rotate(${showSidebar ? 180 : 0}deg)`,
            }}
            className={`h-5 w-5 transition-all duration-300 ${
              showSidebar ? "text-blue-600" : "text-gray-600"
            } group-hover:scale-110`}
          />
        </div>

        {/* Ripple effect on hover */}
        <div
          className={`absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping`}
        />
      </button>
    </div>
  );
};

export default Sidebar;
