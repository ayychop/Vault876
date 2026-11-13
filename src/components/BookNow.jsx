import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

// Persistent mobile "Book Now" affordance: a full-width gold bar pinned to the
// bottom of the viewport, everywhere except the booking flow itself (which
// carries its own sticky price bar). On desktop the fixed navbar already holds a
// persistent Book Now, so no floating duplicate is needed here.
export default function BookNow() {
  const { pathname } = useLocation()
  const show = pathname !== '/booking'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="book-bar"
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-canvas/85 px-4 py-3 backdrop-blur-xl md:hidden"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        >
          <Link to="/booking" className="btn-gold w-full !py-4 !text-base">
            Book Now
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
