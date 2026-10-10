import {
  ArrowRight,
  Leaf,
  Sparkles,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#fff9f6] lg:min-h-[560px] lg:bg-transparent xl:min-h-[590px]">

      {/* =================================================
          MOBILE IMAGE AREA
      ================================================= */}

      <div className="relative overflow-hidden lg:hidden">
        <div className="relative h-[350px] w-full overflow-hidden sm:h-[420px]">
          <img
            src="/hero-mobile.jpg"
            alt="KM Cares beauty collection"
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />

          {/* subtle image depth */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/[0.03] via-transparent to-[#fff9f6]/20" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fff9f6] via-[#fff9f6]/55 to-transparent" />

          {/* MOBILE BRAND CHIP */}
          <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
            <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-2 shadow-[0_8px_25px_rgba(74,45,53,0.08)] backdrop-blur-md">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-[#a64e5d]/25" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#943e4d]" />
              </span>

              <span className="text-[7px] font-bold uppercase tracking-[0.19em] text-[#61383f]">
                KM Cares
              </span>
            </div>
          </div>

          {/* MOBILE COLLECTION LABEL */}
          <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-6">
            <div className="rounded-full border border-white/50 bg-[#68404a]/65 px-3 py-1.5 backdrop-blur-md">
              <p className="text-[6px] font-bold uppercase tracking-[0.18em] text-white">
                Beauty · Care · Glow
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          DESKTOP BACKGROUND
      ================================================= */}

      <picture className="absolute inset-0 -z-30 hidden h-full w-full lg:block">
        <img
          src="/hero.jpg"
          alt="KM Cares beauty collection"
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover object-[center_48%]"
        />
      </picture>

      {/* DESKTOP LIGHT OVERLAY */}
      <div className="pointer-events-none absolute inset-0 -z-20 hidden bg-gradient-to-r from-white/60 via-white/10 to-transparent lg:block" />

      {/* DESKTOP SOFT GLOW */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 hidden h-[500px] w-[520px] rounded-full bg-[#f8d2cf]/20 blur-[100px] lg:block" />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="relative mx-auto max-w-[1500px] lg:flex lg:min-h-[560px] lg:items-center lg:px-12 lg:py-10 xl:min-h-[590px] xl:px-16">

        <div className="relative z-10 w-full lg:max-w-[560px]">

          {/* =================================================
              MOBILE CONTENT PANEL
          ================================================= */}

          <div className="relative px-5 pb-9 pt-1 sm:px-8 sm:pb-11 sm:pt-2 lg:p-0">

            {/* MOBILE DECOR */}
            <div className="pointer-events-none absolute -left-20 top-0 h-52 w-52 rounded-full bg-[#f3d8d7]/30 blur-[80px] lg:hidden" />

            <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-[#eadce8]/25 blur-[80px] lg:hidden" />

            <div className="relative">

              {/* =================================================
                  TOP LABEL
              ================================================= */}

              <div className="mb-4 flex items-center gap-3 sm:mb-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#9c5662]/20 bg-white/70 shadow-[0_5px_18px_rgba(115,67,77,0.06)] backdrop-blur-sm sm:h-9 sm:w-9 lg:bg-white/35">
                  <Sparkles
                    size={14}
                    className="text-[#833946]"
                  />
                </div>

                <div>
                  <p className="text-[7px] font-bold uppercase tracking-[0.27em] text-[#78434c] sm:text-[9px]">
                    KM Care Essentials
                  </p>

                  <div className="mt-1.5 h-px w-14 bg-gradient-to-r from-[#9d4b59] to-transparent sm:w-16" />
                </div>
              </div>

              {/* =================================================
                  HEADING
              ================================================= */}

              <h1 className="font-beauty max-w-[550px] text-[40px] font-semibold leading-[0.91] tracking-[-0.045em] text-[#48262c] sm:text-[52px] lg:text-[58px] xl:text-[64px]">
                Your glow,
                <br />

                <span className="relative inline-block text-[#883c4a]">
                  your ritual.

                  <svg
                    viewBox="0 0 260 18"
                    fill="none"
                    className="absolute -bottom-4 left-1 h-4 w-[76%] text-[#ba6571] sm:-bottom-5 sm:w-[80%]"
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

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <p className="mt-8 max-w-[440px] text-[11px] font-medium leading-[1.8] text-[#6f585d] sm:mt-9 sm:text-[13px] sm:leading-6 lg:text-[14px] lg:leading-7 lg:text-black">
                A little care can change the whole mood. Discover skincare,
                hair care, body care and everyday self-care favorites made
                for your softer, brighter moments.
              </p>

              {/* =================================================
                  MOBILE DIVIDER
              ================================================= */}

              <div className="mt-5 flex items-center gap-3 lg:hidden">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d9bfc3]" />

                <span className="h-1 w-1 rounded-full bg-[#b97682]" />

                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d9bfc3]" />
              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3 lg:mt-7">
                <Link
                  to="/products"
                  className="group inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#74303e] px-4 py-3 text-[9px] font-semibold text-white shadow-[0_12px_30px_rgba(116,48,62,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#5e2632] sm:min-h-0 sm:gap-3 sm:px-7 sm:py-3.5 sm:text-[12px]"
                >
                  Find Your Glow

                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4"
                  />
                </Link>

                <Link
                  to="/categories"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#b67a84]/30 bg-white/70 px-4 py-3 text-[9px] font-semibold text-[#653741] shadow-[0_6px_20px_rgba(104,66,74,0.05)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#a35e69]/50 hover:bg-white sm:min-h-0 sm:px-7 sm:py-3.5 sm:text-[12px] lg:bg-white/30"
                >
                  <Leaf size={14} />
                  Shop by Care
                </Link>
              </div>

              {/* =================================================
                  SOCIAL LINKS
              ================================================= */}

              <div className="mt-6 flex items-center justify-between border-t border-[#955460]/15 pt-4 sm:justify-start sm:gap-3 lg:mt-8">
                <span className="text-[6px] font-bold uppercase tracking-[0.22em] text-[#8b6b70] sm:mr-2 sm:text-[8px]">
                  Follow KM Care
                </span>

                <div className="flex items-center gap-2">
                  <SocialLink
                    href="#"
                    icon={<FaInstagram size={13} />}
                    label="Instagram"
                  />

                  <SocialLink
                    href="#"
                    icon={<FaFacebookF size={12} />}
                    label="Facebook"
                  />

                  <SocialLink
                    href="#"
                    icon={<FaTiktok size={12} />}
                    label="TikTok"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          DESKTOP SIGNATURE CARD ONLY
      ================================================= */}

      <div className="absolute bottom-9 right-10 hidden lg:block xl:right-16">
        <SignatureCard />
      </div>

      {/* BOTTOM LINE */}

      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#a96870]/30 to-transparent" />
    </section>
  );
}

