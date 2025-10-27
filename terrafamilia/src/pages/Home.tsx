import Cover from "../components/CoverImg";

import ScrollAnimation from "../components/ScrollAnimation";
import HomeCards from "../components/HomeCards";
import StaggeredList from "../components/StaggeredList";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <section id="hero">
        <Cover />
      </section>
      <section
        id="intro"
        className="bg-slate-500 text-white text-shadow-lg py-5"
      >
        <ScrollAnimation animation="fadeIn" duration={800} delay={300}>
          <h1 className="text-center text-xl">Welcome to TerraFamilia!</h1>
        </ScrollAnimation>
      </section>

      <section className="grow flex items-center justify-center">
        <StaggeredList delay={500}>
          <HomeCards />
        </StaggeredList>
      </section>
    </div>
  );
}

export default Home;
