import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import TheCommons from "./pages/TheCommons";
import AboutUs from "./pages/AboutUs";
import SSO from "./pages/SSO";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/the-commons" element={<TheCommons />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/sso" element={<SSO />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
