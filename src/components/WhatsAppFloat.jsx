import { FaWhatsapp } from "react-icons/fa";

function WhatsAppFloat() {
  const phoneNumber = "923001234567";
  const message = "Assalam o Alaikum, mujhe KM Cares ke products ke bare me maloomat chahiye.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_35px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-110 hover:shadow-[0_18px_45px_rgba(37,211,102,0.45)]"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping"></span>
      <span className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse"></span>
      <FaWhatsapp className="relative z-10 text-[30px] animate-bounce" />
    </a>
  );
}

export default WhatsAppFloat;