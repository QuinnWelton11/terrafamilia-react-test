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
  views: number;
}

interface Reply {
  id: number;
  content: string;
  author: string;
  created_at: string;
  parent_reply_id?: number;
  replies?: Reply[];
}

function PostDetail() {
  const { categorySlug, postId } = useParams<{
    categorySlug: string;
    postId: string;
  }>();
  const { isAuthenticated, user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
        // Fetch post details (you might need to create this endpoint)
        const postResponse = await ApiService.getPosts({
          post_id: parseInt(postId),
        });
        if (postResponse.success && postResponse.posts?.length > 0) {
          setPost(postResponse.posts[0]);
        }

        // Fetch replies
        const repliesResponse = await ApiService.getReplies(parseInt(postId));
        if (repliesResponse.success) {
          setReplies(organizeReplies(repliesResponse.replies || []));
        }
      } catch (error) {
        console.error("Failed to fetch post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndReplies();
  }, [postId]);

  // Organize replies into nested structure
  const organizeReplies = (flatReplies: Reply[]): Reply[] => {
    const replyMap = new Map<number, Reply>();
    const rootReplies: Reply[] = [];

    // First pass: create map of all replies
    flatReplies.forEach((reply) => {
      replyMap.set(reply.id, { ...reply, replies: [] });
    });

    // Second pass: organize into tree structure
    flatReplies.forEach((reply) => {
      const replyWithChildren = replyMap.get(reply.id)!;
      if (reply.parent_reply_id) {
        const parent = replyMap.get(reply.parent_reply_id);
        if (parent) {
          parent.replies!.push(replyWithChildren);
        } else {
          rootReplies.push(replyWithChildren);
        }
      } else {
        rootReplies.push(replyWithChildren);
      }
    });

    return rootReplies;
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !postId) return;

    setSubmitting(true);
    try {
      const response = await ApiService.createReply({
        post_id: parseInt(postId),
        content: replyContent,
        parent_reply_id: replyingTo || undefined,
      });

      if (response.success) {
        // Refresh replies
        const repliesResponse = await ApiService.getReplies(parseInt(postId));
        if (repliesResponse.success) {
          setReplies(organizeReplies(repliesResponse.replies || []));
        }
        setReplyContent("");
        setReplyingTo(null);
      } else {
        console.error("Reply failed:", response.message);
        alert(
          "Failed to create reply: " + (response.message || "Unknown error")
        );
      }
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

  const renderReply = (reply: Reply, depth = 0) => (
    <div key={reply.id} className={`${depth > 0 ? "ml-8 mt-4" : "mt-6"}`}>
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex justify-between items-start mb-3">
          <div className="text-sm text-slate-600">
            <span className="font-medium text-slate-800">{reply.author}</span>
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
              placeholder={`Reply to ${reply.author}...`}
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
      </div>

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-grow container mx-auto px-6 py-8">
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
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              Post Not Found
            </h1>
            <p className="text-slate-600 mb-6">
              The post you're looking for doesn't exist.
            </p>
            <Link
              to="/the-commons"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Back to Forum
            </Link>
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
            <li>
              <Link
                to={`/forum/${categorySlug}`}
                className="hover:text-emerald-600"
              >
                {categoryMap[categorySlug || ""] || categorySlug}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-800 font-medium truncate max-w-xs">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-slate-800 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6">
            <span>by {post.author}</span>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
            <span>•</span>
            <span>{post.views} views</span>
          </div>

          <div className="prose max-w-none">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>
        </div>

        {/* Reply Form */}
        {isAuthenticated ? (
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">
              Reply to this post
            </h2>
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                rows={4}
                required
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-colors duration-300"
                >
                  {submitting ? "Posting..." : "Post Reply"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 mb-8 text-center">
            <p className="text-slate-600 mb-4">
              You must be logged in to reply to this post.
            </p>
            <Link
              to="/sso"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Login to Reply
            </Link>
          </div>
        )}

        {/* Replies Section */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">
            Replies ({replies.length})
          </h2>

          {replies.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No replies yet. Be the first to reply!
            </p>
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
