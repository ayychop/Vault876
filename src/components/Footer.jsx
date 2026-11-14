import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, stagger, inView } from '../lib/motion.js'
import { site } from '../lib/site.js'
import BrandMark from './BrandMark.jsx'
import {
  IconPhone,
  IconPin,
  IconArrowUpRight,
  IconInstagram,
  IconFacebook,
  IconTiktok,
} from './icons.jsx'

const socials = [
  { Icon: IconInstagram, href: site.socials.instagram, label: 'Instagram' },
  { Icon: IconFacebook, href: site.socials.facebook, label: 'Facebook' },
  { Icon: IconTiktok, href: site.socials.tiktok, label: 'TikTok' },
]

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-canvas">
      {/* CTA band */}
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-28">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-center"
        >
          <motion.div variants={fadeUp} className="max-w-xl">
            <h2 className="display-md font-display font-semibold text-ink">
              Ready when you are.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink/55">
              Reserve your chair online in a few taps, or call the salon and we
              will find you a slot. Walk-ins welcome when we can fit you in.
            </p>
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <Link to="/booking" className="btn-gold">
                Book Now
              </Link>
              <a href={site.phoneHref} className="btn-ghost">
                <IconPhone className="h-[1.05rem] w-[1.05rem]" />
                {site.phoneDisplay}
              </a>
            </div>
            <p className="mt-5 text-sm text-ink/50">
              Already been in?{' '}
              <Link
                to="/pay"
                className="font-medium text-gold underline-offset-2 transition-colors hover:text-gold-soft hover:underline"
              >
                Pay your balance online →
              </Link>
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="hidden lg:block">
            <BrandMark size={128} glow badge />
          </motion.div>
        </motion.div>

        <div className="mt-20 rule" />

        {/* Contact columns */}
        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="label-caps text-ink/40">Visit</h3>
            <address className="mt-5 not-italic leading-relaxed text-ink/75">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.city} {site.address.postcode}
            </address>
            <a
              href={site.directionsHref}
              target="_blank"
              rel="noreferrer"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-soft"
            >
              <IconPin className="h-4 w-4" />
              Get Directions
              <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div>
            <h3 className="label-caps text-ink/40">Call</h3>
            <a
              href={site.phoneHref}
              className="mt-5 inline-flex items-center gap-2.5 text-lg text-ink/85 transition-colors hover:text-gold"
            >
              <IconPhone className="h-5 w-5 text-gold/80" />
              {site.phoneDisplay}
            </a>
            <p className="mt-4 text-sm text-ink/40">
              By appointment — call to book your chair.
            </p>
          </div>

          <div>
            <h3 className="label-caps text-ink/40">Follow</h3>
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-all duration-300 ease-luxe hover:border-gold/70 hover:text-gold"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-sm text-ink/40">@vault876 — coming soon.</p>
          </div>
        </div>
      </div>

      {/* Baseline */}
      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-ink/40 sm:flex-row sm:px-8">
          <p className="flex items-center gap-2">
            © {new Date().getFullYear()} VAULT 876 — Hair &amp; Beauty
            <span aria-hidden className="text-ink/20">·</span>
            <Link
              to="/admin"
              className="text-ink/40 underline-offset-2 transition-colors hover:text-gold hover:underline"
            >
              Owner Portal
            </Link>
          </p>
          <p className="order-first font-sans text-[0.68rem] uppercase tracking-[0.3em] text-ink/55 sm:order-none">
            Unapologetically luxurious. Expertly crafted.
          </p>
          <p className="tracking-wide">{site.website}</p>
        </div>
      </div>
    </footer>
  )
}
