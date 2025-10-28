import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SupabaseService, { type Post, type Reply } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

function PostDetail() {
  const { categorySlug, postId } = useParams<{
    categorySlug: string;
    postId: string;
  }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    fetchPostAndReplies();
  }, [postId]);

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

      // Refresh both post data and replies to get updated reply count
      await fetchPostAndReplies();
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to create reply:", error);
      alert("Failed to create reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPost = () => {
    if (!post) return;
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditingPost(true);
  };

  const handleSaveEdit = async () => {
    if (!postId || !editTitle.trim() || !editContent.trim()) return;

    setSubmitting(true);
    try {
      await SupabaseService.updatePost(postId, {
        title: editTitle,
        content: editContent,
      });
      await fetchPostAndReplies();
      setIsEditingPost(false);
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!postId) return;

    setSubmitting(true);
    try {
      await SupabaseService.deletePost(postId);
      navigate(`/forum/${categorySlug}`);
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setSubmitting(false);
      setShowDeleteConfirm(false);
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
    const authorName = (reply.profiles as any)?.full_name || "Anonymous";
    const authorId = (reply.profiles as any)?.id;
    const authorAvatar = (reply.profiles as any)?.avatar_url;
    const isOwnReply = user && authorId === user.id;

    // Only show full name to the user themselves, otherwise show username
    const displayName = isOwnReply ? authorName : author;

    return (
      <div
        key={reply.id}
        className={`${
          depth > 0 ? "ml-4 sm:ml-8 mt-4" : "mt-6"
        } bg-slate-50 rounded-lg p-4 border border-slate-200`}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
          {/* Author Info with Avatar */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={isOwnReply ? "/profile" : `/user/${authorId}`}
              className="shrink-0"
            >
              <img
                src={
                  authorAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    displayName
                  )}&background=10b981&color=fff&bold=true&size=64`
                }
                alt={displayName}
                className="w-10 h-10 rounded-full border-2 border-cyan-400 hover:border-cyan-500 transition-colors"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                to={isOwnReply ? "/profile" : `/user/${authorId}`}
                className="block hover:text-cyan-600 transition-colors"
              >
                <span className="font-medium text-slate-800">
                  {displayName}
                </span>
                {!isOwnReply && (
                  <span className="text-slate-500 text-sm"> (@{author})</span>
                )}
              </Link>
              <span className="text-xs sm:text-sm text-slate-500">
                {formatDate(reply.created_at)}
              </span>
            </div>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setReplyingTo(reply.id)}
              className="shrink-0 text-cyan-600 hover:text-cyan-700 text-sm font-medium self-start sm:self-auto"
            >
              Reply
            </button>
          )}
        </div>
        <p className="text-slate-700 whitespace-pre-wrap wrap-break-word">
          {reply.content}
        </p>

        {/* Reply form for this specific reply */}
        {replyingTo === reply.id && (
          <form onSubmit={handleReplySubmit} className="mt-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Reply to ${author}...`}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
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
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50"
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 text-lg">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
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
              className="text-cyan-600 hover:text-cyan-700 font-medium"
            >
              ← Back to The Commons
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const postAuthor = (post.profiles as any)?.username || "Anonymous";
  const postAuthorName = (post.profiles as any)?.full_name || "Anonymous";
  const postAuthorId = (post.profiles as any)?.id;
  const postAuthorAvatar = (post.profiles as any)?.avatar_url;
  const isOwnPost = user && postAuthorId === user.id;

  // Only show full name to the user themselves, otherwise show username
  const postDisplayName = isOwnPost ? postAuthorName : postAuthor;

  const categoryName = categorySlug
    ? categoryMap[categorySlug] || categorySlug
    : "Forum";

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
            <li>→</li>
            <li>
              <Link
                to={`/forum/${categorySlug}`}
                className="hover:text-cyan-600"
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
          {isEditingPost ? (
            // Edit Mode
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 mb-4 text-xl md:text-3xl font-bold border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Post title"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 mb-4 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                rows={10}
                placeholder="Post content"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveEdit}
                  disabled={
                    submitting || !editTitle.trim() || !editContent.trim()
                  }
                  className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setIsEditingPost(false)}
                  disabled={submitting}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-xl md:text-3xl font-bold text-slate-800 wrap-break-word flex-1">
                  {post.title}
                </h1>
                {isOwnPost && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleEditPost}
                      className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                      title="Edit post"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      title="Delete post"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 mb-6 border-b border-slate-200">
                {/* Author Avatar */}
                <Link
                  to={isOwnPost ? "/profile" : `/user/${postAuthorId}`}
                  className="shrink-0"
                >
                  <img
                    src={
                      postAuthorAvatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        postDisplayName
                      )}&background=10b981&color=fff&bold=true&size=80`
                    }
                    alt={postDisplayName}
                    className="w-12 h-12 rounded-full border-2 border-cyan-400 hover:border-cyan-500 transition-colors"
                  />
                </Link>

                {/* Post Metadata */}
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <Link
                    to={isOwnPost ? "/profile" : `/user/${post.profiles?.id}`}
                    className="text-sm hover:text-cyan-600 transition-colors"
                  >
                    <span className="font-medium text-slate-700">
                      {postDisplayName}
                    </span>
                    {!isOwnPost && (
                      <span className="text-slate-500"> (@{postAuthor})</span>
                    )}
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-slate-500">
                    <span className="shrink-0">
                      {formatDate(post.created_at)}
                    </span>
                    <span className="shrink-0">•</span>
                    <span className="shrink-0">{post.view_count} views</span>
                    <span className="shrink-0">•</span>
                    <span className="shrink-0">{post.reply_count} replies</span>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-slate-700 whitespace-pre-wrap wrap-break-word">
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
                        className="relative group cursor-pointer overflow-hidden rounded-md border border-slate-300 hover:border-cyan-500 transition-colors w-full"
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
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Delete Post?
              </h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this post? This action cannot be
                undone and will also delete all replies to this post.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={submitting}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Deleting..." : "Delete Post"}
                </button>
              </div>
            </div>
          </div>
        )}

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
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                rows={5}
                required
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50"
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
              className="inline-block px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
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
    </div>
  );
}

export default PostDetail;
