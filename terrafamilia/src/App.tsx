import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import TheCommons from "./pages/TheCommons";
import AboutUs from "./pages/AboutUs";
import SSO from "./pages/SSO";
import ForumCategory from "./pages/ForumCategory";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/the-commons" element={<TheCommons />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/sso" element={<SSO />} />
            <Route path="/forum/:categorySlug" element={<ForumCategory />} />
            <Route
              path="/forum/:categorySlug/:postId"
              element={<PostDetail />}
            />
            <Route path="/create-post" element={<CreatePost />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
