import {
  ArrowRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const WHATSAPP_NUMBER =
  "92XXXXXXXXXX";

const DISPLAY_NUMBER =
  "+92 XXX XXXXXXX";

function Contact() {
  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Hello HoneyGlow, I need some help."
    )}`;

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#fffdfb] px-5 py-14 sm:px-8 lg:px-12">

      <div className="relative w-full max-w-[650px] overflow-hidden rounded-[28px] border border-[#e4cecb] bg-gradient-to-br from-[#fff8f5] via-[#fcedea] to-[#f7e0dd] p-2 shadow-[0_22px_65px_rgba(76,42,50,0.09)]">

        {/* DECORATION */}
        <div className="pointer-events-none absolute -left-20 top-5 h-52 w-52 rounded-full bg-[#efc9c7]/35 blur-3xl" />

        <div className="pointer-events-none absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-[#ecd4a3]/20 blur-3xl" />

        <div className="relative rounded-[22px] border border-white/75 bg-white/45 px-5 py-10 text-center backdrop-blur-sm sm:px-8 sm:py-12">

          {/* ICON */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#793747] text-white shadow-[0_12px_28px_rgba(121,55,71,0.2)]">
            <MessageCircle
              size={22}
            />
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">

            <Sparkles
              size={11}
              className="text-[#9a4656]"
            />

            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#a06b75]">
              Contact HoneyGlow
            </p>
          </div>

          <h1 className="font-beauty mt-2 text-[37px] font-semibold leading-none text-[#472a31] sm:text-[46px]">
            We're on
            <span className="ml-2 text-[#873d4c]">
              WhatsApp.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-[420px] text-[9px] leading-5 text-[#826b70] sm:text-[10px]">
            Need help with a product or your order?
            Send us a message on WhatsApp.
          </p>

          {/* NUMBER */}
          <div className="mx-auto mt-6 max-w-[330px] rounded-[18px] border border-[#dfc6c3] bg-white/65 px-4 py-4">

            <p className="text-[7px] font-bold uppercase tracking-[0.17em] text-[#a17b82]">
              WhatsApp Number
            </p>

            <p className="font-beauty mt-1.5 text-[23px] font-semibold text-[#65343e] sm:text-[26px]">
              {DISPLAY_NUMBER}
            </p>
          </div>

          {/* WHATSAPP BUTTON */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="group mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-[#793747] px-6 py-3 text-[8px] font-bold uppercase tracking-[0.13em] text-white shadow-[0_9px_24px_rgba(121,55,71,0.18)] transition hover:-translate-y-0.5 hover:bg-[#622c39]"
          >
            <MessageCircle
              size={13}
            />

            Chat on WhatsApp

            <ArrowRight
              size={11}
              className="transition group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </main>
  );
}

export default Contact;