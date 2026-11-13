// House motion grammar: a single authored gesture — content rises a short
// distance into place on an exponential ease-out from an already-legible
// default. Reused everywhere so the whole site breathes with one rhythm.

const EASE = [0.16, 1, 0.3, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
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
