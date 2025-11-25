import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Users,
    Plus,
    Edit2,
    Trash2,
    Mail,
    X,
    UserPlus,
    Calendar,
    Search,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import {
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    inviteToGroup,
    clearError,
} from "../redux/slices/groupsSlice";
import Loading from "../Components/ui/Loading";

const GroupsPage = () => {
    const dispatch = useDispatch();
    const { groups, loading, actionLoading, error, actionError } = useSelector(
        (state) => state.groups
    );
    const { user } = useSelector((state) => state.auth);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [inviteEmails, setInviteEmails] = useState("");

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            setErrorMessage(error);
            dispatch(clearError());
            setTimeout(() => setErrorMessage(""), 5000);
        }
        if (actionError) {
            setErrorMessage(actionError);
            dispatch(clearError());
            setTimeout(() => setErrorMessage(""), 5000);
        }
    }, [error, actionError, dispatch]);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createGroup(formData)).unwrap();
            setSuccessMessage("Group created successfully!");
            setTimeout(() => setSuccessMessage(""), 5000);
            setShowCreateModal(false);
            setFormData({ name: "", description: "" });
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditGroup = async (e) => {
        e.preventDefault();
        try {
            await dispatch(
                updateGroup({ groupId: selectedGroup.id, groupData: formData })
            ).unwrap();
            setSuccessMessage("Group updated successfully!");
            setTimeout(() => setSuccessMessage(""), 5000);
            setShowEditModal(false);
            setSelectedGroup(null);
            setFormData({ name: "", description: "" });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            await dispatch(deleteGroup(selectedGroup.id)).unwrap();
            setSuccessMessage("Group deleted successfully!");
            setTimeout(() => setSuccessMessage(""), 5000);
            setShowDeleteModal(false);
            setSelectedGroup(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInviteUsers = async (e) => {
        e.preventDefault();
        const emails = inviteEmails
            .split(",")
            .map((email) => email.trim())
            .filter((email) => email);

        if (emails.length === 0) {
            setErrorMessage("Please enter at least one email");
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }

        try {
            await dispatch(
                inviteToGroup({ groupId: selectedGroup.id, emails })
            ).unwrap();
            setSuccessMessage("Invitations sent successfully!");
            setTimeout(() => setSuccessMessage(""), 5000);
            dispatch(fetchGroups());
            setShowInviteModal(false);
            setSelectedGroup(null);
            setInviteEmails("");
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (group) => {
        setSelectedGroup(group);
        setFormData({ name: group.name, description: group.description || "" });
        setShowEditModal(true);
    };

    const openDeleteModal = (group) => {
        setSelectedGroup(group);
        setShowDeleteModal(true);
    };

    const openInviteModal = (group) => {
        setSelectedGroup(group);
        setShowInviteModal(true);
    };

    const filteredGroups = groups.filter(
        (group) =>
            group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check if user is creator of a group
    const isCreator = (group) => group.created_by === user?.id;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
                <Loading label="Loading groups..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3">
                        <CheckCircle className="text-green-600 shrink-0" size={20} />
                        <p className="text-green-800 font-medium">{successMessage}</p>
                    </div>
                )}
                {errorMessage && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0" size={20} />
                        <p className="text-red-800 font-medium">{errorMessage}</p>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Users className="text-blue-600" size={36} />
                            My Groups
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Manage your groups and collaborate with your team
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
                    >
                        <Plus size={20} />
                        Create Group
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search for a group..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Groups Grid */}
                {filteredGroups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGroups.map((group) => {
                            const isGroupCreator = isCreator(group);

                            return (
                                <div
                                    key={group.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                                >
                                    <div className="p-6 flex flex-col h-full">
                                        {/* Group Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                    {group.name}
                                                </h3>
                                                {group.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {group.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ml-3">
                                                <Users size={24} />
                                            </div>
                                        </div>

                                        {/* Group Stats */}
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-1">
                                                <UserPlus size={16} />
                                                <span>{group.users?.length || 0} members</span>
                                            </div>
                                            {group.created_at && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={16} />
                                                    <span>
                                                        {new Date(group.created_at).toLocaleDateString("fr-FR")}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Creator Badge */}
                                        {isGroupCreator && (
                                            <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                                Creator
                                            </div>
                                        )}

                                        {/* Actions - Only show for creators */}
                                        <div className="flex flex-col items-end justify-end h-full gap-2 pt-4">
                                            <div className="w-full h-px bg-gray-200 rounded-full mb-0.5"></div>
                                            <div className="flex items-center gap-2 w-full">
                                                <button
                                                    disabled={!isGroupCreator}
                                                    style={{
                                                        opacity: isGroupCreator ? 1 : 0.5,
                                                        cursor: isGroupCreator ? "pointer" : "not-allowed",
                                                    }}
                                                    onClick={() => openInviteModal(group)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                                                >
                                                    <Mail size={16} />
                                                    Invite
                                                </button>
                                                <button
                                                    disabled={!isGroupCreator}
                                                    style={{
                                                        opacity: isGroupCreator ? 1 : 0.5,
                                                        cursor: isGroupCreator ? "pointer" : "not-allowed",
                                                    }}
                                                    onClick={() => openEditModal(group)}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm"

                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    disabled={!isGroupCreator}
                                                    style={{
                                                        opacity: isGroupCreator ? 1 : 0.5,
                                                        cursor: isGroupCreator ? "pointer" : "not-allowed",
                                                    }}
                                                    onClick={() => openDeleteModal(group)}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <Users size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchQuery ? "No groups found" : "No groups"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery
                                ? "Try another search"
                                : "Create your first group to get started"}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                            >
                                <Plus size={20} />
                                Créer un groupe
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {showCreateModal && (
                <Modal
                    title="Create New Group"
                    onClose={() => {
                        setShowCreateModal(false);
                        setFormData({ name: "", description: "" });
                    }}
                >
                    <form onSubmit={handleCreateGroup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Group Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Ex: Development Team"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (optional)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Group description..."
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setFormData({ name: "", description: "" });
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                            >
                                {actionLoading ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Edit Group Modal */}
            {showEditModal && (
                <Modal
                    title="Edit Group"
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedGroup(null);
                        setFormData({ name: "", description: "" });
                    }}
                >
                    <form onSubmit={handleEditGroup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom du groupe *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedGroup(null);
                                    setFormData({ name: "", description: "" });
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                            >
                                {actionLoading ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal
                    title="Delete Group"
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedGroup(null);
                    }}
                >
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Are you sure you want to delete the group{" "}
                            <span className="font-semibold text-gray-900">
                                {selectedGroup?.name}
                            </span>
                            ? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedGroup(null);
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteGroup}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                            >
                                {actionLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Invite Users Modal */}
            {showInviteModal && (
                <Modal
                    title={`Invite Members - ${selectedGroup?.name}`}
                    onClose={() => {
                        setShowInviteModal(false);
                        setSelectedGroup(null);
                        setInviteEmails("");
                    }}
                >
                    <form onSubmit={handleInviteUsers} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email addresses (comma-separated)
                            </label>
                            <textarea
                                value={inviteEmails}
                                onChange={(e) => setInviteEmails(e.target.value)}
                                rows={4}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="user1@example.com, user2@example.com"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Users will be automatically added to the group and
                                will receive an invitation email.
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowInviteModal(false);
                                    setSelectedGroup(null);
                                    setInviteEmails("");
                                }}
                                className="flex-1 px-1 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="flex-1 px-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                            >
                                {actionLoading ? "Sending..." : "Send Invitations"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

// Modal Component
function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}


export default GroupsPage;
