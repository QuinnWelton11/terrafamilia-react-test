import { homeCardData } from "../data/homeCardData";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import supabaseService from "../services/supabase";

function HomeCards() {
  const [topContributor, setTopContributor] = useState<{
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string | null;
    postCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopContributor();
  }, []);

  const loadTopContributor = async () => {
    try {
      const contributor = await supabaseService.getTopContributor();
      setTopContributor(contributor);
    } catch (error) {
      console.error("Failed to load top contributor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 px-3 my-5 max-w-7xl mx-auto">
      {homeCardData.map((card) => {
        const Icon = card.icon;

        // Handle dynamic Top Contributor card
        if (card.isDynamic && topContributor) {
          return (
            <div
              key={card.id}
              className="bg-gradient-to-br from-emerald-50 to-slate-100 rounded-2xl shadow-lg p-10 flex flex-col border-2 border-emerald-200"
            >
              <h1 className="text-2xl font-bold mb-4 text-emerald-700">
                {card.title}
              </h1>
              <div className="flex flex-col items-center mb-4">
                <img
                  src={
                    topContributor.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      topContributor.fullName
                    )}&background=10b981&color=fff&bold=true`
                  }
                  alt={topContributor.fullName}
                  loading="lazy"
                  className="w-20 h-20 rounded-full border-4 border-emerald-400 mb-3"
                />
                <h3 className="text-xl font-bold text-slate-800">
                  {topContributor.fullName}
                </h3>
                <p className="text-sm text-slate-600">
                  @{topContributor.username}
                </p>
                <div className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-semibold">
                  🏆 {topContributor.postCount} Posts
                </div>
              </div>
              <p className="text-slate-600 mb-6 flex-grow text-center">
                Celebrating our most active community member this week!
              </p>
              <Link
                to={`/user/${topContributor.id}`}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-1 px-6 rounded-lg transition-colors duration-300 text-center flex items-center justify-center gap-2"
              >
                <Icon size={20} />
                {card.buttonText}
              </Link>
            </div>
          );
        }

        // Show loading state for dynamic card
        if (card.isDynamic && loading) {
          return (
            <div
              key={card.id}
              className="bg-gradient-to-br from-emerald-50 to-slate-100 rounded-2xl shadow-lg p-10 flex flex-col border-2 border-emerald-200 animate-pulse"
            >
              <div className="h-8 bg-emerald-200 rounded mb-4"></div>
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full bg-emerald-300 mb-3"></div>
                <div className="h-6 w-32 bg-slate-300 rounded mb-2"></div>
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
              </div>
              <div className="h-16 bg-slate-200 rounded mb-6"></div>
              <div className="h-10 bg-emerald-300 rounded"></div>
            </div>
          );
        }

        // Regular cards
        return (
          <div
            key={card.id}
            className="bg-slate-100 rounded-2xl shadow-lg p-10 flex flex-col"
          >
            <h1 className="text-2xl font-bold mb-4">{card.title}</h1>
            <p className="text-gray-700 mb-6 flex-grow">{card.message}</p>
            <Link
              to={card.route}
              className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-1 px-6 rounded-lg transition-colors duration-300 text-center flex items-center justify-center gap-2"
            >
              <Icon size={20} />
              {card.buttonText}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default HomeCards;
