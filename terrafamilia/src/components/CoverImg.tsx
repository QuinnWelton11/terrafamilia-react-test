import CoverImage from "../assets/tf-coverimg-1.avif";

function Hero() {
  return (
    <div id="hero-wrapper" className="relative h-64 w-full overflow-hidden">
      {/* Optimized hero image with high priority loading */}
      <img
        src={CoverImage}
        alt="TerraFamilia Community"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        width="1920"
        height="256"
      />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      <h2 className="text-white text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl md:text-2xl z-10">
        Join the Family!
      </h2>
    </div>
  );
}

export default Hero;
