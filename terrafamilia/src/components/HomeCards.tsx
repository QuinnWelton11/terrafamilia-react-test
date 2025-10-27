import { homeCardData } from "../data/homeCardData";
import { Link } from "react-router-dom";

function HomeCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 px-3 my-5 max-w-5xl mx-auto">
      {homeCardData.map((card) => (
        <div
          key={card.id}
          className="bg-slate-100 rounded-2xl shadow-lg p-10 flex flex-col"
        >
          <h1 className="text-2xl font-bold mb-4">{card.title}</h1>
          <p className="text-gray-700 mb-6 flex-grow">{card.message}</p>
          <Link
            to={card.route}
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 text-center"
          >
            {card.buttonText}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default HomeCards;
