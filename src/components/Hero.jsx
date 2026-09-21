import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative isolate min-h-[700px] w-full overflow-hidden sm:min-h-[720px] lg:min-h-[560px] xl:min-h-[590px]">

      {/* BACKGROUND IMAGE */}
      <picture className="absolute inset-0 -z-30 block h-full w-full">
        <source media="(max-width: 1023px)" srcSet="/hero-mobile.jpg" />

        <img
          src="/hero.jpg"
          alt="HoneyGlow skincare collection"
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover object-center lg:object-[center_48%]"
        />
      </picture>

      {/* LIGHT READABILITY OVERLAY */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-r from-[#fff7f1]/76 via-[#fff7f1]/30 to-transparent sm:from-[#fff7f1]/70 sm:via-[#fff7f1]/25 lg:from-[#fff7f1]/62 lg:via-[#fff7f1]/18" />

      {/* SOFT PINK GLOW */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-[500px] w-[520px] rounded-full bg-[#f8d2cf]/20 blur-[100px]" />

      {/* MAIN CONTENT */}
      <div className="relative mx-auto flex min-h-[700px] max-w-[1500px] items-end px-5 pb-8 pt-24 sm:min-h-[720px] sm:px-8 sm:pb-10 lg:min-h-[560px] lg:items-center lg:px-12 lg:py-10 xl:min-h-[590px] xl:px-16">

        {/* CONTENT */}
        <div className="relative z-10 w-full max-w-[570px] -translate-y-14 sm:max-w-[600px] sm:-translate-y-12 lg:max-w-[560px] lg:-translate-y-2">

          {/* TOP LABEL */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#9c5662]/25 bg-white/35 backdrop-blur-sm sm:h-9 sm:w-9">
              <Sparkles size={14} className="text-[#833946]" />
            </div>

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.26em] text-[#78434c] sm:text-[9px]">
                HoneyGlow Essentials
              </p>

              <div className="mt-1.5 h-px w-16 bg-gradient-to-r from-[#9d4b59] to-transparent" />
            </div>
          </div>

          {/* HEADING */}
          <h1 className="font-beauty max-w-[550px] text-[47px] font-semibold leading-[0.9] tracking-[-0.045em] text-[#48262c] sm:text-[60px] lg:text-[58px] xl:text-[64px]">
            Your glow,
            <br />

            <span className="relative inline-block text-[#883c4a]">
              your ritual.

              <svg
                viewBox="0 0 260 18"
                fill="none"
                className="absolute -bottom-5 left-1 h-4 w-[80%] text-[#ba6571] sm:-bottom-6"
              >
                <path
                  d="M3 11C62 4 159 3 256 10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-9 max-w-[450px] text-[12px] font-medium leading-6 text-[#634b4f] sm:text-[14px] sm:leading-7">
            A little care can change the whole mood. Discover skincare,
            hair care, body care and everyday self-care favorites made
            for your softer, brighter moments.
          </p>

          {/* BUTTONS */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 rounded-full bg-[#74303e] px-6 py-3.5 text-[11px] font-semibold text-white shadow-[0_12px_30px_rgba(116,48,62,0.20)] transition duration-300 hover:-translate-y-1 hover:bg-[#5e2632] sm:px-7 sm:text-[12px]"
            >
              Find Your Glow

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-full border border-[#a35e69]/40 bg-white/30 px-5 py-3.5 text-[11px] font-semibold text-[#653741] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/55 sm:px-7 sm:text-[12px]"
            >
              <Leaf size={15} />
              Shop by Care
            </Link>
          </div>

          {/* SOCIAL LINKS */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-[#955460]/20 pt-4 sm:mt-6 sm:gap-3 lg:mt-8">
            <span className="mr-1 text-[7px] font-bold uppercase tracking-[0.22em] text-[#826167] sm:mr-2 sm:text-[8px]">
              Follow HoneyGlow
            </span>

            <SocialLink
              href="#"
              icon={<FaInstagram size={14} />}
              label="Instagram"
            />

            <SocialLink
              href="#"
              icon={<FaFacebookF size={13} />}
              label="Facebook"
            />

            <SocialLink
              href="#"
              icon={<FaTiktok size={13} />}
              label="TikTok"
            />
          </div>

          {/* MOBILE SIGNATURE CARD */}
          <div className="flex translate-y-16 justify-end lg:hidden">
            <SignatureCard />
          </div>
        </div>
      </div>

      {/* DESKTOP SIGNATURE CARD */}
      <div className="absolute bottom-9 right-10 hidden lg:block xl:right-16">
        <SignatureCard />
      </div>

      {/* MOBILE BRAND NOTE */}
      <div className="absolute right-4 top-5 sm:right-7 lg:hidden">
        <div className="flex items-center gap-2 rounded-full border border-white/50 bg-white/30 px-3 py-2 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#963e4e]" />

          <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#65363e]">
            HoneyGlow
          </span>
        </div>
      </div>

      {/* BOTTOM LINE */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#a96870]/35 to-transparent" />
    </section>
  );
}

function SignatureCard() {
  return (
    <div className="relative -right-4 -rotate-12 overflow-hidden rounded-2xl border border-[#d5a85d]/45 bg-yellow-600/30 px-4 py-3 text-right shadow-[0_10px_30px_rgba(120,76,29,0.12)] backdrop-blur-md sm:px-5 sm:py-4">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#ffd98d]/40 blur-xl" />

      <p className="relative font-beauty -rotate-3 text-[18px] italic leading-tight text-[#673b32] sm:text-[21px] lg:text-[22px]">
        Sweet care.
        <br />
        Softer glow.
      </p>

      <div className="relative ml-auto mt-1 h-px w-16 bg-gradient-to-l from-[#844b42] to-transparent sm:w-20" />
    </div>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group flex items-center gap-2 text-[#78414b] transition duration-300 hover:text-[#9a3e50]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#a86470]/30 bg-amber-500/40 backdrop-blur-sm transition duration-300 group-hover:-translate-y-1 group-hover:bg-white/70">
        {icon}
      </span>

      <span className="hidden text-[9px] font-semibold sm:inline">
        {label}
      </span>
    </a>
  );
}

export default Hero;