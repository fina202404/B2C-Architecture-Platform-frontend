
import Link from 'next/link';

export default function Footer(){
  return (
    <footer className="mt-24">
      <section className="section-dark px-6 py-16">
        <div className="mx-auto w-full max-w-[1400px] grid md:grid-cols-2 gap-12 text-white">
          <div className="space-y-4 max-w-md">
            <h2 className="text-2xl font-semibold tracking-tight">GET IN TOUCH</h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Reach out to WAIS ARCHITECTURE PLATFORM to begin your consultation,
              request a proposal, or discuss ongoing project delivery.
            </p>

            <div className="text-sm space-y-4">
              <div>
                <div className="font-semibold text-white">Head Office</div>
                <div className="text-white/70">(+00) 000 000 000</div>
                <div className="text-white/70">contact@example.com</div>
                <div className="text-white/70">Your Address Line</div>
              </div>
            </div>
          </div>

          <form className="bg-white p-6 shadow-card text-textPrimary space-y-4 max-w-md w-full">
            <input className="w-full border border-borderSoft p-3 text-sm" placeholder="Your Name" />
            <input className="w-full border border-borderSoft p-3 text-sm" placeholder="Your Email" />
            <input className="w-full border border-borderSoft p-3 text-sm" placeholder="Your Subject" />
            <textarea className="w-full border border-borderSoft p-3 text-sm h-24" placeholder="Your Message" />
            <button className="bg-textPrimary text-white text-xs font-semibold tracking-wide uppercase px-4 py-3 w-full">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section className="bg-surface text-textPrimary px-6 py-12 border-t border-borderSoft">
        <div className="mx-auto w-full max-w-[1400px] grid md:grid-cols-4 gap-10 text-sm">
          <div className="space-y-3 md:col-span-2">
            <div className="text-xl font-semibold tracking-tight">
              WAIS ARCHITECTURE PLATFORM
            </div>
            <p className="text-textSecondary leading-relaxed text-xs max-w-sm">
              Architectural consultation, design delivery, and project execution.
              Trusted experts. Transparent milestones. Premium results.
            </p>
            <div className="flex gap-3 text-xs pt-2">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded border border-borderSoft flex items-center justify-center text-textPrimary hover:text-accentGold">f</a>
              <a href="#" aria-label="X" className="w-8 h-8 rounded border border-borderSoft flex items-center justify-center text-textPrimary hover:text-accentGold">x</a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded border border-borderSoft flex items-center justify-center text-textPrimary hover:text-accentGold">in</a>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-textSecondary">OTHER PAGES</div>
            <div className="flex flex-col gap-1">
              <Link href="/">Home</Link>
              <Link href="/about">About Us</Link>
              <Link href="/services">Services</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/projects">Projects</Link>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-textSecondary">QUICK LINKS</div>
            <div className="flex flex-col gap-1">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms Of Service</Link>
              <Link href="/faq">FAQ</Link>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-center text-textSecondary mt-10">
          © {new Date().getFullYear()} WAIS ARCHITECTURE PLATFORM. All rights reserved.
        </div>
      </section>
    </footer>
  );
}
