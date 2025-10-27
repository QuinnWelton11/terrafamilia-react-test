import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Nav from "../components/Navigation";
import Footer from "../components/Footer";
import SupabaseService, { type Post, type Reply } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

function PostDetail() {
  const { categorySlug, postId } = useParams<{
    categorySlug: string;
    postId: string;
  }>();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Category mapping for breadcrumbs
  const categoryMap: { [key: string]: string } = {
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
    const fetchPostAndReplies = async () => {
      if (!postId) return;

      try {
        // Fetch post details
        const postData = await SupabaseService.getPostById(postId);
        setPost(postData);

        // Fetch replies
        const repliesData = await SupabaseService.getReplies(postId);
        setReplies(repliesData);
      } catch (error) {
        console.error("Failed to fetch post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndReplies();
  }, [postId]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !postId) return;

    setSubmitting(true);
    try {
      await SupabaseService.createReply({
        post_id: postId,
        content: replyContent,
        parent_reply_id: replyingTo || undefined,
      });

      // Refresh replies
      const repliesData = await SupabaseService.getReplies(postId);
      setReplies(repliesData);
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to create reply:", error);
      alert("Failed to create reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderReply = (reply: Reply, depth: number = 0) => {
    const author = (reply.profiles as any)?.username || "Anonymous";

    return (
      <div
        key={reply.id}
        className={`${
          depth > 0 ? "ml-8 mt-4" : "mt-6"
        } bg-slate-50 rounded-lg p-4 border border-slate-200`}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-slate-500">
            <span className="font-medium text-slate-800">{author}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(reply.created_at)}</span>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setReplyingTo(reply.id)}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              Reply
            </button>
          )}
        </div>
        <p className="text-slate-700 whitespace-pre-wrap">{reply.content}</p>

        {/* Reply form for this specific reply */}
        {replyingTo === reply.id && (
          <form onSubmit={handleReplySubmit} className="mt-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Reply to ${author}...`}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={3}
              required
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent("");
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </form>
        )}

        {/* Nested replies */}
        {reply.replies && reply.replies.length > 0 && (
          <div className="mt-2">
            {reply.replies.map((nestedReply) =>
              renderReply(nestedReply, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="grow container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading post...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="grow container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              Post Not Found
            </h1>
            <p className="text-slate-600 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/the-commons"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              ← Back to The Commons
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const postAuthor = (post.profiles as any)?.username || "Anonymous";
  const categoryName = categorySlug
    ? categoryMap[categorySlug] || categorySlug
    : "Forum";

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="grow container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-slate-600">
            <li>
              <Link to="/the-commons" className="hover:text-emerald-600">
                The Commons
              </Link>
            </li>
            <li>→</li>
            <li>
              <Link
                to={`/forum/${categorySlug}`}
                className="hover:text-emerald-600"
              >
                {categoryName}
              </Link>
            </li>
            <li>→</li>
            <li className="text-slate-400">Post</li>
          </ol>
        </nav>

        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 md:p-6 mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 break-words">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-slate-500 mb-6 pb-4 border-b border-slate-200">
            <span className="break-words">
              by{" "}
              <span className="font-medium text-slate-700">{postAuthor}</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="shrink-0">{formatDate(post.created_at)}</span>
            <span className="hidden sm:inline">•</span>
            <span className="shrink-0">{post.view_count} views</span>
            <span className="hidden sm:inline">•</span>
            <span className="shrink-0">{post.reply_count} replies</span>
          </div>

          <div className="prose max-w-none">
            <p className="text-slate-700 whitespace-pre-wrap break-words">
              {post.content}
            </p>
          </div>

          {/* Image Gallery */}
          {post.images && post.images.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {post.images.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxImage(imageUrl)}
                    className="relative group cursor-pointer overflow-hidden rounded-md border border-slate-300 hover:border-emerald-500 transition-colors w-full"
                  >
                    <img
                      src={imageUrl}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
              title="Close"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={lightboxImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Reply Form (Top Level) */}
        {isAuthenticated && !replyingTo && (
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">
              Post a Reply
            </h2>
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                rows={5}
                required
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post Reply"}
                </button>
              </div>
            </form>
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-slate-100 rounded-lg border border-slate-300 p-6 mb-8 text-center">
            <p className="text-slate-600 mb-4">
              Please log in to reply to this post.
            </p>
            <Link
              to="/sso"
              className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Log In
            </Link>
          </div>
        )}

        {/* Replies */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">
            Replies ({replies.length})
          </h2>

          {replies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">
                No replies yet. Be the first to reply!
              </p>
            </div>
          ) : (
            <div>{replies.map((reply) => renderReply(reply))}</div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PostDetail;
