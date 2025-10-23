import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Nav from "../components/Navigation";
import Footer from "../components/Footer";
import ApiService from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  category_id: number;
  created_at: string;
  replies_count: number;
  views: number;
}

function ForumCategory() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState("");

  // Map category slugs to display names and IDs
  const categoryMap: { [key: string]: { name: string; id: number } } = {
    "trading-barter": { name: "Trading & Barter", id: 1 },
    "knowledge-exchange": { name: "Knowledge Exchange", id: 2 },
    "community-life": { name: "Community Life", id: 3 },
    "commons-hub": { name: "The Commons Hub", id: 4 },
    "item-skill-exchange": { name: "Item & Skill Exchange", id: 2 },
    "community-projects": { name: "Community Projects", id: 2 },
    "free-giveaways": { name: "Free Stuff / Giveaways", id: 4 },
    "ask-answer": { name: "Ask & Answer", id: 2 },
    "guides-tutorials": { name: "Guides & Tutorials", id: 2 },
    "local-resources": { name: "Local Resources", id: 2 },
    introductions: { name: "Introductions", id: 3 },
    "events-meetups": { name: "Events & Meetups", id: 3 },
    "general-discussion": { name: "General Discussion", id: 3 },
    announcements: { name: "Announcements", id: 4 },
    "feedback-suggestions": { name: "Feedback & Suggestions", id: 4 },
    "help-support": { name: "Help & Support", id: 4 },
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!categorySlug) return;

      const categoryInfo = categoryMap[categorySlug];
      if (!categoryInfo) return;

      setCategoryName(categoryInfo.name);

      try {
        const response = await ApiService.getPosts({
          category_id: categoryInfo.id,
          page: currentPage,
          limit: 10,
        });

        if (response.success) {
          setPosts(response.posts || []);
          setTotalPages(Math.ceil((response.total || 0) / 10));
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categorySlug, currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading posts...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-grow container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-slate-600">
            <li>
              <Link to="/the-commons" className="hover:text-emerald-600">
                The Commons
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-800 font-medium">{categoryName}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-slate-800 mb-2">
              {categoryName}
            </h1>
            <p className="text-sm md:text-base text-slate-600">
              {posts.length} {posts.length === 1 ? "post" : "posts"} in this
              category
            </p>
          </div>

          {/* Create Post Button */}
          {isAuthenticated ? (
            <Link
              to={`/create-post?category=${categorySlug}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Create New Post
            </Link>
          ) : (
            <Link
              to="/sso"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Login to Post
            </Link>
          )}
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-8 text-center">
            <div className="text-slate-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
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
            <h3 className="text-lg md:text-xl font-semibold text-slate-600 mb-2">
              No posts yet
            </h3>
            <p className="text-sm md:text-base text-slate-500 mb-6">
              Be the first to start a conversation in {categoryName}!
            </p>
            {isAuthenticated ? (
              <Link
                to={`/create-post?category=${categorySlug}`}
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Create First Post
              </Link>
            ) : (
              <Link
                to="/sso"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Login to Create Post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <Link
                      to={`/forum/${categorySlug}/${post.id}`}
                      className="block group"
                    >
                      <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm md:text-base text-slate-600 mb-3 line-clamp-2">
                        {post.content.substring(0, 200)}
                        {post.content.length > 200 && "..."}
                      </p>
                    </Link>

                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>by {post.author}</span>
                      <span>•</span>
                      <span>{formatDate(post.created_at)}</span>
                      <span>•</span>
                      <span>{post.replies_count} replies</span>
                      <span>•</span>
                      <span>{post.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-200 text-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentPage === page
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-200 text-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ForumCategory;
