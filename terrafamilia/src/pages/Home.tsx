import Nav from "../components/Navigation";
import Cover from "../components/CoverImg";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <section id="hero">
        <Nav />
        <Cover />
      </section>
      <section className="flex-grow">
        <h2 className="text-slate-800 text-center text-3xl font-bold py-8">
          Terrafamilia!
        </h2>
        <div className="flex flex-col gap-10 px-10 mt-10 pb-10 md:flex-row">
          <div className="space-y-4 bg-white/90 p-6 rounded-lg border border-slate-200">
            <h3 className="text-2xl text-center text-slate-800">Welcome</h3>
            <p className="text-slate-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              rutrum dolor vitae vulputate commodo. Etiam a mi purus. Phasellus
              fringilla dignissim fermentum. Aenean ut sapien dignissim,
              imperdiet elit vel, iaculis orci. Nam vehicula, leo id iaculis
              egestas, ipsum metus facilisis ipsum, a faucibus elit diam ac
              ligula. Proin pretium scelerisque tortor, tincidunt tempor eros.
              Morbi tempus placerat eleifend. In vulputate lacinia eros ac
              dignissim. Nam tempor efficitur elit sit amet porta. Curabitur id
              libero luctus, faucibus mauris id, vulputate ipsum.
            </p>
            <div className="text-center">
              <Link
                to="/"
                className="inline-block bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="space-y-4 bg-emerald-50/90 p-6 rounded-lg border border-emerald-200">
            <h3 className="text-2xl text-center text-emerald-800">
              The Commons
            </h3>
            <p className="text-emerald-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              rutrum dolor vitae vulputate commodo. Etiam a mi purus. Phasellus
              fringilla dignissim fermentum. Aenean ut sapien dignissim,
              imperdiet elit vel, iaculis orci. Nam vehicula, leo id iaculis
              egestas, ipsum metus facilisis ipsum, a faucibus elit diam ac
              ligula. Proin pretium scelerisque tortor, tincidunt tempor eros.
              Morbi tempus placerat eleifend. In vulputate lacinia eros ac
              dignissim. Nam tempor efficitur elit sit amet porta. Curabitur id
              libero luctus, faucibus mauris id, vulputate ipsum.
            </p>
            <div className="text-center">
              <Link
                to="/the-commons"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Visit Commons
              </Link>
            </div>
          </div>
          <div className="space-y-4 bg-blue-50/90 p-6 rounded-lg border border-blue-200">
            <h3 className="text-2xl text-center text-blue-800">About</h3>
            <p className="text-blue-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              rutrum dolor vitae vulputate commodo. Etiam a mi purus. Phasellus
              fringilla dignissim fermentum. Aenean ut sapien dignissim,
              imperdiet elit vel, iaculis orci. Nam vehicula, leo id iaculis
              egestas, ipsum metus facilisis ipsum, a faucibus elit diam ac
              ligula. Proin pretium scelerisque tortor, tincidunt tempor eros.
              Morbi tempus placerat eleifend. In vulputate lacinia eros ac
              dignissim. Nam tempor efficitur elit sit amet porta. Curabitur id
              libero luctus, faucibus mauris id, vulputate ipsum.
            </p>
            <div className="text-center">
              <Link
                to="/about-us"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
