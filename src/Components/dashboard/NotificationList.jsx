import { useRef, useEffect } from "react";
import { X, Megaphone } from "lucide-react";

function NotificationList({ onClose }) {
  const notificationsRef = useRef(null);

  // Données de test pour les notifications
  const notifications = [
    {
      id: 1,
      title: "Nouveau message",
      message: "Vous avez reçu un nouveau message de l'équipe",
      time: "Il y a 5 min",
      unread: true,
    },
    {
      id: 2,
      title: "Rappel de réunion",
      message: "Réunion à 15h00 aujourd'hui",
      time: "Il y a 1 heure",
      unread: true,
    },
    {
      id: 3,
      title: "Tâche terminée",
      message: "La tâche 'Design logo' a été marquée comme terminée",
      time: "Il y a 2 heures",
      unread: false,
    },
    {
      id: 4,
      title: "Nouvel utilisateur",
      message: "Un nouvel utilisateur s'est inscrit",
      time: "Il y a 3 heures",
      unread: false,
    },
  ];

  // Fermer la liste si on clique en dehors
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

  return (
    <div
      ref={notificationsRef}
      className="absolute z-20 top-full right-0 mt-2 w-sm bg-white shadow-sm shadow-black/30 rounded-[22px] border border-gray-200"
    >
      {/* En-tête des notifications */}
      <div className="flex items-center justify-between ps-5 pe-3 py-2 border-b border-gray-200">
        <h3 className="font-semibold text-xl">Notifications</h3>
        <button
          onClick={onClose}
          className="h-11 w-11 flex items-center justify-center hover:bg-gray-100 rounded-full"
        >
          <X className="h-7" />
        </button>
      </div>

      {/* Liste des notifications */}
      <div className="max-h-96 overflow-y-auto mb-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`py-4 px-2 pb-2 border-b cursor-pointer flex items-start gap-2 ${
                notification.unread
                  ? "bg-blue-100 hover:bg-blue-300  border-blue-300"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              <div
                className={`flex items-center justify-center h-11 w-11 rounded-full ${
                  notification.unread ? "bg-blue-400" : "bg-gray-300"
                }`}
              >
                <Megaphone className="h-5" />
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <h4
                    className={`font-semibold text-base ${
                      notification.unread ? "text-blue-900" : "text-black"
                    }`}
                  >
                    {notification.title}
                  </h4>
                  {notification.unread && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{notification.message}</p>
                <span className="text-xs text-gray-500">
                  {notification.time}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            Aucune notification
          </div>
        )}
      </div>

      {/* Lien pour voir plus de détails */}
      <div className="px-3 border-t border-gray-200">
        <button
          onClick={() => {
            // Redirection vers la page des notifications
            console.log("Voir toutes les notifications");
            onClose();
          }}
          className="w-full text-center text-blue-600 hover:text-blue-800 font-medium py-2 text-base"
        >
          Voir toutes les notifications
        </button>
      </div>
    </div>
  );
}

export default NotificationList;
