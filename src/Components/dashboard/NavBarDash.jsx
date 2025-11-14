import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Edit,
  Info,
  LogOut,
  Menu,
  UserRound,
  Bell,
  X,
} from "lucide-react";
import Logo from "../Logo";
import NotificationList from "./NotificationList";

const NavBarDash = ({ sidebarIsVisible }) => {
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white py-2 px-4 flex items-center justify-between gap-2 border-b border-b-gray-300">
      {/* App Logo */}
      <div className="transition-all duration-200" >
        {!sidebarIsVisible && <Logo />}
      </div>

      <div className="flex items-center flex-wrap gap-3">
        {/* Bouton Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDetails(false);
            }}
            className="relative h-11 w-11 flex items-center justify-center border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-full"
          >
            <Bell className="h-7" />
            <span className="absolute top-1 right-1 z-10 bg-red-500 text-white translate-x-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full">
              98
            </span>
          </button>

          {/* Liste des notifications */}
          {showNotifications && (
            <NotificationList onClose={() => setShowNotifications(false)} />
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDetails(!showProfileDetails);
              setShowNotifications(false);
            }}
            type="button"
            className="flex items-center flex-wrap gap-2 cursor-pointer px-1 ps-0.5 py-0.5 rounded-full border border-gray-300 bg-gray-100 hover:bg-gray-200"
          >
            <div className="w-11 h-11 bg-gray-400 text-gray-200 flex items-center justify-center rounded-full overflow-hidden">
              <UserRound />
            </div>
            <div className="text-start">
              <p className="font-semibold capitalize line-clamp-1 leading-4">
                Zakaria Ghazi
              </p>
              <p className="font-semibold text-xs text-gray-400 capitalize line-clamp-1 leading-4">
                Admin
              </p>
            </div>

            <ChevronDown
              style={{
                rotate: `${showProfileDetails ? 180 : 0}deg`,
              }}
              className="relative -start-1.5 transition-all"
            />
          </button>
          {/* details de profile */}
          {showProfileDetails && (
            <ProfileDetails onClose={() => setShowProfileDetails(false)} />
          )}
        </div>
      </div>
    </header>
  );
};

function ProfileDetails({ onClose }) {
  const profileRef = useRef(null);

  // Fermer la liste si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={profileRef}
      className="absolute z-10 -bottom-1.5 left-0 right-0 translate-y-full bg-gray-50 shadow rounded-[22px] p-1 py-2 min-w-48"
    >
      <div className="w-full flex flex-col gap-1">
        <ProfileDetailsItem label="Modifier" icon={<Edit className="h-5" />} />
        <hr className="text-gray-300" />
        <ProfileDetailsItem
          label="Deconnection"
          icon={<LogOut className="h-5" />}
          className="bg-red-200 text-red-800"
        />
      </div>
    </div>
  );
}

function ProfileDetailsItem({
  label = "Inconnu",
  icon = <Info />,
  className = "",
}) {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 border border-gray-200 hover:bg-gray-200 rounded-[22px] py-2 px-3 w-full ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default NavBarDash;
