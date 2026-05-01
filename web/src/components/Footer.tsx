export default function Footer() {
  return (
    <footer className="w-full ">
      <div className="rounded-t-3xl px-30 py-12 w-full bg-ssa-red">

        {/* Main content */}
        <div className="flex justify-between">

          {/* Social links */}
          <div className="flex flex-col gap-1">
            <p className="text-ssa-black font-averia font-bold text-xl tracking-tight">
              Find us on...
            </p>
            <div className="flex gap-2 -ml-2">
              {[
                { href: "https://www.instagram.com/ssa.auckland/", src: "/instagram-logo.svg", label: "Instagram" },
                { href: "https://www.facebook.com/AucklandSSA/", src: "/facebook-logo.svg", label: "Facebook" },
                { href: "https://nz.linkedin.com/company/ssaauckland", src: "/linkedin-logo.svg", label: "LinkedIn" },
              ].map(({ href, src, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-ssa-black hover:bg-[#2d1a1a]/10 transition-colors duration-200"
                >
                  <img src={src} alt={label} className="w-8 h-8" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex gap-30">

            {/* About Us */}
            <div className="flex flex-col gap-3">
              <p className="text-ssa-black font-averia font-bold text-lg tracking-tight">About Us</p>
              <nav className="flex flex-col gap-2">
                <a href="/team" className="text-ssa-black/54 font-averia hover:text-[#FFE6B6] text-m font-bold transition-colors duration-500">
                  Our Team
                </a>
                <a href="/sponsors" className="text-ssa-black/54 font-averia hover:text-[#FFE6B6] text-m font-bold transition-colors duration-500">
                  Our Sponsors
                </a>
              </nav>
            </div>

            {/* Explore */}
            <div className="flex flex-col gap-3">
              <p className="text-ssa-black font-averia font-bold text-lg tracking-tight">Explore</p>
              <nav className="flex flex-col gap-2">
                <a href="/events" className="text-ssa-black/54 font-averia hover:text-[#FFE6B6] text-m font-bold transition-colors duration-500">
                  Events
                </a>
                <a href="/defunct" className="text-ssa-black/54 font-averia hover:text-[#FFE6B6] text-m font-bold transition-colors duration-500">
                  Defunct
                </a>
              </nav>
            </div>

            {/* Contact Us */}
            <div className="flex flex-col gap-3">
              <p className="text-ssa-black font-averia font-bold text-lg tracking-tight">Contact Us</p>
              <a href="mailto:ssa.auckland@gmail.com" className="text-ssa-black/54 font-averia hover:text-[#FFE6B6] text-m font-bold transition-colors duration-500 break-all">
                ssa.auckland@gmail.com
              </a>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          {/* Copyright */}
          <div className="flex items-center gap-2 text-ssa-black/54 text-sm font-averia">
            <span className="text-base leading-none">©</span>
            <span>Singaporean Students' Association</span>
          </div>

          {/* Logo + name */}
          <div className="flex items-center gap-3">
            <img
              src="/ssa-logo.svg"
              alt="SSA Auckland logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-white/40"
            />
            <span className="text-ssa-black/54 font-averia font-semibold text-sm leading-tight">
              Singaporean Students'<br />Association Auckland
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}
