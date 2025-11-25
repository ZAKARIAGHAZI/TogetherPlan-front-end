import Sidebar from "../Components/dashboard/Sidebar";
import Navbar from "../Components/NavBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import NavBarDash from "../Components/dashboard/NavBarDash";
import { useSelector } from "react-redux";

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar with fixed positioning */}
      <div className="relative z-30 shrink-0">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Navbar */}
        <div className="shrink-0 bg-white border-b border-gray-200 shadow-sm z-20">
          {isAuthenticated ? (
            <NavBarDash sidebarIsVisible={showSidebar} />
          ) : (
            <Navbar />
          )}
        </div>

        {/* Main content with scroll */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
