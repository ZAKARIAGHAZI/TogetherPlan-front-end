import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(null);

  // Données d'exemple pour les événements
  const events = [
    {
      id: 1,
      title: "Réunion d'équipe",
      date: new Date(2024, 0, 15, 10, 0),
      duration: 60,
      category: "work",
      color: "blue",
    },
    {
      id: 2,
      title: "Anniversaire Marie",
      date: new Date(2024, 0, 18, 15, 0),
      duration: 120,
      category: "personal",
      color: "green",
    },
    {
      id: 3,
      title: "Présentation client",
      date: new Date(2024, 0, 10, 14, 0),
      duration: 90,
      category: "work",
      color: "blue",
    },
    {
      id: 4,
      title: "Déjeuner d'affaires",
      date: new Date(2024, 0, 20, 12, 30),
      duration: 90,
      category: "work",
      color: "blue",
    },
    {
      id: 5,
      title: "Révision projet",
      date: new Date(2024, 0, 22, 9, 0),
      duration: 120,
      category: "work",
      color: "purple",
    },
  ];

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Fonction utilitaire pour obtenir le début de la semaine (lundi)
  const getWeekStart = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  return (
    <div className="bg-gray-50 p-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center gap-4 mb-4 lg:mb-0">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Calendrier</h1>
          </div>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-[22px] hover:bg-gray-50"
          >
            Aujourd'hui
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2 bg-white rounded-[22px] border border-gray-300 p-1">
            <button
              onClick={() => navigateDate("prev")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="px-3 py-1 font-semibold text-gray-900 min-w-48 text-center">
              {view === "month" &&
                currentDate.toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              {view === "week" &&
                `Semaine du ${getWeekStart(currentDate).toLocaleDateString(
                  "fr-FR"
                )}`}
              {view === "day" &&
                currentDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
            </span>

            <button
              onClick={() => navigateDate("next")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Sélection de vue */}
          <div className="flex bg-white rounded-[22px] border border-gray-300 overflow-hidden">
            <button
              onClick={() => setView("month")}
              className={`px-4 py-2 text-sm font-medium ${
                view === "month"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-4 py-2 text-sm font-medium ${
                view === "week"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setView("day")}
              className={`px-4 py-2 text-sm font-medium ${
                view === "day"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Jour
            </button>
          </div>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-[22px] transition-colors">
            <Plus className="h-5 w-5" />
            Nouvel événement
          </button>
        </div>
      </div>

      {/* Vue du calendrier */}
      <div className="bg-white rounded-[22px] shadow-sm border border-gray-200 overflow-hidden">
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        )}
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            events={events}
            onDateSelect={setSelectedDate}
            getWeekStart={getWeekStart}
          />
        )}
        {view === "day" && (
          <DayView currentDate={currentDate} events={events} />
        )}
      </div>

      {/* Événements du jour sélectionné */}
      {selectedDate && (
        <div className="mt-6 bg-white rounded-[22px] shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Événements du{" "}
            {selectedDate.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>
          <div className="space-y-3">
            {events
              .filter(
                (event) =>
                  event.date.toDateString() === selectedDate.toDateString()
              )
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-[22px]"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      event.color === "blue"
                        ? "bg-blue-500"
                        : event.color === "green"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {event.date.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      ({event.duration} min)
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {event.category === "work" ? "Travail" : "Personnel"}
                  </span>
                </div>
              ))}

            {events.filter(
              (event) =>
                event.date.toDateString() === selectedDate.toDateString()
            ).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Aucun événement pour cette date
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Vue Mois
function MonthView({ currentDate, events, onDateSelect, selectedDate }) {
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = [];

  // Jours du mois précédent
  const prevMonthDays = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();
  for (let i = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; i > 0; i--) {
    days.push({
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        prevMonthDays - i + 1
      ),
      isCurrentMonth: false,
    });
  }

  // Jours du mois courant
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      isCurrentMonth: true,
    });
  }

  // Jours du mois suivant
  const totalCells = 42; // 6 semaines
  const nextMonthDays = totalCells - days.length;
  for (let i = 1; i <= nextMonthDays; i++) {
    days.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
      isCurrentMonth: false,
    });
  }

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="p-6">
      {/* En-tête des jours de la semaine */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day, index) => {
          const dayEvents = events.filter(
            (event) => event.date.toDateString() === day.date.toDateString()
          );

          const isToday = day.date.toDateString() === new Date().toDateString();
          const isSelected =
            selectedDate &&
            day.date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={index}
              onClick={() => onDateSelect(day.date)}
              className={`
                min-h-32 bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors
                ${!day.isCurrentMonth ? "text-gray-400 bg-gray-50" : ""}
                ${isToday ? "bg-blue-50 border border-blue-200" : ""}
                ${isSelected ? "bg-blue-100 border border-blue-300" : ""}
              `}
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`
                  text-sm font-medium
                  ${
                    isToday
                      ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                      : ""
                  }
                `}
                >
                  {day.date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded ${
                      event.color === "blue"
                        ? "bg-blue-100 text-blue-800"
                        : event.color === "green"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    } truncate`}
                  >
                    {event.date.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayEvents.length - 3} plus
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Vue Semaine
function WeekView({ currentDate, events, getWeekStart }) {
  const weekStart = getWeekStart(currentDate);
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    weekDays.push(date);
  }

  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8h à 21h

  return (
    <div className="p-6">
      <div className="grid grid-cols-8 gap-px bg-gray-200">
        {/* Cellule vide en haut à gauche */}
        <div className="bg-gray-50"></div>

        {/* En-tête des jours */}
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="bg-gray-50 p-3 text-center">
            <div className="text-sm font-semibold text-gray-700">
              {day.toLocaleDateString("fr-FR", { weekday: "short" })}
            </div>
            <div
              className={`
              text-lg font-bold
              ${
                day.toDateString() === new Date().toDateString()
                  ? "text-blue-600"
                  : "text-gray-900"
              }
            `}
            >
              {day.getDate()}
            </div>
          </div>
        ))}

        {/* Grille des heures */}
        {hours.map((hour) => (
          <>
            <div
              key={`time-${hour}`}
              className="bg-gray-50 p-2 text-right text-sm text-gray-500 border-t border-gray-200"
            >
              {hour}:00
            </div>
            {weekDays.map((day) => {
              const hourEvents = events.filter((event) => {
                const eventDate = event.date;
                return (
                  eventDate.toDateString() === day.toDateString() &&
                  eventDate.getHours() === hour
                );
              });

              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="bg-white min-h-16 border-t border-gray-200 p-1 relative"
                >
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`absolute left-1 right-1 p-1 text-xs rounded ${
                        event.color === "blue"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : event.color === "green"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}
                      style={{
                        top: `${(event.date.getMinutes() / 60) * 100}%`,
                        height: `${(event.duration / 60) * 100}%`,
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div>
                        {event.date.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

// Vue Jour
function DayView({ currentDate, events }) {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8h à 21h

  const dayEvents = events.filter(
    (event) => event.date.toDateString() === currentDate.toDateString()
  );

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {currentDate.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-3 bg-gray-50 rounded-[22px] p-4">
          <div className="space-y-1">
            {hours.map((hour) => {
              const hourEvents = dayEvents.filter(
                (event) => event.date.getHours() === hour
              );

              return (
                <div key={hour} className="flex">
                  <div className="w-16 text-right pr-4 py-2 text-sm text-gray-500">
                    {hour}:00
                  </div>
                  <div className="flex-1 border-t border-gray-200 relative min-h-16">
                    {hourEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`absolute left-2 right-2 p-3 rounded-[22px] ${
                          event.color === "blue"
                            ? "bg-blue-100 border border-blue-200"
                            : event.color === "green"
                            ? "bg-green-100 border border-green-200"
                            : "bg-purple-100 border border-purple-200"
                        }`}
                        style={{
                          top: `${(event.date.getMinutes() / 60) * 100}%`,
                          height: `${(event.duration / 60) * 100}%`,
                        }}
                      >
                        <div className="font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {event.date.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -
                          {new Date(
                            event.date.getTime() + event.duration * 60000
                          ).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Événements du jour */}
        <div className="bg-white rounded-[22px] border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            Événements aujourd'hui
          </h3>
          <div className="space-y-3">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 border border-gray-200 rounded-[22px]"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      event.color === "blue"
                        ? "bg-blue-500"
                        : event.color === "green"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    } mt-1`}
                  ></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {event.date.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      ({event.duration} min)
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {dayEvents.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Aucun événement aujourd'hui
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
