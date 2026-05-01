export default function Footer() {
  const socialLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/ssa.auckland/",
      icon: (
        <svg viewBox="0 0 43 43" className="w-8 h-8 fill-current">
          <path fillRule="evenodd" clipRule="evenodd" d="M21.5 3.87168C27.2445 3.87168 27.9248 3.89687 30.184 3.99766C32.2836 4.09004 33.4174 4.44277 34.1732 4.73672C35.1727 5.12305 35.8949 5.59336 36.6424 6.34082C37.3982 7.09668 37.8602 7.81055 38.2465 8.80996C38.5404 9.56582 38.8932 10.708 38.9855 12.7992C39.0863 15.0668 39.1115 15.7471 39.1115 21.4832C39.1115 27.2277 39.0863 27.908 38.9855 30.1672C38.8932 32.2668 38.5404 33.4006 38.2465 34.1564C37.8602 35.1559 37.3898 35.8781 36.6424 36.6256C35.8865 37.3814 35.1727 37.8434 34.1732 38.2297C33.4174 38.5236 32.2752 38.8764 30.184 38.9688C27.9164 39.0695 27.2361 39.0947 21.5 39.0947C15.7555 39.0947 15.0752 39.0695 12.816 38.9688C10.7164 38.8764 9.58262 38.5236 8.82676 38.2297C7.82734 37.8434 7.10508 37.373 6.35762 36.6256C5.60176 35.8697 5.13984 35.1559 4.75352 34.1564C4.45957 33.4006 4.10684 32.2584 4.01445 30.1672C3.91367 27.8996 3.88848 27.2193 3.88848 21.4832C3.88848 15.7387 3.91367 15.0584 4.01445 12.7992C4.10684 10.6996 4.45957 9.56582 4.75352 8.80996C5.13984 7.81055 5.61016 7.08828 6.35762 6.34082C7.11348 5.58496 7.82734 5.12305 8.82676 4.73672C9.58262 4.44277 10.7248 4.09004 12.816 3.99766C15.0752 3.89687 15.7555 3.87168 21.5 3.87168ZM21.5 0C15.6631 0 14.9324 0.0251953 12.6396 0.125977C10.3553 0.226758 8.78477 0.596289 7.42422 1.12539C6.00488 1.67969 4.80391 2.41035 3.61133 3.61133C2.41035 4.80391 1.67969 6.00488 1.12539 7.41582C0.596289 8.78477 0.226758 10.3469 0.125977 12.6312C0.0251953 14.9324 0 15.6631 0 21.5C0 27.3369 0.0251953 28.0676 0.125977 30.3604C0.226758 32.6447 0.596289 34.2152 1.12539 35.5758C1.67969 36.9951 2.41035 38.1961 3.61133 39.3887C4.80391 40.5812 6.00488 41.3203 7.41582 41.8662C8.78477 42.3953 10.3469 42.7648 12.6313 42.8656C14.924 42.9664 15.6547 42.9916 21.4916 42.9916C27.3285 42.9916 28.0592 42.9664 30.352 42.8656C32.6363 42.7648 34.2068 42.3953 35.5674 41.8662C36.9783 41.3203 38.1793 40.5812 39.3719 39.3887C40.5645 38.1961 41.3035 36.9951 41.8494 35.5842C42.3785 34.2152 42.748 32.6531 42.8488 30.3688C42.9496 28.076 42.9748 27.3453 42.9748 21.5084C42.9748 15.6715 42.9496 14.9408 42.8488 12.648C42.748 10.3637 42.3785 8.79316 41.8494 7.43262C41.3203 6.00488 40.5896 4.80391 39.3887 3.61133C38.1961 2.41875 36.9951 1.67969 35.5842 1.13379C34.2152 0.604687 32.6531 0.235156 30.3688 0.134375C28.0676 0.0251953 27.3369 0 21.5 0Z" />
          <path d="M21.5 10.4561C15.4027 10.4561 10.4561 15.4027 10.4561 21.5C10.4561 27.5973 15.4027 32.5439 21.5 32.5439C27.5973 32.5439 32.5439 27.5973 32.5439 21.5C32.5439 15.4027 27.5973 10.4561 21.5 10.4561ZM21.5 28.6639C17.5443 28.6639 14.3361 25.4557 14.3361 21.5C14.3361 17.5443 17.5443 14.3361 21.5 14.3361C25.4557 14.3361 28.6639 17.5443 28.6639 21.5C28.6639 25.4557 25.4557 28.6639 21.5 28.6639Z" />
          <path d="M35.559 10.0193C35.559 11.447 34.4 12.5976 32.9807 12.5976C31.5529 12.5976 30.4023 11.4386 30.4023 10.0193C30.4023 8.59152 31.5613 7.44093 32.9807 7.44093C34.4 7.44093 35.559 8.59992 35.559 10.0193Z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/AucklandSSA/",
      icon: (
        <svg viewBox="0 0 43 43" className="w-8 h-8 fill-current">
          <path d="M21.5 0C9.62598 0 0 9.62598 0 21.5C0 31.5826 6.94192 40.0433 16.3065 42.367V28.0704H11.8732V21.5H16.3065V18.6689C16.3065 11.3511 19.6183 7.9593 26.8028 7.9593C28.165 7.9593 30.5154 8.22676 31.4769 8.49336V14.4489C30.9695 14.3955 30.088 14.3689 28.9932 14.3689C25.468 14.3689 24.1058 15.7045 24.1058 19.1763V21.5H31.1286L29.922 28.0704H24.1058V42.8426C34.7517 41.5569 43.0009 32.4925 43.0009 21.5C43 9.62598 33.374 0 21.5 0Z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "https://nz.linkedin.com/company/ssaauckland",
      icon: (
        <svg viewBox="0 0 43 43" className="w-8 h-8 fill-current">
          <path d="M39.817 0H3.17461C1.41934 0 0 1.38574 0 3.09902V39.8926C0 41.6059 1.41934 43 3.17461 43H39.817C41.5723 43 43 41.6059 43 39.901V3.09902C43 1.38574 41.5723 0 39.817 0ZM12.7572 36.6424H6.37441V16.1166H12.7572V36.6424ZM9.56582 13.3199C7.5166 13.3199 5.86211 11.6654 5.86211 9.62461C5.86211 7.58379 7.5166 5.9293 9.56582 5.9293C11.6066 5.9293 13.2611 7.58379 13.2611 9.62461C13.2611 11.657 11.6066 13.3199 9.56582 13.3199ZM36.6424 36.6424H30.268V26.665C30.268 24.2883 30.226 21.2229 26.9506 21.2229C23.6332 21.2229 23.1293 23.818 23.1293 26.4971V36.6424H16.7633V16.1166H22.8773V18.9217H22.9613C23.8096 17.3092 25.8924 15.6043 28.9914 15.6043C35.4498 15.6043 36.6424 19.8539 36.6424 25.3801V36.6424Z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full">
      <div className="rounded-t-3xl px-30 py-12 w-full bg-ssa-red">
        {/* Main content */}
        <div className="flex justify-between">
          {/* Social links */}
          <div className="flex flex-col gap-1">
            <p className="text-ssa-black font-averia font-bold text-xl tracking-tight">
              Find us on...
            </p>
            <div className="flex gap-2 -ml-2">
              {socialLinks.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-11 h-11 rounded-xl flex items-center justify-center 
                    text-white bg-transparent 
                    hover:bg-[#FFE6B6] hover:text-[#f2627e] 
                    transition-all duration-300 ease-in-out
                  "
                >
                  {icon}
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