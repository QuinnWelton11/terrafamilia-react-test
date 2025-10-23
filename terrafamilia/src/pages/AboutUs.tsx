import Nav from "../components/Navigation";
import Cover from "../components/CoverImg";
import Footer from "../components/Footer";

function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Nav />
      <Cover />

      {/* Main content area - you can add AboutUs content here */}
      <main className="flex-grow container mx-auto px-6 py-8 max-w-4xl">
        <div className="space-y-10">
          <section id="about-intro">
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">
              About Terrafamilia
            </h1>
            <p className="text-base md:text-lg text-slate-800 mx-auto">
              Welcome to TerraFamilia — a shared space for unity, exchange, and
              growth. Here, we believe in the power of people coming together —
              not just to trade goods, but to share knowledge, ideas, and
              compassion. TerraFamilia is built on the foundation that every
              person, everywhere, is part of one global family.
            </p>
          </section>

          <section id="about-goal">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
              Our Goal
            </h2>
            <p>
              To create an open and inclusive digital commons where individuals
              can connect, trade, barter, and learn from one another in a spirit
              of mutual respect and cooperation. TerraFamilia is more than a
              platform — it's a living community grounded in honesty, trust, and
              collective well-being.
            </p>
          </section>

          <section id="about-values">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
              Our Values
            </h2>
            <ul>
              <li>
                <em>Honesty and Respect:</em> Every interaction should be rooted
                in truth and empathy.
              </li>
              <li>
                <em>Privacy and Integrity:</em> Your data is yours. We do not
                sell, share, or exploit your personal information — ever. Any
                data collected is used solely to keep the site functioning
                smoothly and securely.
              </li>
              <li>
                <em>Inclusivity and Safety:</em> We welcome everyone, regardless
                of background, belief, or identity. Hate speech, harassment, and
                discrimination have no place here.
              </li>
              <li>
                <em>Community and Growth:</em> We encourage meaningful exchange
                — of ideas, goods, and support — that helps individuals and
                communities thrive together.
              </li>
            </ul>
          </section>

          <section id="about-promise">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
              Our Promise
            </h2>
            <p>
              TerraFamilia is designed to be a safe haven for open dialogue and
              collaboration, free from invasive tracking and corporate
              interference. We believe in technology that serves people, not the
              other way around. Our goal is to nurture a digital environment
              where every visitor feels valued, heard, and empowered.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;
