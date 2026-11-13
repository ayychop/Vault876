import { Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Landing from './pages/Landing.jsx'
import Booking from './pages/Booking.jsx'
import EntryGate from './components/EntryGate.jsx'

export default function App() {
  return (
    // Respect the visitor's reduced-motion preference across every animation.
    <MotionConfig reducedMotion="user">
      {/* First-visit splash — self-gates on sessionStorage */}
      <EntryGate />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </MotionConfig>
  )
}
