import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Nav from "../components/Navigation";
import Footer from "../components/Footer";
import ApiService from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface CategoryOption {
  value: string;
  label: string;
  id: number;
}

function CreatePost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sso");
    }
  }, [isAuthenticated, navigate]);

  // Set initial category from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Available categories
  const categories: CategoryOption[] = [
    { value: "trading-barter", label: "Trading & Barter", id: 1 },
    { value: "item-skill-exchange", label: "Item & Skill Exchange", id: 2 },
    { value: "community-projects", label: "Community Projects", id: 2 },
    { value: "free-giveaways", label: "Free Stuff / Giveaways", id: 4 },
    { value: "knowledge-exchange", label: "Knowledge Exchange", id: 2 },
    { value: "ask-answer", label: "Ask & Answer", id: 2 },
    { value: "guides-tutorials", label: "Guides & Tutorials", id: 2 },
    { value: "local-resources", label: "Local Resources", id: 2 },
    { value: "community-life", label: "Community Life", id: 3 },
    { value: "introductions", label: "Introductions", id: 3 },
    { value: "events-meetups", label: "Events & Meetups", id: 3 },
    { value: "general-discussion", label: "General Discussion", id: 3 },
    { value: "commons-hub", label: "The Commons Hub", id: 4 },
    { value: "announcements", label: "Announcements", id: 4 },
    { value: "feedback-suggestions", label: "Feedback & Suggestions", id: 4 },
    { value: "help-support", label: "Help & Support", id: 4 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !selectedCategory) {
      setMessage({
        type: "error",
        text: "Please fill in all fields",
      });
      return;
    }

    const categoryInfo = categories.find(
      (cat) => cat.value === selectedCategory
    );
    if (!categoryInfo) {
      setMessage({
        type: "error",
        text: "Please select a valid category",
      });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await ApiService.createPost({
        title: title.trim(),
        content: content.trim(),
        category_id: categoryInfo.id,
      });

      if (response.success) {
        setMessage({
          type: "success",
          text: "Post created successfully! Redirecting...",
        });

        // Redirect to the forum category after successful creation
        setTimeout(() => {
          navigate(`/forum/${selectedCategory}`);
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to create post",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while creating your post",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Redirecting to login...</p>
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
            <li className="text-slate-800 font-medium">Create New Post</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-slate-800 mb-2">
            Create a New Post
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            Share your thoughts, questions, or ideas with the community
          </p>
        </div>

        {/* Create Post Form */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Category Selection */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Post Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your post"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                maxLength={200}
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                {title.length}/200 characters
              </p>
            </div>

            {/* Post Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows={12}
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                {content.length} characters
              </p>
            </div>

            {/* Preview Section */}
            {(title || content) && (
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-3">
                  Preview
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
                  {title && (
                    <h4 className="text-xl font-semibold text-slate-800 mb-2">
                      {title}
                    </h4>
                  )}
                  {selectedCategory && (
                    <div className="text-sm text-slate-500 mb-3">
                      Category:{" "}
                      {
                        categories.find((cat) => cat.value === selectedCategory)
                          ?.label
                      }
                    </div>
                  )}
                  {content && (
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {content}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <Link
                to="/the-commons"
                className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </Link>

              <div className="space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setContent("");
                    setSelectedCategory("");
                    setMessage(null);
                  }}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !title.trim() ||
                    !content.trim() ||
                    !selectedCategory
                  }
                  className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {submitting ? "Creating Post..." : "Create Post"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CreatePost;
