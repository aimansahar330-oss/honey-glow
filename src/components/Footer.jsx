import {
  ArrowRight,
  Mail,
  PackageSearch,
  Sparkles,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#ead6d4] bg-gradient-to-b from-[#fdf1ee] via-[#fae8e6] to-[#f6dfdc]">

      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#efc9c7]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-[#e6c674]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1450px] px-5 pt-9 sm:px-8 lg:px-12 xl:px-16">

        {/* =========================================
            TRACK ORDER CTA
        ========================================= */}
        <div className="relative overflow-hidden rounded-[22px] border border-[#dfc0bf] bg-gradient-to-r from-[#7a3543] via-[#88414e] to-[#71313e] px-5 py-5 shadow-[0_14px_40px_rgba(94,43,54,0.16)] sm:px-6">

          {/* CTA DECORATION */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full border border-white/10" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                <PackageSearch size={17} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={10}
                    className="text-[#f2c77b]"
                  />

                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#f6d9de]">
                    Waiting for your glow?
                  </p>
                </div>

                <h3 className="font-beauty mt-1 text-[24px] font-semibold leading-none text-white sm:text-[27px]">
                  Track your order anytime.
                </h3>

                <p className="mt-2 max-w-[500px] text-[9px] leading-4 text-white/70 sm:text-[10px]">
                  Enter your tracking number and phone number to
                  check your latest order status.
                </p>
              </div>
            </div>

            <Link
              to="/track-order"
              className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white px-5 py-2.5 text-[8px] font-bold uppercase tracking-[0.13em] text-[#753440] shadow-[0_8px_20px_rgba(30,10,15,0.15)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff4f2]"
            >
              Track Order

              <ArrowRight
                size={12}
                className="transition duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* =========================================
            FOOTER CONTENT
        ========================================= */}
        <div className="grid gap-9 py-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.2fr] lg:gap-8">

          {/* BRAND */}
          <div>
            <Link
              to="/"
              className="inline-block"
            >
              <div className="font-beauty text-[30px] font-bold leading-none text-[#492a30]">
                <span className="mr-1">🍯</span>
                Honey
                <span className="text-[#914656]">
                  Glow
                </span>
              </div>

              <p className="mt-1 text-[6px] font-bold uppercase tracking-[0.28em] text-[#a17a81]">
                Pure care. Naturally you.
              </p>
            </Link>

            <p className="mt-4 max-w-[280px] text-[10px] leading-5 text-[#796267]">
              Beauty and self-care essentials selected
              to make your everyday routine feel softer,
              simpler and a little more glowing.
            </p>

            {/* SOCIAL */}
            <div className="mt-5">
              <p className="mb-2.5 text-[8px] font-bold uppercase tracking-[0.17em] text-[#8f656d]">
                Follow HoneyGlow
              </p>

              <div className="flex gap-2.5">
                <SocialButton
                  href="#"
                  label="Instagram"
                >
                  <FaInstagram size={14} />
                </SocialButton>

                <SocialButton
                  href="#"
                  label="Facebook"
                >
                  <FaFacebookF size={13} />
                </SocialButton>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <FooterColumn
            title="Explore"
            links={[
              ["Home", "/"],
              ["Shop", "/products"],
              ["Categories", "/categories"],
              ["About Us", "/about"],
              ["Contact", "/contact"],
            ]}
          />

          {/* HELP */}
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#56383e]">
              Customer Care
            </h3>

            <div className="mt-4 flex flex-col gap-2.5">

              {/* SPECIAL TRACK LINK */}
              <Link
                to="/track-order"
                className="group flex w-fit items-center gap-2 rounded-full border border-[#c98f97] bg-[#f4dedd] px-3 py-2 text-[8px] font-bold text-[#773b47] transition hover:bg-[#793747] hover:text-white"
              >
                <PackageSearch size={12} />

                Track Order

                <ArrowRight
                  size={10}
                  className="transition group-hover:translate-x-0.5"
                />
              </Link>

              <FooterLink
                name="Shipping"
                path="/shipping"
              />

              <FooterLink
                name="Returns"
                path="/returns"
              />

              <FooterLink
                name="FAQs"
                path="/faq"
              />
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <div className="flex items-center gap-2">
              <Mail
                size={13}
                className="text-[#8d4754]"
              />

              <h3 className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#56383e]">
                Glow Notes
              </h3>
            </div>

            <p className="mt-4 max-w-[300px] text-[10px] leading-5 text-[#796267]">
              Get beauty tips, product drops and little
              self-care reminders delivered to your inbox.
            </p>

            <div className="mt-4 overflow-hidden rounded-[13px] border border-[#d8bdbd] bg-white/70 shadow-[0_6px_18px_rgba(88,52,58,0.05)]">

              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent px-3.5 py-3 text-[9px] text-[#573d42] outline-none placeholder:text-[#ad969a] sm:text-[10px]"
                />

                <button
                  type="button"
                  className="group flex items-center gap-1.5 bg-[#74323d] px-4 text-[8px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#5f2934]"
                >
                  Join
                  <ArrowRight
                    size={10}
                    className="transition group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>

            <p className="mt-2 text-[7px] leading-4 text-[#a0868b]">
              No noise. Just useful beauty updates.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          BOTTOM BAR
      ========================================= */}
      <div className="relative border-t border-[#ddc5c3] bg-white/20">

        <div className="mx-auto flex max-w-[1450px] flex-col gap-2 px-5 py-4 text-center sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-left lg:px-12 xl:px-16">

          <p className="text-[8px] text-[#866e72]">
            © 2026 HoneyGlow. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-2 text-[8px] text-[#8d7479] sm:justify-end">

            <span className="h-1 w-1 rounded-full bg-[#ad7b83]" />

            <span>
              Pure care, naturally you.
            </span>

            <span className="h-1 w-1 rounded-full bg-[#ad7b83]" />

          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================
   FOOTER COLUMN
========================================= */

function FooterColumn({
  title,
  links,
}) {
  return (
    <div>
      <h3 className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#56383e]">
        {title}
      </h3>

      <div className="mt-4 flex flex-col gap-2.5">
        {links.map(
          ([name, path]) => (
            <FooterLink
              key={name}
              name={name}
              path={path}
            />
          )
        )}
      </div>
    </div>
  );
}

/* =========================================
   NORMAL FOOTER LINK
========================================= */

function FooterLink({
  name,
  path,
}) {
  return (
    <Link
      to={path}
      className="group flex w-fit items-center gap-2 text-[9px] font-medium text-[#796267] transition duration-300 hover:translate-x-1 hover:text-[#793747]"
    >
      <span className="h-1 w-1 rounded-full bg-[#c1949a] transition group-hover:bg-[#793747]" />

      {name}
    </Link>
  );
}

/* =========================================
   SOCIAL BUTTON
========================================= */

function SocialButton({
  children,
  href,
  label,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d9bdbd] bg-white/65 text-[#74323d] shadow-[0_5px_14px_rgba(85,48,56,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#a65e6a] hover:bg-[#74323d] hover:text-white"
    >
      {children}
    </a>
  );
}

export default Footer;