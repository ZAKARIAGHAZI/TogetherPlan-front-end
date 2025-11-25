import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Edit,
  Info,
  LogOut,
  UserRound,
  Bell,
} from "lucide-react";
import Logo from "../Logo";
import NotificationList from "./NotificationList";
import { logoutUser } from "../../redux/slices/authSlice";
import { fetchNotifications } from "../../redux/slices/notificationsSlice";

const NavBarDash = ({ sidebarIsVisible }) => {
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md py-3 px-6 flex items-center justify-between gap-4 border-b border-gray-200/80 shadow-sm transition-all duration-300">
      {/* App Logo */}
      <div className="transition-all duration-200" >
        {!sidebarIsVisible && <Logo />}
      </div>

      <div className="flex items-center flex-wrap gap-4">
        {/* Bouton Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDetails(false);
            }}
            className={`relative h-11 w-11 flex items-center justify-center rounded-xl transition-all duration-200 ${showNotifications
              ? "bg-blue-50 text-blue-600 shadow-inner"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-5 min-w-[1.25rem] px-1 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
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
            className={`flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full border transition-all duration-200 ${showProfileDetails
              ? "border-blue-200 bg-blue-50/50 shadow-sm"
              : "border-transparent hover:bg-gray-50 hover:border-gray-200"
              }`}
          >
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center rounded-full shadow-sm">
              <UserRound size={18} />
            </div>
            <div className="text-start hidden sm:block">
              <p className="font-semibold text-sm text-gray-700 capitalize line-clamp-1 leading-tight">
                {user?.name || "Utilisateur"}
              </p>
              <p className="text-xs text-gray-500 capitalize line-clamp-1 leading-tight">
                {user?.role || "Membre"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-300 ${showProfileDetails ? "rotate-180 text-blue-500" : ""
                }`}
            />
          </button>

          {/* details de profile */}
          {showProfileDetails && (
            <ProfileDetails
              onClose={() => setShowProfileDetails(false)}
              onLogout={handleLogout}
              navigate={navigate}
            />
          )}
        </div>
      </div>
    </header>
  );
};

function ProfileDetails({ onClose, onLogout, navigate }) {
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

  const handleEditProfile = () => {
    navigate("/profile");
    onClose();
  };

  return (
    <div
      ref={profileRef}
      className="absolute z-10 top-full right-0 mt-2 w-56 bg-white shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex flex-col gap-1">
        <ProfileDetailsItem
          label="Editer profil"
          icon={<Edit className="h-4 w-4" />}
          onClick={handleEditProfile}
        />
        <div className="h-px bg-gray-100 my-1" />
        <ProfileDetailsItem
          label="logout"
          icon={<LogOut className="h-4 w-4" />}
          className="text-red-600 hover:bg-red-50 hover:border-red-100"
          onClick={onLogout}
        />
      </div>
    </div>
  );
}

function ProfileDetailsItem({
  label = "Inconnu",
  icon = <Info />,
  className = "",
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl py-2.5 px-3 w-full text-sm font-medium transition-colors duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default NavBarDash;
