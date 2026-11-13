// House motion grammar: a single authored gesture — content rises a short
// distance into place and settles with a soft spring, so the whole site shares
// one confident, rhythmic cadence. Movement springs; opacity fades smoothly.

const EASE = [0.16, 1, 0.3, 1]

// The house spring — slow, smooth, with a gentle settle (a touch of swagger,
// never a cartoon bounce). Reused by fadeUp and the section Reveal.
export const spring = { type: 'spring', stiffness: 52, damping: 15, mass: 1.05 }

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { y: spring, opacity: { duration: 0.7, ease: EASE } },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE } },
}

// Reveal a slow, subtle zoom on editorial imagery.
export const imageReveal = {
  hidden: { opacity: 0, scale: 1.08 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: EASE },
  },
}

// Stagger container — children inherit fadeUp and arrive in sequence.
export const stagger = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
})

// Shared viewport trigger for scroll-in sections.
export const inView = {
  once: true,
  amount: 0.25,
  margin: '0px 0px -10% 0px',
}
