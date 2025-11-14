import { useForm, useFieldArray } from "react-hook-form";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Users,
  MapPin,
  FileText,
  Lock,
  Globe,
} from "lucide-react";

export default function EventForm({ isOpen, onClose, onSubmit }) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
        title: "",
        description: "",
        location: "",
        category: "",
        privacy: "public",
        group_id: "",
        dates: [{ date: "", time: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "dates",
    });

    const privacy = watch("privacy");

    const handleFormSubmit = (data) => {
        onSubmit(data);
        reset();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-linear-to-r from-purple-500 to-pink-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Créer un événement
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex-1 overflow-y-auto p-6"
          >
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Titre de l'événement *
                </label>
                <input
                  {...register("title", { required: "Le titre est requis" })}
                  type="text"
                  placeholder="Ex: Conférence annuelle 2024"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Description *
                </label>
                <textarea
                  {...register("description", {
                    required: "La description est requise",
                  })}
                  rows={4}
                  placeholder="Décrivez votre événement..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Lieu *
                </label>
                <input
                  {...register("location", { required: "Le lieu est requis" })}
                  type="text"
                  placeholder="Ex: Centre de conférences, Paris"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Catégorie *
                </label>
                <select
                  {...register("category", {
                    required: "La catégorie est requise",
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-white"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="conference">Conférence</option>
                  <option value="workshop">Atelier</option>
                  <option value="seminar">Séminaire</option>
                  <option value="meeting">Réunion</option>
                  <option value="training">Formation</option>
                  <option value="social">Social</option>
                  <option value="other">Autre</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Privacy */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Lock className="h-4 w-4 text-blue-600" />
                  Confidentialité *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      privacy === "public"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      {...register("privacy")}
                      type="radio"
                      value="public"
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Globe className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Public</div>
                      <div className="text-xs text-gray-500">
                        Visible par tous
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      privacy === "private"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      {...register("privacy")}
                      type="radio"
                      value="private"
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Lock className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Privé</div>
                      <div className="text-xs text-gray-500">
                        Sur invitation
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Group (conditional) */}
              {privacy === "private" && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Groupe
                  </label>
                  <select
                    {...register("group_id")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-white"
                  >
                    <option value="">Aucun groupe</option>
                    <option value="1">Équipe Marketing</option>
                    <option value="2">Équipe Développement</option>
                    <option value="3">Direction</option>
                    <option value="4">Ressources Humaines</option>
                  </select>
                </div>
              )}

              {/* Dates and Times */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Dates et heures *
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ date: "", time: "" })}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter une date
                  </button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-600">
                            Date {index + 1}
                          </span>
                        </div>
                        <input
                          {...register(`dates.${index}.date`, {
                            required: "La date est requise",
                          })}
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                        />
                        {errors.dates?.[index]?.date && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.dates[index].date.message}
                          </p>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-600">
                            Heure
                          </span>
                        </div>
                        <input
                          {...register(`dates.${index}.time`, {
                            required: "L'heure est requise",
                          })}
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                        />
                        {errors.dates?.[index]?.time && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.dates[index].time.message}
                          </p>
                        )}
                      </div>

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit(handleFormSubmit)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Créer l'événement
            </button>
          </div>
        </div>
      </div>
    );
    }
