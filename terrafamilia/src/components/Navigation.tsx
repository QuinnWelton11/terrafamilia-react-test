import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import LogoImg from "../assets/Steward-fix-2.webp";
import { useAuth } from "../contexts/AuthContext";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
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
            onClick={toggleProfileMenu}
            className="flex items-center space-x-2 transition-all duration-300 hover:opacity-80"
          >
            <img
              src={avatarUrl}
              alt={user.full_name}
              className="w-10 h-10 rounded-full border-2 border-emerald-400 hover:border-emerald-300"
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-slate-200">
              <Link
                to="/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="block px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                View Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
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
          className="transition-all duration-300 hover:text-emerald-200 hover:scale-105 hover:underline underline-offset-4 decoration-2"
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
            onClick={toggleMobileProfileMenu}
            className="flex items-center space-x-3 py-2 transition-all duration-300 hover:text-emerald-200 hover:pl-2 w-full"
          >
            <img
              src={avatarUrl}
              alt={user.full_name}
              className="w-8 h-8 rounded-full border-2 border-emerald-400"
            />
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
                className="flex items-center px-4 py-3 text-slate-100 hover:bg-emerald-600/20 hover:text-emerald-200 transition-colors"
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
                View Profile
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
          className="block py-2 transition-all duration-300 hover:text-emerald-200 hover:pl-2"
          onClick={() => setIsOpen(false)}
        >
          Login
        </Link>
      );
    }
  };

  return (
    <header className="bg-slate-800 text-slate-100 px-4 md:px-10 py-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center space-x-2 text-base md:text-xl">
          <img src={LogoImg} alt="" className="max-w-[3rem]" />
          <h1>Terrafamilia</h1>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-5 text-lg items-center">
          <Link
            to="/"
            className="transition-all duration-300 hover:text-emerald-300 hover:scale-105 hover:underline underline-offset-4 decoration-2"
          >
            Home
          </Link>
          <Link
            to="/the-commons"
            className="transition-all duration-300 hover:text-emerald-300 hover:scale-105 hover:underline underline-offset-4 decoration-2"
          >
            The Commons
          </Link>
          <Link
            to="/about-us"
            className="transition-all duration-300 hover:text-emerald-300 hover:scale-105 hover:underline underline-offset-4 decoration-2"
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
            className="block py-3 transition-all duration-300 hover:text-emerald-300 hover:pl-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <div className="border-t border-slate-600/30 my-1"></div>
          <Link
            to="/the-commons"
            className="block py-3 transition-all duration-300 hover:text-emerald-300 hover:pl-2"
            onClick={() => setIsOpen(false)}
          >
            The Commons
          </Link>
          <div className="border-t border-slate-600/30 my-1"></div>
          <Link
            to="/about-us"
            className="block py-3 transition-all duration-300 hover:text-emerald-300 hover:pl-2"
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
