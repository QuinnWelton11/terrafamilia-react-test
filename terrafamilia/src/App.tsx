import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import TheCommons from "./pages/TheCommons";
import AboutUs from "./pages/AboutUs";
import SSO from "./pages/SSO";
import EULA from "./pages/EULA";
import ForumCategory from "./pages/ForumCategory";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import UserProfile from "./pages/UserProfile";
import PublicProfile from "./pages/PublicProfile";
import CreditsPage from "./pages/Credits";
import AdminDashboard from "./pages/AdminDashboard";
import DashboardOverview from "./pages/admin/DashboardOverview";
import UserManagement from "./pages/admin/UserManagement";
import PostModeration from "./pages/admin/PostModeration";
import ActivityLog from "./pages/admin/ActivityLog";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes - No Navigation/Footer */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="posts" element={<PostModeration />} />
            <Route path="activity" element={<ActivityLog />} />
          </Route>

          {/* Main Routes - With Navigation/Footer */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col overflow-x-hidden">
                <Navigation />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/the-commons" element={<TheCommons />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/sso" element={<SSO />} />
                  <Route path="/eula" element={<EULA />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/user/:userId" element={<PublicProfile />} />
                  <Route path="/credits" element={<CreditsPage />} />
                  <Route
                    path="/forum/:categorySlug"
                    element={<ForumCategory />}
                  />
                  <Route
                    path="/forum/:categorySlug/:postId"
                    element={<PostDetail />}
                  />
                  <Route path="/create-post" element={<CreatePost />} />
                </Routes>
                <Footer />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
