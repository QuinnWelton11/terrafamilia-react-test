import Cover from "../components/CoverImg";
import ScrollAnimation from "../components/ScrollAnimation";
import StaggeredList from "../components/StaggeredList";

function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Cover />

      {/* Main content area - you can add AboutUs content here */}
      <div className="grow">
        <div className="space-y-15 md:space-y-20 lg:space-y-15">
          <section
            id="about-intro"
            className="bg-slate-500 text-slate-50 text-shadow-md px-6 py-10 shadow-md"
          >
            <div className="max-w-4xl mx-auto">
              <ScrollAnimation animation="slideUp" duration={1000}>
                <h1 className="text-2xl md:text-3xl font-bold  mb-4">
                  About Terrafamilia
                </h1>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeIn" duration={800} delay={500}>
                <p className="text-base md:text-lg mx-auto">
                  Welcome to TerraFamilia — a shared space for unity, exchange,
                  and growth. Here, we believe in the power of people coming
                  together — not just to trade goods, but to share knowledge,
                  ideas, and compassion. TerraFamilia is built on the foundation
                  that every person, everywhere, is part of one global family.
                </p>
              </ScrollAnimation>
            </div>
          </section>

          <ScrollAnimation animation="slideRight" duration={800}>
            <section id="about-goal" className="px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-4">
                  Our Goal
                </h2>
                <p className="text-base md:text-lg mx-auto">
                  To create an open and inclusive digital commons where
                  individuals can connect, trade, barter, and learn from one
                  another in a spirit of mutual respect and cooperation.
                  TerraFamilia is more than a platform — it's a living community
                  grounded in honesty, trust, and collective well-being.
                </p>
              </div>
            </section>
          </ScrollAnimation>

          <ScrollAnimation animation="fadeIn" duration={1000}>
            <section
              id="about-values"
              className="px-6 [&_em]:mr-1 [&_em]:text-cyan-200 text-shadow-md [&_h2]:text-slate-50 [&_li]:text-slate-50 bg-slate-500 py-10 shadow-md"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  Our Values
                </h2>
                <ul className="space-y-4 md:text-lg mx-auto">
                  <StaggeredList
                    animation="bounceUp"
                    delay={500}
                    className="space-y-4 md:text-lg mx-auto"
                  >
                    <li>
                      <em>Honesty and Respect:</em> Every interaction should be
                      rooted in truth and empathy.
                    </li>
                    <li>
                      <em>Privacy and Integrity:</em> Your data is yours. We do
                      not sell, share, or exploit your personal information —
                      ever. Any data collected is used solely to keep the site
                      functioning smoothly and securely.
                    </li>
                    <li>
                      <em>Inclusivity and Safety:</em> We welcome everyone,
                      regardless of background, belief, or identity. Hate
                      speech, harassment, and discrimination have no place here.
                    </li>
                    <li>
                      <em>Community and Growth:</em> We encourage meaningful
                      exchange — of ideas, goods, and support — that helps
                      individuals and communities thrive together.
                    </li>
                  </StaggeredList>
                </ul>
              </div>
            </section>
          </ScrollAnimation>

          <ScrollAnimation animation="slideUp" duration={800}>
            <section id="about-promise" className="px-6 mb-20">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-4">
                  Our Belief
                </h2>
                <p className="text-base md:text-lg mx-auto">
                  TerraFamilia is designed to be a safe haven for open dialogue
                  and collaboration, free from invasive tracking and corporate
                  interference. We believe in technology that serves people, not
                  the other way around. Our goal is to nurture a digital
                  environment where every visitor feels valued, heard, and
                  empowered.
                </p>
              </div>
            </section>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
