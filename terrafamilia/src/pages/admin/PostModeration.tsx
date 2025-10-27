import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabaseService from "../../services/supabase";
import { Trash2, MessageSquare, User, Calendar } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  category: {
    name: string;
    slug: string;
  } | null;
  created_at: string;
  author: {
    username: string;
    full_name: string;
  };
  reply_count: number;
}

function PostModeration() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseService["getSupabaseClient"]()
        .from("posts")
        .select(
          `
          *,
          author:user_id (username, full_name),
          category:category_id (name, slug),
          replies:replies(count)
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (error) throw error;

      const formatted = data?.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        created_at: post.created_at,
        author: post.author,
        reply_count: post.replies?.[0]?.count || 0,
      }));

      setPosts(formatted || []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string, title: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the post "${title}"? This action cannot be undone.`
      )
    )
      return;

    const reason = prompt("Enter deletion reason for audit log:");
    if (!reason) return;

    setActionLoading(postId);
    try {
      await supabaseService.deletePostAsAdmin(postId, reason);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      alert(`Error deleting post: ${(error as Error).message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (
    category: { name: string; slug: string } | null
  ) => {
    if (!category) return "bg-slate-100 text-slate-800";

    const colors: Record<string, string> = {
      general: "bg-blue-100 text-blue-800",
      trading: "bg-emerald-100 text-emerald-800",
      market: "bg-purple-100 text-purple-800",
      support: "bg-orange-100 text-orange-800",
    };
    return colors[category.slug] || "bg-slate-100 text-slate-800";
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Title & Category */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <Link
                    to={`/forum/${post.category?.slug || "general"}/${post.id}`}
                    className="text-lg md:text-xl font-bold text-slate-800 hover:text-emerald-600 transition-colors wrap-break-word"
                  >
                    {post.title}
                  </Link>
                  {post.category && (
                    <span
                      className={`shrink-0 self-start sm:self-auto px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                        post.category
                      )}`}
                    >
                      {post.category.name}
                    </span>
                  )}
                </div>

                {/* Content Preview */}
                <p className="text-slate-600 mb-3 line-clamp-2 wrap-break-word">
                  {post.content}
                </p>

                {/* Meta Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <User size={16} className="shrink-0" />
                    <span className="truncate">
                      {post.author.full_name} (@{post.author.username})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Calendar size={16} />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <MessageSquare size={16} />
                    <span>{post.reply_count} replies</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0 self-start lg:self-auto">
                <button
                  onClick={() => handleDeletePost(post.id, post.title)}
                  disabled={actionLoading === post.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete post"
                >
                  {actionLoading === post.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MessageSquare className="mx-auto mb-4 text-slate-300" size={64} />
          <p className="text-slate-600 text-lg">No posts found</p>
        </div>
      )}

      {/* Pagination */}
      {posts.length > 0 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-white border border-slate-300 rounded-lg">
            Page {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={posts.length < pageSize}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PostModeration;
