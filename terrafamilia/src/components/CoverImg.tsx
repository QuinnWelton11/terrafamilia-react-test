import CoverImage from "../assets/tf-coverimg-1.webp";

function Hero() {
  return (
    <div
      id="hero-wrapper"
      className="relative h-64 w-full bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${CoverImage})` }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      <h2 className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl md:text-2xl z-10">
        One Family One Love
      </h2>
    </div>
  );
}

export default Hero;
