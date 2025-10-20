import Nav from "../components/Navigation";
import { Link } from "react-router-dom";
import Cover from "../components/CoverImg";
import Footer from "../components/Footer";

function TheCommons() {
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
      <div className="container mx-auto px-6 py-8 flex-grow">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            The Commons
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Welcome to our community forum! Connect, share, and collaborate with
            fellow members.
          </p>
        </div>

        {/* User Actions */}
        <div className="flex justify-center gap-4 mb-8">
          <Link
            to="/sso"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Register
          </Link>
          <Link
            to="/sso"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Login
          </Link>
          <button className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">
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
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                {category.name}
              </h2>
              <p className="text-slate-600 mb-4">{category.description}</p>

              {/* Subcategories */}
              <div className="space-y-2">
                {category.subcategories.map((sub) => (
                  <div
                    key={sub.slug}
                    className="block p-3 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors duration-200 cursor-pointer"
                    onClick={() =>
                      alert(
                        `${sub.name} forum coming soon! Complete the backend setup first.`
                      )
                    }
                  >
                    <span className="text-emerald-600 hover:text-emerald-700 font-medium">
                      {sub.name}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      (Coming Soon)
                    </span>
                  </div>
                ))}
              </div>

              {/* View All Link */}
              <button
                onClick={() =>
                  alert(
                    `${category.name} forum coming soon! Complete the backend setup first.`
                  )
                }
                className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
              >
                View all in {category.name} →
              </button>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Recent Activity
          </h2>
          <div className="bg-white/95 rounded-lg shadow-md border border-slate-200 p-6">
            <p className="text-slate-500 text-center py-8">
              Recent posts and activity will appear here once the backend is
              implemented.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TheCommons;
