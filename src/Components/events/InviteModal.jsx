import { useState } from "react";
import {
  X,
  Mail,
  Plus,
  Trash2,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

export default function InviteModal({ isOpen, onClose, event }) {
  const [emails, setEmails] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  if (!isOpen) return null;

  if (!event) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <p className="text-red-500">Error: No event selected</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
        </div>
      </div>
    );
  }

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails.length ? newEmails : [""]);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResults(null);

    const validEmails = emails.filter((email) => email.trim() !== "");

    if (validEmails.length === 0) {
      alert("Please enter at least one email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

      const response = await axios.post(
        `${API_BASE_URL}/events/${event.id}/invite`,
        { emails: validEmails },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(response.data);

      // Reset form after 3 seconds if all successful
      const allSuccessful = Object.values(response.data).every(
        (result) => result === "Invitation envoyée"
      );

      if (allSuccessful) {
        setTimeout(() => {
          setEmails([""]);
          setResults(null);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error inviting participants:", error);
      alert(error.response?.data?.message || "Failed to send invitations");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmails([""]);
    setResults(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="h-6 w-6 text-purple-600" />
              Invite Participants
            </h2>
            <p className="text-sm text-gray-600 mt-1">Event: {event.title}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Email Addresses
              </label>

              <div className="space-y-3">
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          handleEmailChange(index, e.target.value)
                        }
                        placeholder="user@example.com"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all outline-none"
                        required={index === 0}
                      />
                    </div>

                    {emails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddEmail}
                className="mt-3 flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                <Plus className="h-4 w-4" />
                Add another email
              </button>
            </div>

            {/* Results */}
            {results && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Invitation Results:
                </h3>
                {Object.entries(results).map(([email, status]) => (
                  <div
                    key={email}
                    className="flex items-center gap-2 text-sm p-2 bg-white rounded border"
                  >
                    {status === "Invitation envoyée" ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                        <span className="text-gray-700">{email}</span>
                        <span className="ml-auto text-green-600 font-medium">
                          Invitation sent
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                        <span className="text-gray-700">{email}</span>
                        <span className="ml-auto text-amber-600 font-medium">
                          {status}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Invitations
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
