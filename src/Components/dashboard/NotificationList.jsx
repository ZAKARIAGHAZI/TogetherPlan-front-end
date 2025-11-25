import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Megaphone, Calendar, Users, AlertCircle, CheckCircle } from "lucide-react";
import { fetchNotifications, markNotificationAsRead } from "../../redux/slices/notificationsSlice";

function NotificationList({ onClose }) {
  const notificationsRef = useRef(null);
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Close list when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleNotificationClick = (notification) => {
    if (!notification.read_at) {
      dispatch(markNotificationAsRead(notification.id));
    }
  };

  const getNotificationIcon = (type) => {
    if (type?.includes("Event")) return <Calendar className="h-5 w-5" />;
    if (type?.includes("User") || type?.includes("Participant")) return <Users className="h-5 w-5" />;
    if (type?.includes("Alert")) return <AlertCircle className="h-5 w-5" />;
    if (type?.includes("Success")) return <CheckCircle className="h-5 w-5" />;
    return <Megaphone className="h-5 w-5" />;
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const getNotificationContent = (notification) => {
    const data = notification.data || {};
    const title = data.title || data.message || "Notification";
    const message = data.body || data.description || data.message || "";
    return { title, message };
  };

  return (
    <div
      ref={notificationsRef}
      className="absolute z-20 top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
        <button
          onClick={onClose}
          className="h-9 w-9 flex items-center justify-center hover:bg-white/50 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">Chargement...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => {
            const { title, message } = getNotificationContent(notification);
            const isUnread = !notification.read_at;

            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 border-b border-gray-50 cursor-pointer flex items-start gap-3 transition-colors ${isUnread
                    ? "bg-blue-50/50 hover:bg-blue-100/50"
                    : "hover:bg-gray-50"
                  }`}
              >
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${isUnread ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4
                      className={`font-semibold text-sm line-clamp-1 ${isUnread ? "text-blue-900" : "text-gray-800"
                        }`}
                    >
                      {title}
                    </h4>
                    {isUnread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1"></span>
                    )}
                  </div>
                  {message && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">
                      {message}
                    </p>
                  )}
                  <span className="text-xs text-gray-500 mt-1 block">
                    {getRelativeTime(notification.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Megaphone className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Aucune notification</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => {
              // Navigate to notifications page if needed
              onClose();
            }}
            className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2 text-sm rounded-lg hover:bg-blue-50 transition-colors"
          >
            Voir toutes les notifications
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationList;
