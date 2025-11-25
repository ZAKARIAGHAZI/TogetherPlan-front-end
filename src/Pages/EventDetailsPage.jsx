import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  User,
  Clock,
  ArrowLeft,
  ThumbsUp,
  HelpCircle,
  ThumbsDown,
  CheckCircle,
  Users,
} from "lucide-react";
import { fetchEventDetails, submitVote } from "../redux/slices/eventsSlice";
import { fetchParticipants } from "../redux/slices/participantsSlice";
import Loading from "../Components/ui/Loading";

export default function EventDetailsPage() {

  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedEvent, loading, actionLoading, actionError } = useSelector(
    (state) => state.events
  );
  const { participantsByEvent, loading: participantsLoading } = useSelector(
    (state) => state.participants
  );

  const [userVotes, setUserVotes] = useState({});
  const [voteError, setVoteError] = useState(null);

  useEffect(() => {
    if (eventId) {
      // Fetch event details
      dispatch(fetchEventDetails(eventId))
        .unwrap()
        .then((event) => {
          const currentUserId = JSON.parse(localStorage.getItem("user")).id;
          // Build userVotes object
          const votesObj = {};
          event.date_options.forEach((option) => {
            const userVote = option.votes.find(
              (v) => v.user_id === currentUserId
            );
            if (userVote) votesObj[option.id] = userVote.vote;
          });

          setUserVotes(votesObj);
        });

      // Fetch participants
      dispatch(fetchParticipants(eventId));
    }
  }, [eventId, dispatch]);

  // Handle vote submission
  const handleVote = async (dateOptionId, voteType) => {
    // Check if already voted for this date option
    if (userVotes[dateOptionId]) {
      return;
    }

    try {
      setVoteError(null);
      await dispatch(
        submitVote({
          date_option_id: dateOptionId,
          vote: voteType,
        })
      ).unwrap();

      // Store the vote locally
      setUserVotes((prev) => ({
        ...prev,
        [dateOptionId]: voteType,
      }));

      // Refresh event details to get updated vote counts
      dispatch(fetchEventDetails(eventId));
    } catch (error) {
      console.error("Vote error:", error);
      setVoteError(error || "Erreur lors du vote");
    }
  };

  const getVoteIcon = (voteType) => {
    switch (voteType) {
      case "yes":
        return <ThumbsUp className="h-5 w-5" />;
      case "maybe":
        return <HelpCircle className="h-5 w-5" />;
      case "no":
        return <ThumbsDown className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getVoteColor = (voteType, isSelected) => {
    if (!isSelected) return "text-gray-400 hover:text-gray-600";

    switch (voteType) {
      case "yes":
        return "text-green-600 bg-green-50 border-green-300";
      case "maybe":
        return "text-amber-600 bg-amber-50 border-amber-300";
      case "no":
        return "text-red-600 bg-red-50 border-red-300";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Heure à déterminer";
    return timeString.slice(0, 5);
  };

  const getBestDateOption = () => {
    if (!selectedEvent?.best_date_id || !selectedEvent?.date_options)
      return null;
    return selectedEvent.date_options.find(
      (option) => option.id === selectedEvent.best_date_id
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading label="Chargement de l'événement..." />
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Événement introuvable
          </h3>
          <button
            onClick={() => navigate("/events")}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  const bestDate = getBestDateOption();
  const participants = participantsByEvent[eventId] || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/events")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Retour aux événements</span>
        </button>

        {/* Event Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-12 w-1 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {selectedEvent.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>
                      Créé par{" "}
                      <span className="font-medium">
                        {selectedEvent.creator?.name || "Utilisateur"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {selectedEvent.description && (
                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedEvent.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>{selectedEvent.location}</span>
                </div>
                {selectedEvent.category && (
                  <div className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {selectedEvent.category}
                  </div>
                )}
                {selectedEvent.privacy === "private" && (
                  <div className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    Privé
                  </div>
                )}
              </div>
            </div>

            {/* Best Date Badge */}
            {bestDate && (
              <div className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 lg:min-w-[280px]">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-bold text-green-900">Meilleure Date</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      {formatDate(bestDate.proposed_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(bestDate.proposed_time)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {(voteError || actionError) && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-800 font-medium">
              {voteError || actionError}
            </p>
          </div>
        )}

        {/* Date Options Voting Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Dates Proposées - Votez pour votre préférence
            </h2>
          </div>

          {selectedEvent.date_options &&
            selectedEvent.date_options.length > 0 ? (
            <div className="grid gap-4">
              {selectedEvent.date_options.map((dateOption) => {
                const hasVoted = userVotes[dateOption.id];
                const isBestDate = dateOption.id === selectedEvent.best_date_id;
                const yesCount = dateOption.votes?.filter(v => v.vote === "yes").length || 0;
                const maybeCount = dateOption.votes?.filter(v => v.vote === "maybe").length || 0;
                const noCount = dateOption.votes?.filter(v => v.vote === "no").length || 0;
                return (
                  <div
                    key={dateOption.id}
                    className={`border-2 rounded-2xl p-6 transition-all ${isBestDate
                        ? "border-green-300 bg-green-50/50"
                        : "border-gray-200 hover:border-blue-200"
                      }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Date Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {formatDate(dateOption.proposed_date)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatTime(dateOption.proposed_time)}
                            </p>
                          </div>
                          {isBestDate && (
                            <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                              MEILLEUR
                            </span>
                          )}
                        </div>

                        {/* Vote Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                            <span className="font-medium">
                              {yesCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HelpCircle className="h-4 w-4 text-amber-600" />
                            <span className="font-medium">
                              {maybeCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsDown className="h-4 w-4 text-red-600" />
                            <span className="font-medium">
                              {noCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Voting Buttons */}
                      <div className="flex gap-2">
                        {["yes", "maybe", "no"].map((voteType) => (
                          <button
                            key={voteType}
                            onClick={() => handleVote(dateOption.id, voteType)}
                            disabled={hasVoted || actionLoading}
                            className={`p-3 rounded-xl border-2 transition-all ${hasVoted === voteType
                                ? getVoteColor(voteType, true)
                                : "border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-600"
                              } ${hasVoted && hasVoted !== voteType
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                              } ${actionLoading
                                ? "opacity-50 cursor-wait"
                                : "hover:scale-105"
                              }`}
                            title={
                              voteType === "yes"
                                ? "Oui"
                                : voteType === "maybe"
                                  ? "Peut-être"
                                  : "Non"
                            }
                          >
                            {getVoteIcon(voteType)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hasVoted && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">
                          ✓ Vous avez voté "
                          {hasVoted === "yes"
                            ? "Oui"
                            : hasVoted === "maybe"
                              ? "Peut-être"
                              : "Non"}
                          " pour cette date
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                Aucune date proposée pour le moment
              </p>
            </div>
          )}
        </div>

        {/* Participants Section */}
        {participants.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Participants ({participants.length})
              </h2>
            </div>

            {participantsLoading ? (
              <div className="text-center py-8">
                <Loading label="Chargement des participants..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-colors"
                  >
                    <div className="h-10 w-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {participant.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {participant.user?.name || "Utilisateur"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {participant.status === "accepted"
                          ? "✓ Confirmé"
                          : participant.status === "declined"
                            ? "✗ Refusé"
                            : "En attente"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
