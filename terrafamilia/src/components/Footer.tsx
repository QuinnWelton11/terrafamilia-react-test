import { Link } from "react-router-dom";
import Logo from "../assets/Steward-fix-2.webp";

function Footer() {
  return (
    <footer className="bg-linear-to-t from-slate-400 to-slate-500 text-white text-sm sm:text-base p-4 sm:p-6 mt-auto">
      <div className="flex flex-col items-center gap-4 max-w-6xl mx-auto">
        <div className="flex flex-row items-center">
          <img
            src={Logo}
            alt="Terrafamilia Logo"
            className="w-10 sm:w-12 md:w-[60px]"
          />
        </div>
        <nav className="flex flex-wrap justify-center items-center gap-3 sm:gap-5">
          <Link to="/" className="hover:text-cyan-100 hover:underline">
            Home
          </Link>
          <Link
            to="/the-commons"
            className="hover:text-cyan-100 hover:underline"
          >
            The Commons
          </Link>
          <Link to="/about-us" className="hover:text-cyan-100 hover:underline">
            About
          </Link>
          <Link to="/credits" className="hover:text-cyan-100 hover:underline">
            Credits
          </Link>
          <Link to="/terms" className="hover:text-cyan-100 hover:underline">
            Terms
          </Link>
          <Link to="/eula" className="hover:text-cyan-100 hover:underline">
            EULA
          </Link>
        </nav>
        <div className="text-center">
          <p className="text-slate-300">Copyright 2025</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
