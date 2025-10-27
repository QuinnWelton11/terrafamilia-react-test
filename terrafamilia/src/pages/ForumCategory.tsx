import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SupabaseService, { type Post } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

function ForumCategory() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const postsPerPage = 10;

  // Map category slugs to display names (no longer need IDs since we'll fetch by slug)
  const categoryDisplayNames: { [key: string]: string } = {
    "trading-barter": "Trading & Barter",
    "knowledge-exchange": "Knowledge Exchange",
    "community-life": "Community Life",
    "commons-hub": "The Commons Hub",
    "item-skill-exchange": "Item & Skill Exchange",
    "community-projects": "Community Projects",
    "free-giveaways": "Free Stuff / Giveaways",
    "ask-answer": "Ask & Answer",
    "guides-tutorials": "Guides & Tutorials",
    "local-resources": "Local Resources",
    introductions: "Introductions",
    "events-meetups": "Events & Meetups",
    "general-discussion": "General Discussion",
    announcements: "Announcements",
    "feedback-suggestions": "Feedback & Suggestions",
    "help-support": "Help & Support",
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!categorySlug) return;

      setCategoryName(categoryDisplayNames[categorySlug] || categorySlug);

      try {
        // First get the category with its children
        const category = await SupabaseService.getCategoryWithChildren(
          categorySlug
        );

        // Check if this category has subcategories (is a parent)
        const subcategories = (category as any).subcategories || [];
        const hasChildren = subcategories.length > 0;

        let result;
        if (hasChildren) {
          // If it's a parent category, fetch posts from all child categories
          const childIds = subcategories.map((sub: any) => sub.id);
          result = await SupabaseService.getPosts({
            category_ids: childIds,
            page: currentPage,
            limit: postsPerPage,
          });
        } else {
          // If it's a leaf category, just fetch posts from this category
          result = await SupabaseService.getPosts({
            category_id: category.id,
            page: currentPage,
            limit: postsPerPage,
          });
        }

        setPosts(result.posts || []);
        setTotalPosts(result.total);
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
        <main className="grow container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading posts...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-slate-600">
            <li>
              <Link to="/the-commons" className="hover:text-cyan-600">
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
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Create New Post
            </Link>
          ) : (
            <Link
              to="/sso"
              className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
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
                className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Create First Post
              </Link>
            ) : (
              <Link
                to="/sso"
                className="inline-block bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Login to Create Post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const author = (post.profiles as any)?.username || "Anonymous";

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail if image exists */}
                    {post.images && post.images.length > 0 && (
                      <Link
                        to={`/forum/${categorySlug}/${post.id}`}
                        className="shrink-0"
                      >
                        <img
                          src={post.images[0]}
                          alt=""
                          className="w-24 h-24 object-cover rounded border border-slate-300"
                        />
                      </Link>
                    )}

                    <div className="grow min-w-0">
                      <Link
                        to={`/forum/${categorySlug}/${post.id}`}
                        className="block group"
                      >
                        <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm md:text-base text-slate-600 mb-3 line-clamp-2">
                          {post.content.substring(0, 200)}
                          {post.content.length > 200 && "..."}
                        </p>
                      </Link>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span>by {author}</span>
                        <span>•</span>
                        <span>{formatDate(post.created_at)}</span>
                        <span>•</span>
                        <span>{post.reply_count} replies</span>
                        <span>•</span>
                        <span>{post.view_count} views</span>
                        {post.images && post.images.length > 1 && (
                          <>
                            <span>•</span>
                            <span className="text-cyan-600">
                              +{post.images.length - 1} more
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPosts > postsPerPage && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-200 text-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
            >
              Previous
            </button>

            {Array.from(
              { length: Math.ceil(totalPosts / postsPerPage) },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentPage === page
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(totalPosts / postsPerPage),
                    currentPage + 1
                  )
                )
              }
              disabled={currentPage === Math.ceil(totalPosts / postsPerPage)}
              className="px-4 py-2 bg-slate-200 text-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ForumCategory;
