import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import LogoImg from "../assets/Steward-fix-2.webp";
import { useAuth } from "../contexts/AuthContext";
import SupabaseService from "../services/supabase";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user, isAuthenticated, signOut } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMobileProfileMenu = () => {
    setIsMobileProfileMenuOpen(!isMobileProfileMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    setIsProfileMenuOpen(false);
    setIsMobileProfileMenuOpen(false);
  };

  // Fetch notification count when user is authenticated
  useEffect(() => {
    const fetchNotifications = async () => {
      if (isAuthenticated) {
        const count = await SupabaseService.getUnreadNotificationCount();
        setNotificationCount(count);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleProfileClick = async () => {
    // Mark notifications as read when opening profile menu
    if (!isProfileMenuOpen && notificationCount > 0) {
      await SupabaseService.markNotificationsAsRead();
      setNotificationCount(0);
    }
    toggleProfileMenu();
  };

  const handleMobileProfileClick = () => {
    toggleMobileProfileMenu();
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const AuthButtons = () => {
    if (isAuthenticated && user) {
      const avatarUrl =
        user.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.full_name
        )}&background=10b981&color=fff&bold=true`;

      return (
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-2 transition-all duration-300 hover:opacity-80 relative"
          >
            <img
              src={avatarUrl}
              alt={user.full_name}
              className="w-10 h-10 rounded-full border-2 border-cyan-400 hover:border-cyan-300"
            />
            {/* Notification badge on avatar (only when menu is closed) */}
            {!isProfileMenuOpen && notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-slate-200">
              <Link
                to="/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="block px-4 py-2 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors relative"
              >
                <span>View Profile</span>
                {/* Notification badge on menu item */}
                {notificationCount > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <Link
          to="/sso"
          className="transition-all duration-300 hover:text-cyan-100 focus:text-cyan-100 hover:scale-105 hover:underline focus:underline underline-offset-4 decoration-2"
        >
          Login
        </Link>
      );
    }
  };

  const MobileAuthButtons = () => {
    if (isAuthenticated && user) {
      const avatarUrl =
        user.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.full_name
        )}&background=10b981&color=fff&bold=true`;

      return (
        <div className="relative">
          <button
            onClick={handleMobileProfileClick}
            className="flex items-center space-x-3 py-2 transition-all duration-300 hover:text-cyan-200 hover:pl-2 w-full relative"
          >
            <div className="relative">
              <img
                src={avatarUrl}
                alt={user.full_name}
                className="w-8 h-8 rounded-full border-2 border-cyan-400"
              />
              {/* Notification badge on mobile avatar (only when menu is closed) */}
              {!isMobileProfileMenuOpen && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  {notificationCount}
                </span>
              )}
            </div>
            <span>Profile</span>
          </button>

          {/* Mobile Dropdown Menu */}
          {isMobileProfileMenuOpen && (
            <div className="ml-4 mt-2 bg-slate-700/50 backdrop-blur-sm rounded-lg border border-slate-600/50 overflow-hidden">
              <Link
                to="/profile"
                onClick={() => {
                  setIsMobileProfileMenuOpen(false);
                  setIsOpen(false);
                }}
                className="flex items-center px-4 py-3 text-slate-100 hover:bg-cyan-600/20 hover:text-cyan-200 transition-colors relative"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>View Profile</span>
                {/* Notification badge on mobile menu item */}
                {notificationCount > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Link>
              <div className="border-t border-slate-600/50"></div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-slate-100 hover:bg-red-600/20 hover:text-red-200 transition-colors text-left"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <Link
          to="/sso"
          className="block py-2 transition-all duration-300 hover:text-cyan-100 focus:text-cyan-100 hover:scale-105 hover:underline focus:underline hover:pl-2"
          onClick={() => setIsOpen(false)}
        >
          Login
        </Link>
      );
    }
  };

  return (
    <header className="bg-linear-to-r from-slate-500 via-slate-400 to-slate-500 text-slate-50 px-4 md:px-10 py-5 shadow-inner">
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center space-x-2 text-base md:text-xl">
          <img src={LogoImg} alt="" className="max-w-[3rem]" />
          <h1>Terrafamilia</h1>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-5 text-lg items-center">
          <Link
            to="/"
            className="transition-all duration-300 hover:text-cyan-100 focus:text-cyan-100 hover:scale-105 hover:underline focus:underline underline-offset-4 decoration-2"
          >
            Home
          </Link>
          <Link
            to="/the-commons"
            className="transition-all duration-300 hover:text-cyan-100 focus:text-cyan-100 hover:scale-105 hover:underline focus:underline underline-offset-4 decoration-2"
          >
            The Commons
          </Link>
          <Link
            to="/about-us"
            className="transition-all duration-300 hover:text-cyan-100 focus:text-cyan-100 hover:scale-105 hover:underline focus:underline underline-offset-4 decoration-2"
          >
            About
          </Link>
          <AuthButtons />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-slate-100 transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-slate-100 transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-slate-100 transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col pt-4 pb-2">
          <Link
            to="/"
            className="block py-3 transition-all duration-300 hover:text-cyan-300 hover:pl-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <div className="border-t border-slate-600/30 my-1"></div>
          <Link
            to="/the-commons"
            className="block py-3 transition-all duration-300 hover:text-cyan-300 hover:pl-2"
            onClick={() => setIsOpen(false)}
          >
            The Commons
          </Link>
          <div className="border-t border-slate-600/30 my-1"></div>
          <Link
            to="/about-us"
            className="block py-3 transition-all duration-300 hover:text-cyan-300 hover:pl-2"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <div className="border-t border-slate-600/30 my-1"></div>
          <MobileAuthButtons />
        </div>
      </div>
    </header>
  );
}

export default Navigation;
