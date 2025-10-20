import Nav from "../components/Navigation";
import Cover from "../components/CoverImg";
import Footer from "../components/Footer";

function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <Cover />

      {/* Main content area - you can add AboutUs content here */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">About Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Coming soon! This page will contain information about TerraMamilia
            and our community mission.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;
