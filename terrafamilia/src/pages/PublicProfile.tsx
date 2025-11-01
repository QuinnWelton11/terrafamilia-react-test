import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import supabaseService from "../services/supabase";
import {
  Calendar,
  FileText,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Music,
  Globe,
  Mail,
} from "lucide-react";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  country?: string;
  state_province?: string;
  phone_number?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  substack_url?: string;
  website_url?: string;
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
                  profile.username
                )}&background=10b981&color=fff&bold=true&size=200`
              }
              alt={profile.username}
              className="w-32 h-32 rounded-full border-4 border-cyan-100"
            />

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                @{profile.username}
              </h1>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4 text-shadow-md">
                <div className="px-4 py-2 bg-slate-500 rounded-lg">
                  <p className="text-sm text-slate-100">Posts</p>
                  <p className="text-2xl font-bold text-cyan-50">{postCount}</p>
                </div>
                <div className="px-4 py-2 bg-slate-500 rounded-lg">
                  <p className="text-sm text-slate-100">Member Since</p>
                  <p className="text-lg font-semibold text-slate-50">
                    {formatDate(profile.created_at)}
                  </p>
                </div>
              </div>

              {/* Social Media Links */}
              {(profile.twitter_url ||
                profile.facebook_url ||
                profile.instagram_url ||
                profile.linkedin_url ||
                profile.youtube_url ||
                profile.tiktok_url ||
                profile.substack_url ||
                profile.website_url) && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Connect with me:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.twitter_url && (
                      <a
                        href={profile.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors text-cyan-800 text-sm"
                        title="Twitter/X"
                      >
                        <Twitter size={16} />
                        <span>Twitter</span>
                      </a>
                    )}
                    {profile.facebook_url && (
                      <a
                        href={profile.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors text-cyan-800 text-sm"
                        title="Facebook"
                      >
                        <Facebook size={16} />
                        <span>Facebook</span>
                      </a>
                    )}
                    {profile.instagram_url && (
                      <a
                        href={profile.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors text-cyan-800 text-sm"
                        title="Instagram"
                      >
                        <Instagram size={16} />
                        <span>Instagram</span>
                      </a>
                    )}
                    {profile.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors text-cyan-800 text-sm"
                        title="LinkedIn"
                      >
                        <Linkedin size={16} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {profile.youtube_url && (
                      <a
                        href={profile.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors text-cyan-800 text-sm"
                        title="YouTube"
                      >
                        <Youtube size={16} />
                        <span>YouTube</span>
                      </a>
                    )}
                    {profile.tiktok_url && (
                      <a
                        href={profile.tiktok_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors text-cyan-800 text-sm"
                        title="TikTok"
                      >
                        <Music size={16} />
                        <span>TikTok</span>
                      </a>
                    )}
                    {profile.substack_url && (
                      <a
                        href={profile.substack_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors text-cyan-800 text-sm"
                        title="Substack"
                      >
                        <Mail size={16} />
                        <span>Substack</span>
                      </a>
                    )}
                    {profile.website_url && (
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors text-cyan-800 text-sm"
                        title="Website"
                      >
                        <Globe size={16} />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Note: Location and phone number hidden for privacy */}
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="text-slate-600" />
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
                  className="block p-4 border border-slate-200 rounded-lg hover:border-cyan-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-800 hover:text-cyan-700 transition-colors">
                      {post.title}
                    </h3>
                    <span className="px-3 py-1 bg-cyan-200 text-slate-700 text-xs font-semibold rounded-full">
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
                className="inline-block px-6 py-3 bg-slate-500 hover:bg-cyan-900 text-white text-shadow-md font-semibold rounded-lg transition-colors"
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
