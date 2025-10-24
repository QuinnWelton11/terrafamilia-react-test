import Nav from "../components/Navigation";
import { Link, useNavigate } from "react-router-dom";
import Cover from "../components/CoverImg";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import ApiService from "../services/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface RecentPost {
  id: number;
  title: string;
  author: string;
  category_id: number;
  created_at: string;
  replies_count: number;
}

function TheCommons() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await ApiService.getCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.categories || []);
        }

        // Fetch recent posts (latest 5 posts across all categories)
        const recentResponse = await ApiService.getPosts({
          page: 1,
          limit: 5,
        });
        if (recentResponse.success) {
          setRecentPosts(recentResponse.posts || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
        setRecentLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get category slug from category ID
  const getCategorySlug = (categoryId: number): string => {
    const categoryIdToSlug: { [key: number]: string } = {
      1: "trading-barter",
      2: "knowledge-exchange",
      3: "community-life",
      4: "commons-hub",
    };
    return categoryIdToSlug[categoryId] || "general-discussion";
  };

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
      <Nav />
      <Cover />
      <div className="container mx-auto px-6 py-8 flex-grow max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-4">
            The Commons
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Welcome to our community forum! Connect, share, and collaborate with
            fellow members.
          </p>
        </div>

        {/* User Actions */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <Link
            to="/sso"
            className="bg-teal-700 hover:bg-sky-800 text-white px-6 py-2 rounded-lg transition-colors duration-300 text-center"
          >
            Login
          </Link>
          <Link
            to="/create-post"
            className="bg-green-700 hover:bg-sky-800 text-white px-6 py-2 rounded-lg transition-colors duration-300 text-center"
          >
            Create New Post
          </Link>
          <button className="bg-emerald-700 hover:bg-sky-800 text-white px-6 py-2 rounded-lg transition-colors duration-300">
            Search Posts
          </button>
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
                    <span className="text-emerald-600 hover:text-emerald-700 font-medium">
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
                className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
              >
                View all in {category.name} →
              </button>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-6">
            Recent Activity
          </h2>
          <div className="bg-white/95 rounded-lg shadow-md border border-slate-200 p-6">
            {recentLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-2 text-slate-500">
                  Loading recent activity...
                </p>
              </div>
            ) : recentPosts.length === 0 ? (
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
                <p className="text-slate-500 mb-4">No recent activity yet</p>
                <p className="text-sm text-slate-400">
                  Be the first to start a conversation in the community!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="flex-grow">
                      <Link
                        to={`/forum/${getCategorySlug(post.category_id)}/${
                          post.id
                        }`}
                        className="block group"
                      >
                        <h3 className="font-medium text-slate-800 group-hover:text-emerald-600 transition-colors mb-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <span>by {post.author}</span>
                          <span>•</span>
                          <span>{formatDate(post.created_at)}</span>
                          <span>•</span>
                          <span>{post.replies_count} replies</span>
                        </div>
                      </Link>
                    </div>
                    <Link
                      to={`/forum/${getCategorySlug(post.category_id)}`}
                      className="ml-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full hover:bg-emerald-200 transition-colors"
                    >
                      View Category
                    </Link>
                  </div>
                ))}

                {/* View All Recent Posts Link */}
                <div className="text-center pt-4 border-t border-slate-200">
                  <Link
                    to="/forum/general-discussion"
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    View All Recent Posts →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TheCommons;
