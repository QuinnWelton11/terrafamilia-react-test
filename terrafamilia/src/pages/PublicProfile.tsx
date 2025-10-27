import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import supabaseService from "../services/supabase";
import { Calendar, FileText, MapPin, Phone } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  country?: string;
  state_province?: string;
  phone_number?: string;
  created_at: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  category: {
    name: string;
    slug: string;
  };
  reply_count: number;
}

function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      // Get profile
      const profileData = await supabaseService.getProfile(userId!);
      setProfile(profileData);

      // Get user's posts
      const { data: postsData, error } = await supabaseService
        .getSupabaseClient()
        .from("posts")
        .select(
          `
          id,
          title,
          content,
          created_at,
          reply_count,
          category:category_id (name, slug)
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedPosts =
        postsData?.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          created_at: post.created_at,
          reply_count: post.reply_count,
          category: post.category,
        })) || [];

      setPosts(formattedPosts);
      setPostCount(formattedPosts.length);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const formatPostDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            User Not Found
          </h2>
          <p className="text-slate-600 mb-4">
            This user profile doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="text-emerald-600 hover:text-emerald-700 underline"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <img
              src={
                profile.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.full_name
                )}&background=10b981&color=fff&bold=true&size=200`
              }
              alt={profile.full_name}
              className="w-32 h-32 rounded-full border-4 border-emerald-400"
            />

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {profile.full_name}
              </h1>
              <p className="text-xl text-slate-600 mb-4">@{profile.username}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                <div className="px-4 py-2 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-slate-600">Posts</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {postCount}
                  </p>
                </div>
                <div className="px-4 py-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-slate-600">Member Since</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatDate(profile.created_at)}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-col gap-2 text-slate-600">
                {profile.country && profile.state_province && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-emerald-600" />
                    <span>
                      {profile.state_province}, {profile.country}
                    </span>
                  </div>
                )}
                {profile.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-emerald-600" />
                    <span>{profile.phone_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="text-emerald-600" />
            Recent Posts
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">
                This user hasn't made any posts yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/forum/${post.category.slug}/${post.id}`}
                  className="block p-4 border border-slate-200 rounded-lg hover:border-emerald-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-800 hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                      {post.category.name}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatPostDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText size={14} />
                      <span>{post.reply_count} replies</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {posts.length > 0 && (
            <div className="mt-6 text-center">
              <Link
                to="/the-commons"
                className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
              >
                View All Posts in The Commons
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicProfile;
