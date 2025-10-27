import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Nav from "../components/Navigation";
import Footer from "../components/Footer";
import SupabaseService from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

function CreatePost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

  // Category hierarchy mapping
  const categoryHierarchy: { [key: string]: string[] } = {
    "trading-barter": [
      "item-skill-exchange",
      "community-projects",
      "free-giveaways",
    ],
    "knowledge-exchange": ["ask-answer", "guides-tutorials", "local-resources"],
    "community-life": ["introductions", "events-meetups", "general-discussion"],
    "commons-hub": ["announcements", "feedback-suggestions", "help-support"],
  };

  // Set initial category from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      // If it's a parent category, don't pre-select (users must choose a child)
      const isParentCategory = categoryHierarchy[categoryParam];
      if (!isParentCategory) {
        setSelectedCategory(categoryParam);
      }
    }
  }, [searchParams]);

  // All categories with their parent info
  const allCategories = [
    // Trading & Barter children
    {
      value: "item-skill-exchange",
      label: "Item & Skill Exchange",
      parent: "trading-barter",
    },
    {
      value: "community-projects",
      label: "Community Projects",
      parent: "trading-barter",
    },
    {
      value: "free-giveaways",
      label: "Free Stuff / Giveaways",
      parent: "trading-barter",
    },
    // Knowledge Exchange children
    {
      value: "ask-answer",
      label: "Ask & Answer",
      parent: "knowledge-exchange",
    },
    {
      value: "guides-tutorials",
      label: "Guides & Tutorials",
      parent: "knowledge-exchange",
    },
    {
      value: "local-resources",
      label: "Local Resources",
      parent: "knowledge-exchange",
    },
    // Community Life children
    {
      value: "introductions",
      label: "Introductions",
      parent: "community-life",
    },
    {
      value: "events-meetups",
      label: "Events & Meetups",
      parent: "community-life",
    },
    {
      value: "general-discussion",
      label: "General Discussion",
      parent: "community-life",
    },
    // Commons Hub children
    { value: "announcements", label: "Announcements", parent: "commons-hub" },
    {
      value: "feedback-suggestions",
      label: "Feedback & Suggestions",
      parent: "commons-hub",
    },
    {
      value: "help-support",
      label: "Help & Support",
      parent: "commons-hub",
    },
  ];

  // Determine which categories to show
  const getAvailableCategories = () => {
    const categoryParam = searchParams.get("category");

    // If coming from a parent category, show only its children
    if (categoryParam && categoryHierarchy[categoryParam]) {
      return allCategories.filter((cat) =>
        categoryHierarchy[categoryParam].includes(cat.value)
      );
    }

    // If coming from a child category or no category, show all
    return allCategories;
  };

  const categories = getAvailableCategories();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file count (max 3)
    if (files.length + selectedFiles.length > 3) {
      setMessage({
        type: "error",
        text: "Maximum 3 images allowed per post",
      });
      return;
    }

    // Validate each file
    for (const file of files) {
      // Check file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: `${file.name} exceeds 100MB limit`,
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setMessage({
          type: "error",
          text: `${file.name} is not an image file`,
        });
        return;
      }
    }

    // Add files and create previews
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);

    // Clear error message if validation passed
    if (message?.type === "error") {
      setMessage(null);
    }
  };

  const removeImage = (index: number) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);

    // Remove from both arrays
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !selectedCategory) {
      setMessage({
        type: "error",
        text: "Please fill in all fields",
      });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      // Get category by slug to get the ID
      const category = await SupabaseService.getCategoryBySlug(
        selectedCategory
      );

      // Upload images if any
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        imageUrls = await SupabaseService.uploadPostImages(selectedFiles);
      }

      // Create the post
      const post = await SupabaseService.createPost({
        title: title.trim(),
        content: content.trim(),
        category_id: category.id,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      });

      setMessage({
        type: "success",
        text: "Post created successfully! Redirecting...",
      });

      // Clean up preview URLs
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));

      // Redirect to the new post
      setTimeout(() => {
        navigate(`/forum/${selectedCategory}/${post.id}`);
      }, 1500);
    } catch (error) {
      console.error("Failed to create post:", error);
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
        <main className="grow container mx-auto px-6 py-8">
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

      <main className="grow container mx-auto px-6 py-8">
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Images (Optional)
              </label>
              <div className="space-y-3">
                {/* File Input */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    disabled={selectedFiles.length >= 3}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Max 3 images, 100MB each. Accepted formats: JPG, PNG, GIF,
                    WebP
                  </p>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md border border-slate-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Remove image"
                        >
                          <svg
                            className="w-4 h-4"
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
                        <div className="text-xs text-slate-500 mt-1 truncate">
                          {selectedFiles[index]?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
