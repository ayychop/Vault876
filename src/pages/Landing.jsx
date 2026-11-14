import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Services from '../components/Services.jsx'
import Contact from '../components/Contact.jsx'
import Gallery from '../components/Gallery.jsx'
import Testimonials from '../components/Testimonials.jsx'
import GoodToKnow from '../components/GoodToKnow.jsx'
import Footer from '../components/Footer.jsx'
import Reveal from '../components/Reveal.jsx'

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Reveal>
          <Services />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
        <Reveal>
          <Gallery />
        </Reveal>
        <Reveal>
          <Testimonials />
        </Reveal>
        <Reveal>
          <GoodToKnow />
        </Reveal>
      </main>
      <Footer />
      {/* Clears the mobile sticky Book Now bar so it never covers the footer. */}
      <div className="h-20 md:hidden" aria-hidden />
    </>
  )
}
