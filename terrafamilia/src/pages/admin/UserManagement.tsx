import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import supabaseService from "../../services/supabase";
import { Search, Ban, Shield, ShieldOff, Check, X } from "lucide-react";
import type { Profile } from "../../services/supabase";

function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const pageSize = 20;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await supabaseService.getAllUsers(
        currentPage,
        pageSize,
        searchTerm || undefined
      );
      setUsers(result.users);
      setTotalCount(result.total);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string, username: string) => {
    if (
      !confirm(
        `Are you sure you want to ban ${username}? They will be unable to post.`
      )
    )
      return;

    const reason = prompt("Enter ban reason:");
    if (!reason) return;

    setActionLoading(userId);
    try {
      await supabaseService.banUser(userId, reason);
      await loadUsers();
    } catch (error) {
      alert(`Error banning user: ${(error as Error).message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to unban ${username}?`)) return;

    setActionLoading(userId);
    try {
      await supabaseService.unbanUser(userId);
      await loadUsers();
    } catch (error) {
      alert(`Error unbanning user: ${(error as Error).message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssignModerator = async (userId: string, username: string) => {
    if (!user?.is_admin) {
      alert("Only administrators can assign moderator roles.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to make ${username} a moderator? They will have moderation privileges.`
      )
    )
      return;

    setActionLoading(userId);
    try {
      await supabaseService.assignModeratorRole(userId, true);
      await loadUsers();
    } catch (error) {
      alert(`Error assigning moderator role: ${(error as Error).message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveModerator = async (userId: string, username: string) => {
    if (!user?.is_admin) {
      alert("Only administrators can remove moderator roles.");
      return;
    }

    if (
      !confirm(`Are you sure you want to remove ${username}'s moderator role?`)
    )
      return;

    setActionLoading(userId);
    try {
      await supabaseService.assignModeratorRole(userId, false);
      await loadUsers();
    } catch (error) {
      alert(`Error removing moderator role: ${(error as Error).message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={
                          profile.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            profile.full_name
                          )}&background=10b981&color=fff&bold=true`
                        }
                        alt={profile.full_name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium text-slate-800">
                          {profile.full_name}
                        </p>
                        <p className="text-sm text-slate-600">
                          @{profile.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {profile.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {profile.is_admin && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      )}
                      {profile.is_moderator && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Moderator
                        </span>
                      )}
                      {!profile.is_admin && !profile.is_moderator && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                          User
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {profile.is_banned ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        <X size={12} className="mr-1" />
                        Banned
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                        <Check size={12} className="mr-1" />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {profile.id !== user?.id && !profile.is_admin && (
                        <>
                          {/* Ban/Unban */}
                          {profile.is_banned ? (
                            <button
                              onClick={() =>
                                handleUnbanUser(profile.id, profile.username)
                              }
                              disabled={actionLoading === profile.id}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Unban user"
                            >
                              <Check size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleBanUser(profile.id, profile.username)
                              }
                              disabled={actionLoading === profile.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Ban user"
                            >
                              <Ban size={18} />
                            </button>
                          )}

                          {/* Moderator Role (Admin Only) */}
                          {user?.is_admin && (
                            <>
                              {profile.is_moderator ? (
                                <button
                                  onClick={() =>
                                    handleRemoveModerator(
                                      profile.id,
                                      profile.username
                                    )
                                  }
                                  disabled={actionLoading === profile.id}
                                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Remove moderator"
                                >
                                  <ShieldOff size={18} />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleAssignModerator(
                                      profile.id,
                                      profile.username
                                    )
                                  }
                                  disabled={actionLoading === profile.id}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Make moderator"
                                >
                                  <Shield size={18} />
                                </button>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
              users
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-600">
          No users found matching your search.
        </div>
      )}
    </div>
  );
}

export default UserManagement;
