import {
  ArrowRight,
  Heart,
  Leaf,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

function About() {
  return (
    <main className="min-h-screen bg-[#fffdfb]">

      {/* =========================
          HERO
      ========================= */}
      <section className="relative overflow-hidden border-b border-[#ecd9d6] bg-gradient-to-br from-[#fff8f5] via-[#fceeea] to-[#f7e1de] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20 xl:px-16">

        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#edcac7]/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#efd5a5]/20 blur-3xl" />

        <div className="relative mx-auto max-w-[1150px] text-center">

          <div className="mb-3 flex items-center justify-center gap-2">
            <Sparkles
              size={13}
              className="text-[#9a4656]"
            />

            <span className="text-[8px] font-bold uppercase tracking-[0.24em] text-[#a06b75] sm:text-[9px]">
              Our Story
            </span>
          </div>

          <h1 className="font-beauty mx-auto max-w-[760px] text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#43262c] sm:text-[52px] lg:text-[60px]">
            Care made for your
            <span className="ml-2 text-[#8b3e4d]">
              everyday glow.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-[620px] text-[10px] leading-5 text-[#7d666b] sm:text-[12px] sm:leading-6">
            HoneyGlow is a beauty and self-care store
            focused on simple products for skincare,
            hair care, body care and your everyday
            routine.
          </p>
        </div>
      </section>

      {/* =========================
          STORY
      ========================= */}
      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">

        <div className="mx-auto grid max-w-[1100px] gap-7 lg:grid-cols-[1fr_0.9fr] lg:items-center">

          {/* TEXT */}
          <div>

            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#a36e77]">
              HoneyGlow
            </p>

            <h2 className="font-beauty mt-2 text-[32px] font-semibold leading-tight text-[#4a2c33] sm:text-[40px]">
              Beauty should feel
              simple.
            </h2>

            <p className="mt-4 max-w-[570px] text-[10px] leading-6 text-[#80696e] sm:text-[11px]">
              We created HoneyGlow to make everyday
              beauty and personal care easier to
              explore. Our store brings together
              products for different parts of your
              routine in one clean and simple place.
            </p>

            <p className="mt-3 max-w-[570px] text-[10px] leading-6 text-[#80696e] sm:text-[11px]">
              From skincare and hair care to body and
              self-care essentials, HoneyGlow is made
              for customers who want an easy shopping
              experience without unnecessary
              complication.
            </p>

            <Link
              to="/products"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#793747] px-5 py-2.5 text-[8px] font-bold uppercase tracking-[0.13em] text-white transition hover:bg-[#622c39]"
            >
              Shop HoneyGlow

              <ArrowRight
                size={11}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* BRAND CARD */}
          <div className="relative mx-auto w-full max-w-[430px]">

            <div className="rounded-[26px] border border-[#e5cecb] bg-gradient-to-br from-[#fff7f5] to-[#f4dfdc] p-3 shadow-[0_18px_50px_rgba(77,43,51,0.08)]">

              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-[21px] border border-white/70 bg-white/35 px-6 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#793747] text-white shadow-[0_10px_25px_rgba(121,55,71,0.18)]">
                  <span className="text-[26px]">
                    🍯
                  </span>
                </div>

                <h3 className="font-beauty mt-5 text-[34px] font-semibold text-[#4a2c33]">
                  Honey
                  <span className="text-[#914656]">
                    Glow
                  </span>
                </h3>

                <p className="mt-2 text-[7px] font-bold uppercase tracking-[0.24em] text-[#a17a81]">
                  Pure care. Naturally you.
                </p>

                <p className="mt-5 max-w-[270px] text-[9px] leading-5 text-[#876f74]">
                  Everyday beauty and self-care,
                  thoughtfully presented for a softer
                  shopping experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          VALUES
      ========================= */}
      <section className="border-t border-[#eee0dd] bg-[#fff9f7] px-5 py-11 sm:px-8 lg:px-12 xl:px-16">

        <div className="mx-auto max-w-[1050px]">

          <div className="grid gap-3 sm:grid-cols-3">

            <ValueCard
              icon={Sparkles}
              title="Simple"
              text="A clean shopping experience without unnecessary steps."
            />

            <ValueCard
              icon={Heart}
              title="Everyday Care"
              text="Products selected around regular beauty and self-care routines."
            />

            <ValueCard
              icon={Leaf}
              title="Feel Good"
              text="Beauty and care made to fit naturally into your day."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function ValueCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="rounded-[18px] border border-[#e8d7d4] bg-white p-4 text-center shadow-[0_5px_18px_rgba(72,40,48,0.035)] sm:p-5">

      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#f1dfdc] text-[#874651]">
        <Icon size={14} />
      </div>

      <h3 className="font-beauty mt-3 text-[20px] font-semibold text-[#53343b]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-[240px] text-[8px] leading-4 text-[#917a7f] sm:text-[9px]">
        {text}
      </p>
    </div>
  );
}

export default About;