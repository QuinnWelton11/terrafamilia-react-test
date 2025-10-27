import { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  History,
  Menu,
  X,
  LogOut,
} from "lucide-react";

function AdminDashboard() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sso", { state: { from: location }, replace: true });
      return;
    }

    if (user && !user.is_admin && !user.is_moderator) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      allowModerator: true,
    },
    {
      name: "User Management",
      path: "/admin/users",
      icon: Users,
      allowModerator: true,
    },
    {
      name: "Post Moderation",
      path: "/admin/posts",
      icon: FileText,
      allowModerator: true,
    },
    {
      name: "Activity Log",
      path: "/admin/activity",
      icon: History,
      allowModerator: true,
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => user.is_admin || item.allowModerator
  );

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-slate-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {sidebarOpen && (
            <div>
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <p className="text-xs text-slate-400">
                {user.is_admin ? "Administrator" : "Moderator"}
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "hover:bg-slate-700 text-slate-300"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <Link
            to="/"
            className={`flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 rounded-lg transition-colors text-slate-300 mb-2`}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-600/20 rounded-lg transition-colors text-red-300`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {filteredMenuItems.find(
                  (item) => item.path === location.pathname
                )?.name || "Dashboard"}
              </h1>
              <p className="text-sm text-slate-600">
                Welcome back, {user.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">
                  {user.full_name}
                </p>
                <p className="text-xs text-slate-600">
                  {user.is_admin ? "Admin" : "Moderator"}
                </p>
              </div>
              <img
                src={
                  user.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.full_name
                  )}&background=10b981&color=fff&bold=true`
                }
                alt={user.full_name}
                className="w-10 h-10 rounded-full border-2 border-emerald-500"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