/* =====================================================
   DESKTOP SIGNATURE CARD
===================================================== */

function SignatureCard() {
  return (
    <div className="relative -right-4 -rotate-12 overflow-hidden rounded-2xl border border-[#d5a85d]/45 bg-yellow-600/30 px-5 py-4 text-right shadow-[0_10px_30px_rgba(120,76,29,0.12)] backdrop-blur-md">

      <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#ffd98d]/40 blur-xl" />

      <p className="relative font-beauty -rotate-3 text-[22px] italic leading-tight text-[#673b32]">
        Sweet care.
        <br />
        Softer glow.
      </p>

      <div className="relative ml-auto mt-1 h-px w-20 bg-gradient-to-l from-[#844b42] to-transparent" />
    </div>
  );
}

/* =====================================================
   SOCIAL LINK
===================================================== */

function SocialLink({
  href,
  icon,
  label,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group flex items-center gap-2 text-[#78414b] transition duration-300 hover:text-[#9a3e50]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#a86470]/25 bg-[#fffaf8]/80 shadow-[0_4px_14px_rgba(105,65,74,0.05)] backdrop-blur-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-[#a86470]/45 group-hover:bg-white sm:h-8 sm:w-8 lg:bg-amber-500/40">
        {icon}
      </span>

      <span className="hidden text-[9px] font-semibold sm:inline">
        {label}
      </span>
    </a>
  );
}

export default Hero;