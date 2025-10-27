import { useState, useEffect } from "react";
import { Users, FileText, AlertCircle, TrendingUp } from "lucide-react";
import supabaseService from "../../services/supabase";

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalReplies: number;
  bannedUsers: number;
  moderators: number;
  todayPosts: number;
  todayReplies: number;
  todayUsers: number;
}

function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await supabaseService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-slate-600 py-8">
        Failed to load dashboard statistics.
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: `+${stats.todayUsers} today`,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      change: `+${stats.todayPosts} today`,
      icon: FileText,
      color: "bg-emerald-500",
    },
    {
      title: "Total Replies",
      value: stats.totalReplies,
      change: `+${stats.todayReplies} today`,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "Banned Users",
      value: stats.bannedUsers,
      change: `${stats.moderators} moderators`,
      icon: AlertCircle,
      color: "bg-red-500",
    },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-slate-800 mb-2">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Quick Overview
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">Community Activity</p>
              <p className="text-sm text-slate-600">
                {stats.todayPosts + stats.todayReplies} new interactions today
              </p>
            </div>
            <TrendingUp className="text-emerald-600" size={24} />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">Moderation Team</p>
              <p className="text-sm text-slate-600">
                {stats.moderators} active moderators
              </p>
            </div>
            <Users className="text-blue-600" size={24} />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">User Management</p>
              <p className="text-sm text-slate-600">
                {stats.bannedUsers} users currently banned
              </p>
            </div>
            <AlertCircle className="text-red-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
