import { useState, useEffect } from "react";
import supabaseService from "../../services/supabase";
import { Shield, Ban, Trash2, Check, Calendar } from "lucide-react";
import type { AdminAction } from "../../services/supabase";

function ActivityLog() {
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    loadActions();
  }, [currentPage]);

  const loadActions = async () => {
    setLoading(true);
    try {
      const result = await supabaseService.getAdminActions(
        currentPage,
        pageSize
      );
      setActions(result.actions);
    } catch (error) {
      console.error("Error loading admin actions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "assign_moderator":
      case "remove_moderator":
        return <Shield size={20} />;
      case "ban_user":
        return <Ban size={20} />;
      case "unban_user":
        return <Check size={20} />;
      case "delete_post":
      case "delete_reply":
        return <Trash2 size={20} />;
      default:
        return <Shield size={20} />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case "assign_moderator":
        return "bg-blue-100 text-blue-800";
      case "remove_moderator":
        return "bg-orange-100 text-orange-800";
      case "ban_user":
        return "bg-red-100 text-red-800";
      case "unban_user":
        return "bg-emerald-100 text-emerald-800";
      case "delete_post":
      case "delete_reply":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getActionLabel = (actionType: string) => {
    return actionType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && actions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Admin Activity Log
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Track all moderation and administrative actions
          </p>
        </div>

        {/* Activity List */}
        <div className="divide-y divide-slate-200">
          {actions.map((action) => (
            <div
              key={action.id}
              className="p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div
                  className={`p-3 rounded-lg ${getActionColor(
                    action.action_type
                  )}`}
                >
                  {getActionIcon(action.action_type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {getActionLabel(action.action_type)}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        by{" "}
                        <span className="font-medium">
                          {action.admin?.full_name || "Unknown"}
                        </span>{" "}
                        (@{action.admin?.username || "unknown"})
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <Calendar size={16} />
                      <span>{formatDate(action.created_at)}</span>
                    </div>
                  </div>

                  {/* Target Info */}
                  <div className="mt-3 text-sm">
                    <span className="text-slate-600">Target: </span>
                    <span className="font-medium text-slate-800">
                      {action.target_type} #{action.target_id}
                    </span>
                  </div>

                  {/* Reason */}
                  {action.reason && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Reason:</span>{" "}
                        {action.reason}
                      </p>
                    </div>
                  )}

                  {/* Metadata */}
                  {action.metadata &&
                    Object.keys(action.metadata).length > 0 && (
                      <div className="mt-3">
                        <details className="text-sm">
                          <summary className="cursor-pointer text-slate-600 hover:text-slate-800">
                            View metadata
                          </summary>
                          <pre className="mt-2 p-3 bg-slate-50 rounded-lg overflow-x-auto text-xs">
                            {JSON.stringify(action.metadata, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {actions.length === 0 && !loading && (
          <div className="p-12 text-center text-slate-600">
            No admin actions recorded yet.
          </div>
        )}

        {/* Pagination */}
        {actions.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white border border-slate-300 rounded-lg">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={actions.length < pageSize}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityLog;
