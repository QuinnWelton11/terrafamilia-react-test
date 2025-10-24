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
        <h2 className="text-slate-800 text-center text-xl md:text-3xl font-bold py-8">
          Terrafamilia!
        </h2>
        <div className="flex flex-col gap-10 px-10 mt-10 pb-10 md:flex-row md:items-stretch">
          <div className="flex flex-col bg-white/90 p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg md:text-2xl text-center text-slate-800 mb-4">
              About Us
            </h3>
            <p className="text-sm md:text-base text-slate-700 flex-grow">
              Welcome to TerraFamilia — a shared space for unity, exchange, and
              growth. Here, we believe in the power of people coming together —
              not just to trade goods, but to share knowledge, ideas, and
              compassion. TerraFamilia is built on the foundation that every
              person, everywhere, is part of one global family.
            </p>
            <div className="text-center mt-6">
              <Link
                to="/about-us"
                className="inline-block bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="flex flex-col bg-white/90 p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg md:text-2xl text-center text-slate-800 mb-4">
              The Commons
            </h3>
            <p className="text-sm md:text-base text-slate-700 flex-grow">
              The Commons is the living heart of TerraFamilia — a place where
              people come together to trade, share knowledge, and build
              meaningful connections. It’s a space for open exchange grounded in
              respect, honesty, and inclusivity. Whether you’re here to barter,
              collaborate, or simply connect, The Commons invites you to be part
              of a community that values people over profit and unity over
              division.
            </p>
            <div className="text-center mt-6">
              <Link
                to="/the-commons"
                className="inline-block bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Visit Commons
              </Link>
            </div>
          </div>
          <div className="flex flex-col bg-white/90 p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg md:text-2xl text-center text-slate-800 mb-4">
              Sign Up Today!
            </h3>
            <p className="text-sm md:text-base text-slate-700 flex-grow">
              Becoming a member of TerraFamilia opens the door to The Commons —
              where you can post, trade, share ideas, and connect with others
              who value honesty, respect, and collaboration. Registration is
              free and your privacy is always protected. Join us in growing a
              space rooted in unity, trust, and genuine connection.
            </p>
            <div className="text-center mt-6">
              <Link
                to="/sso"
                className="inline-block bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Registration
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
