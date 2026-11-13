import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Services from '../components/Services.jsx'
import Promise from '../components/Promise.jsx'
import Footer from '../components/Footer.jsx'

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Promise />
      </main>
      <Footer />
    </>
  )
}
