import { Link, useNavigate } from "react-router-dom";
import Cover from "../components/CoverImg";
import { useState, useEffect } from "react";
import SupabaseService from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";
import { PlusCircle, Search } from "lucide-react";

interface RecentPost {
  id: string;
  title: string;
  category_id: string;
  created_at: string;
  last_reply_at: string | null;
  reply_count: number;
  images?: string[];
  profiles: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  } | null;
  categories: { slug: string } | null;
}

function TheCommons() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RecentPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent posts (latest 5 posts across all categories)
        const recentData = await SupabaseService.getRecentActivity(5);
        setRecentPosts(recentData as any); // Type assertion for Supabase joined data
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setRecentLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search posts when query changes (debounced)
  useEffect(() => {
    const searchPosts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await SupabaseService.searchPosts(searchQuery);
        setSearchResults(results as any);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchPosts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const forumCategories = [
    {
      name: "Trading & Barter",
      slug: "trading-barter",
      description:
        "Exchange items, skills, and services with community members",
      subcategories: [
        { name: "Item & Skill Exchange", slug: "item-skill-exchange" },
        { name: "Community Projects", slug: "community-projects" },
        { name: "Free Stuff / Giveaways", slug: "free-giveaways" },
      ],
    },
    {
      name: "Knowledge Exchange",
      slug: "knowledge-exchange",
      description: "Share wisdom, ask questions, and learn together",
      subcategories: [
        { name: "Ask & Answer", slug: "ask-answer" },
        { name: "Guides & Tutorials", slug: "guides-tutorials" },
        { name: "Local Resources", slug: "local-resources" },
      ],
    },
    {
      name: "Community Life",
      slug: "community-life",
      description: "Connect with neighbors and build relationships",
      subcategories: [
        { name: "Introductions", slug: "introductions" },
        { name: "Events & Meetups", slug: "events-meetups" },
        { name: "General Discussion", slug: "general-discussion" },
      ],
    },
    {
      name: "The Commons Hub",
      slug: "commons-hub",
      description: "Official updates and community support",
      subcategories: [
        { name: "Announcements", slug: "announcements" },
        { name: "Feedback & Suggestions", slug: "feedback-suggestions" },
        { name: "Help & Support", slug: "help-support" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Show loading screen while data is loading */}
      {recentLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-slate-600 text-lg">
              Loading The Commons...
            </p>
          </div>
        </div>
      ) : (
        <>
          <Cover />
          <div className="container mx-auto px-6 py-8 grow max-w-7xl bg-slate-50">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-4">
                The Commons
              </h1>
              <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                Welcome to our community forum! Connect, share, and collaborate
                with fellow members.
              </p>
            </div>

            {/* Search Bar with Create Post Button */}
            <div className="flex flex-col md:flex-row justify-center gap-3 mb-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
              <Link
                to="/create-post"
                className="bg-slate-500 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 md:w-auto whitespace-nowrap"
                title="Create New Post"
              >
                <PlusCircle className="w-5 h-5" />
                <span className="md:hidden">Create Post</span>
              </Link>
            </div>

            {/* Forum Categories */}
            <div className="grid gap-6 md:grid-cols-2">
              {forumCategories.map((category) => (
                <div
                  key={category.slug}
                  className="bg-white/95 rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <h2 className="text-lg md:text-2xl font-semibold text-slate-800 mb-2">
                    {category.name}
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 mb-4">
                    {category.description}
                  </p>

                  {/* Subcategories */}
                  <div className="space-y-2">
                    {category.subcategories.map((sub) => (
                      <div
                        key={sub.slug}
                        className="block p-3 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors duration-200 cursor-pointer"
                        onClick={() => navigate(`/forum/${sub.slug}`)}
                      >
                        <span className="text-cyan-600 hover:text-cyan-700 font-medium">
                          {sub.name}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          (Click to view posts)
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* View All Link */}
                  <button
                    onClick={() => navigate(`/forum/${category.slug}`)}
                    className="inline-block mt-4 text-cyan-600 hover:text-cyan-700 font-medium cursor-pointer"
                  >
                    View all in {category.name} →
                  </button>
                </div>
              ))}
            </div>

            {/* Recent Activity / Search Results Section */}
            <div className="mt-12">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-6">
                {searchQuery.trim() ? "Search Results" : "Recent Activity"}
              </h2>
              <div className="bg-white/95 rounded-lg shadow-md border border-slate-200 p-6">
                {isSearching ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                    <p className="mt-2 text-slate-500">Searching posts...</p>
                  </div>
                ) : searchQuery.trim() && searchResults.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-slate-400 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-500 mb-4">
                      No results found for "{searchQuery}"
                    </p>
                    <p className="text-sm text-slate-400">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                ) : recentLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                    <p className="mt-2 text-slate-500">
                      Loading recent activity...
                    </p>
                  </div>
                ) : (searchQuery.trim() ? searchResults : recentPosts)
                    .length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-slate-400 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-500 mb-4">
                      No recent activity yet
                    </p>
                    <p className="text-sm text-slate-400">
                      Be the first to start a conversation in the community!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(searchQuery.trim() ? searchResults : recentPosts).map(
                      (post) => {
                        const categorySlug =
                          post.categories?.slug || "general-discussion";
                        const author = post.profiles?.username || "Anonymous";
                        const authorId = post.profiles?.id;
                        const authorName =
                          post.profiles?.full_name || "Anonymous";
                        const authorAvatar = post.profiles?.avatar_url;
                        const isOwnPost = user && authorId === user.id;

                        return (
                          <div
                            key={post.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                          >
                            {/* Author Avatar */}
                            <Link
                              to={isOwnPost ? "/profile" : `/user/${authorId}`}
                              className="shrink-0"
                            >
                              <img
                                src={
                                  authorAvatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    authorName
                                  )}&background=10b981&color=fff&bold=true&size=80`
                                }
                                alt={authorName}
                                className="w-12 h-12 rounded-full border-2 border-cyan-400 hover:border-cyan-500 transition-colors"
                              />
                            </Link>

                            {/* Thumbnail if image exists */}
                            {post.images && post.images.length > 0 && (
                              <Link
                                to={`/forum/${categorySlug}/${post.id}`}
                                className="shrink-0"
                              >
                                <img
                                  src={post.images[0]}
                                  alt=""
                                  className="w-full sm:w-16 sm:h-16 h-32 object-cover rounded border border-slate-300"
                                />
                              </Link>
                            )}

                            <div className="min-w-0 flex-1">
                              <Link
                                to={`/forum/${categorySlug}/${post.id}`}
                                className="block group"
                              >
                                <h3 className="font-medium text-slate-800 group-hover:text-cyan-600 transition-colors mb-1 wrap-break-word">
                                  {post.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
                                  <span className="shrink-0">by {author}</span>
                                  <span className="shrink-0">•</span>
                                  <span className="shrink-0">
                                    {formatDate(post.created_at)}
                                  </span>
                                  <span className="shrink-0">•</span>
                                  <span className="shrink-0">
                                    {post.reply_count} replies
                                  </span>
                                  {post.images && post.images.length > 1 && (
                                    <>
                                      <span className="shrink-0">•</span>
                                      <span className="shrink-0 text-cyan-600">
                                        +{post.images.length - 1} more
                                      </span>
                                    </>
                                  )}
                                </div>
                              </Link>
                            </div>
                            <Link
                              to={`/forum/${categorySlug}`}
                              className="shrink-0 self-start sm:self-center px-3 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-full hover:bg-cyan-200 transition-colors whitespace-nowrap"
                            >
                              View Category
                            </Link>
                          </div>
                        );
                      }
                    )}

                    {/* View All Recent Posts Link */}
                    <div className="text-center pt-4 border-t border-slate-200">
                      <Link
                        to="/forum/general-discussion"
                        className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                      >
                        View All Recent Posts →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TheCommons;
