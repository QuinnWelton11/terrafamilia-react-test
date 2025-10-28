import { Link } from "react-router-dom";
import Logo from "../assets/Steward-fix-2.webp";

function Footer() {
  return (
    <footer className="bg-slate-800 text-white text-sm sm:text-base p-4 sm:p-6 mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
        <div className="flex flex-row items-center space-x-3">
          <img
            src={Logo}
            alt="Terrafamilia Logo"
            className="w-10 sm:w-12 md:w-[60px]"
          />
        </div>
        <Link to="/">Home</Link>
        <Link to="/the-commons">The Commons</Link>
        <Link to="/about">About</Link>
        <Link to="/credits">Credits</Link>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center">
          <p className="text-slate-300">Copyright 2025</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
