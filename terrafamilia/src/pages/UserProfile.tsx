import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import SupabaseService from "../services/supabase";
import type { Post } from "../services/supabase";
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Music,
  Globe,
  Mail,
} from "lucide-react";

function UserProfile() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"info" | "posts" | "security">(
    "info"
  );

  // Profile info state
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [substackUrl, setSubstackUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Posts state
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Security state
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sso");
      return;
    }

    if (user) {
      setFullName(user.full_name || "");
      setUsername(user.username || "");
      setCountry(user.country || "");
      setStateProvince(user.state_province || "");
      setPhoneNumber(user.phone_number || "");
      setTwitterUrl(user.twitter_url || "");
      setFacebookUrl(user.facebook_url || "");
      setInstagramUrl(user.instagram_url || "");
      setLinkedinUrl(user.linkedin_url || "");
      setYoutubeUrl(user.youtube_url || "");
      setTiktokUrl(user.tiktok_url || "");
      setSubstackUrl(user.substack_url || "");
      setWebsiteUrl(user.website_url || "");
      setNewEmail(user.email || "");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (activeTab === "posts" && user) {
      loadUserPosts();
    }
  }, [activeTab, user]);

  const loadUserPosts = async () => {
    if (!user) return;

    setPostsLoading(true);
    try {
      const { posts } = await SupabaseService.getUserPosts(user.id);
      setUserPosts(posts);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await SupabaseService.uploadAvatar(avatarFile);
      await refreshUser();
      setMessage("Profile picture updated successfully!");
      setAvatarFile(null);
      setAvatarPreview("");
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await SupabaseService.deleteAvatar();
      await refreshUser();
      setMessage("Profile picture removed successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to remove avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await SupabaseService.updateProfile(user.id, {
        full_name: fullName,
        username: username,
        country: country || undefined,
        state_province: stateProvince || undefined,
        phone_number: phoneNumber || undefined,
        twitter_url: twitterUrl || undefined,
        facebook_url: facebookUrl || undefined,
        instagram_url: instagramUrl || undefined,
        linkedin_url: linkedinUrl || undefined,
        youtube_url: youtubeUrl || undefined,
        tiktok_url: tiktokUrl || undefined,
        substack_url: substackUrl || undefined,
        website_url: websiteUrl || undefined,
      });
      await refreshUser();
      setMessage("Profile updated successfully!");
      setEditMode(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || newEmail === user?.email) {
      setError("Please enter a new email address");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await SupabaseService.updateEmail(newEmail);
      setMessage("Email update initiated. Please check your inbox to confirm.");
      await refreshUser();
    } catch (err: any) {
      setError(err.message || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await SupabaseService.updatePassword(newPassword);
      setMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-slate-700">Loading...</p>
        </div>
      </div>
    );
  }

  const avatarUrl =
    user.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.full_name
    )}&background=10b981&color=fff&bold=true&size=128`;

  return (
    <div className="grow bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Avatar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={avatarPreview || avatarUrl}
                alt={user.full_name}
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
            </div>
            <div className="grow text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-800">
                {user.full_name}
              </h1>
              <p className="text-slate-600">@{user.username}</p>
              <p className="text-sm text-slate-500 mt-2">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <label
                  htmlFor="avatar-upload"
                  className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  Change Picture
                </label>
                {avatarFile && (
                  <button
                    onClick={handleUploadAvatar}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                )}
                {user.avatar_url && (
                  <button
                    onClick={handleDeleteAvatar}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    Remove Picture
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                activeTab === "info"
                  ? "bg-slate-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                activeTab === "posts"
                  ? "bg-slate-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              My Posts
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                activeTab === "security"
                  ? "bg-slate-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Security
            </button>
          </div>

          <div className="p-6">
            {/* Profile Info Tab */}
            {activeTab === "info" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Profile Information
                  </h2>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Username *
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={stateProvince}
                        onChange={(e) => setStateProvince(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    {/* Social Media Section */}
                    <div className="border-t border-slate-200 pt-4 mt-6">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        Social Media Links (Optional)
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Twitter/X URL
                          </label>
                          <input
                            type="url"
                            value={twitterUrl}
                            onChange={(e) => setTwitterUrl(e.target.value)}
                            placeholder="https://twitter.com/username"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Facebook URL
                          </label>
                          <input
                            type="url"
                            value={facebookUrl}
                            onChange={(e) => setFacebookUrl(e.target.value)}
                            placeholder="https://facebook.com/username"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Instagram URL
                          </label>
                          <input
                            type="url"
                            value={instagramUrl}
                            onChange={(e) => setInstagramUrl(e.target.value)}
                            placeholder="https://instagram.com/username"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            LinkedIn URL
                          </label>
                          <input
                            type="url"
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            YouTube URL
                          </label>
                          <input
                            type="url"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="https://youtube.com/@username"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            TikTok URL
                          </label>
                          <input
                            type="url"
                            value={tiktokUrl}
                            onChange={(e) => setTiktokUrl(e.target.value)}
                            placeholder="https://tiktok.com/@username"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Substack URL
                          </label>
                          <input
                            type="url"
                            value={substackUrl}
                            onChange={(e) => setSubstackUrl(e.target.value)}
                            placeholder="https://yourname.substack.com"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Personal Website
                          </label>
                          <input
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="https://yourwebsite.com"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-6 py-2 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-500">
                        Full Name
                      </label>
                      <p className="text-lg text-slate-800">{user.full_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500">
                        Username
                      </label>
                      <p className="text-lg text-slate-800">@{user.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500">
                        Country
                      </label>
                      <p className="text-lg text-slate-800">
                        {user.country || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500">
                        State/Province
                      </label>
                      <p className="text-lg text-slate-800">
                        {user.state_province || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500">
                        Phone Number
                      </label>
                      <p className="text-lg text-slate-800">
                        {user.phone_number || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500">
                        Member Since
                      </label>
                      <p className="text-lg text-slate-800">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Social Media Links */}
                    {(user.twitter_url ||
                      user.facebook_url ||
                      user.instagram_url ||
                      user.linkedin_url ||
                      user.youtube_url ||
                      user.tiktok_url ||
                      user.substack_url ||
                      user.website_url) && (
                      <div className="border-t border-slate-200 pt-4 mt-4">
                        <label className="block text-sm font-medium text-slate-500 mb-3">
                          Social Media
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {user.twitter_url && (
                            <a
                              href={user.twitter_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
                            >
                              <Twitter size={18} />
                              <span>Twitter</span>
                            </a>
                          )}
                          {user.facebook_url && (
                            <a
                              href={user.facebook_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
                            >
                              <Facebook size={18} />
                              <span>Facebook</span>
                            </a>
                          )}
                          {user.instagram_url && (
                            <a
                              href={user.instagram_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
                            >
                              <Instagram size={18} />
                              <span>Instagram</span>
                            </a>
                          )}
                          {user.linkedin_url && (
                            <a
                              href={user.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
                            >
                              <Linkedin size={18} />
                              <span>LinkedIn</span>
                            </a>
                          )}
                          {user.youtube_url && (
                            <a
                              href={user.youtube_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
                            >
                              <Youtube size={18} />
                              <span>YouTube</span>
                            </a>
                          )}
                          {user.tiktok_url && (
                            <a
                              href={user.tiktok_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
                            >
                              <Music size={18} />
                              <span>TikTok</span>
                            </a>
                          )}
                          {user.substack_url && (
                            <a
                              href={user.substack_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
                            >
                              <Mail size={18} />
                              <span>Substack</span>
                            </a>
                          )}
                          {user.website_url && (
                            <a
                              href={user.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
                            >
                              <Globe size={18} />
                              <span>Website</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  My Posts
                </h2>
                {postsLoading ? (
                  <p className="text-center text-slate-600">Loading posts...</p>
                ) : userPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 mb-4">
                      You haven't created any posts yet.
                    </p>
                    <Link
                      to="/create-post"
                      className="inline-block px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
                    >
                      Create Your First Post
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/forum/${post.categories?.slug}/${post.id}`}
                        className="block p-4 border border-slate-200 rounded-lg hover:border-slate-500 hover:shadow-md transition-all"
                      >
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded">
                            {post.categories?.name}
                          </span>
                          <div className="flex gap-4">
                            <span>{post.view_count} views</span>
                            <span>{post.reply_count} replies</span>
                            <span>
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    Change Email
                  </h2>
                  <form
                    onSubmit={handleUpdateEmail}
                    className="space-y-4 max-w-md"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        New Email Address
                      </label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? "Updating..." : "Update Email"}
                    </button>
                  </form>
                </div>

                <hr className="border-slate-200" />

                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    Change Password
                  </h2>
                  <form
                    onSubmit={handleUpdatePassword}
                    className="space-y-4 max-w-md"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
