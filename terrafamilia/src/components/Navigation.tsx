import { Link } from "react-router-dom";
import { useState } from "react";
import LogoImg from "../assets/Steward-fix-2.webp";
import { useAuth } from "../contexts/AuthContext";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const AuthButtons = () => {
    if (isAuthenticated && user) {
      return (
        <>
          <span className="text-emerald-200 text-sm">
            Welcome, {user.username}!
          </span>
          <button
            onClick={handleLogout}
            className="transition-all duration-300 hover:text-emerald-200 hover:scale-105 hover:underline underline-offset-4 decoration-2"
          >
            Logout
          </button>
        </>
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
      return (
        <>
          <span className="text-emerald-200 text-sm py-2">
            Welcome, {user.username}!
          </span>
          <button
            onClick={handleLogout}
            className="block py-2 transition-all duration-300 hover:text-emerald-200 hover:pl-2 text-left"
          >
            Logout
          </button>
        </>
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
        <img src={LogoImg} alt="" className="max-w-[3rem]" />

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
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 pt-4 pb-2">
          <Link
            to="/"
            className="block py-2 transition-all duration-300 hover:text-emerald-300 hover:pl-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/the-commons"
            className="block py-2 transition-all duration-300 hover:text-emerald-300 hover:pl-2"
            onClick={() => setIsOpen(false)}
          >
            The Commons
          </Link>
          <Link
            to="/about-us"
            className="block py-2 transition-all duration-300 hover:text-emerald-300 hover:pl-2"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <MobileAuthButtons />
        </div>
      </div>
    </header>
  );
}

export default Navigation;
