import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Check,
  ChevronRight,
  Crown,
  Minus,
  Play,
  Plus,
  Quote,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import {
  addSignatureProductReview,
  getSignatureProductReviews,
  getSignatureProducts,
} from "../services/signatureProductApi";

import { useCart } from "../context/CartContext";

/* =====================================================
   YOUTUBE
===================================================== */

function getYouTubeId(url) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);

    if (
      parsed.hostname.includes(
        "youtu.be"
      )
    ) {
      return parsed.pathname.replace(
        "/",
        ""
      );
    }

    if (
      parsed.hostname.includes(
        "youtube.com"
      )
    ) {
      if (
        parsed.pathname.startsWith(
          "/shorts/"
        )
      ) {
        return parsed.pathname.split(
          "/"
        )[2];
      }

      if (
        parsed.pathname.startsWith(
          "/embed/"
        )
      ) {
        return parsed.pathname.split(
          "/"
        )[2];
      }

      return parsed.searchParams.get(
        "v"
      );
    }

    return null;
  } catch {
    return null;
  }
}

/* =====================================================
   TYPEWRITER
===================================================== */

function useTypewriter(text) {
  const [
    typedText,
    setTypedText,
  ] = useState("");

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  useEffect(() => {
    let timer;

    if (!deleting) {
      if (
        typedText.length <
        text.length
      ) {
        timer = setTimeout(() => {
          setTypedText(
            text.slice(
              0,
              typedText.length + 1
            )
          );
        }, 10);
      } else {
        timer = setTimeout(() => {
          setDeleting(true);
        }, 1500);
      }
    } else {
      if (
        typedText.length > 0
      ) {
        timer = setTimeout(() => {
          setTypedText(
            text.slice(
              0,
              typedText.length - 1
            )
          );
        }, 5);
      } else {
        timer = setTimeout(() => {
          setDeleting(false);
        }, 250);
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, [
    typedText,
    deleting,
    text,
  ]);

  return typedText;
}

/* =====================================================
   MAIN
===================================================== */

function SignatureShowcase() {
  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  const typedHeading =
    useTypewriter(
      "Signature Collection"
    );

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "signature-products",
    ],
    queryFn:
      getSignatureProducts,
    staleTime:
      5 * 60 * 1000,
    refetchOnWindowFocus:
      false,
  });

  const products =
    Array.isArray(data)
      ? data.slice(0, 4)
      : [];

  const videoProduct =
    products.find(
      (product) =>
        product.isPrimary &&
        product.videoUrl
    ) ||
    products.find(
      (product) =>
        product.videoUrl
    ) ||
    null;

  const videoId =
    getYouTubeId(
      videoProduct?.videoUrl
    );

  if (isLoading) {
    return (
      <SignatureSkeleton />
    );
  }

  if (
    isError ||
    products.length === 0
  ) {
    return null;
  }

  const productGridClass =
    products.length === 1
      ? "grid-cols-1"
      : products.length === 2
        ? "sm:grid-cols-2"
        : products.length === 3
          ? "sm:grid-cols-2 xl:grid-cols-3"
          : "sm:grid-cols-2";

  const compact =
    products.length === 4;

  const videoDesktopClass =
    products.length === 4
      ? "lg:h-[500px] xl:h-[520px] lg:self-center"
      : products.length === 3
        ? "lg:h-[455px] xl:h-[480px] lg:self-center"
        : products.length === 2
          ? "lg:h-[440px] xl:h-[465px] lg:self-center"
          : "lg:h-[430px] xl:h-[455px] lg:self-center";

  return (
    <>
      <style>{`
        @keyframes signatureCursor {
          0%, 45% {
            opacity: 1;
          }

          46%, 100% {
            opacity: 0;
          }
        }

        @keyframes signatureTextShine {
          0% {
            background-position: 220% center;
          }

          100% {
            background-position: -220% center;
          }
        }

        @keyframes signatureFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes signatureImageBreath {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.032);
          }
        }

        @keyframes signatureSweep {
          0% {
            left: -80%;
            opacity: 0;
          }

          16% {
            opacity: 0;
          }

          27% {
            opacity: .65;
          }

          48% {
            left: 135%;
            opacity: 0;
          }

          100% {
            left: 135%;
            opacity: 0;
          }
        }

        @keyframes signatureGlow {
          0%, 100% {
            opacity: .24;
            transform: scale(.97);
          }

          50% {
            opacity: .58;
            transform: scale(1.025);
          }
        }

        @keyframes signatureTwinkle {
          0%, 100% {
            opacity: .18;
            transform: scale(.72) rotate(0deg);
          }

          50% {
            opacity: 1;
            transform: scale(1.18) rotate(20deg);
          }
        }

        @keyframes signatureBadge {
          0%, 100% {
            box-shadow:
              0 0 0 0 rgba(111,31,52,0);
          }

          50% {
            box-shadow:
              0 0 0 5px rgba(111,31,52,.13);
          }
        }

        @keyframes signaturePrice {
          0%, 100% {
            opacity: .9;
          }

          50% {
            opacity: 1;
            text-shadow:
              0 0 18px
              rgba(109,32,52,.24);
          }
        }

        @keyframes signatureLine {
          0%, 100% {
            transform: scaleX(.16);
            opacity: .3;
          }

          50% {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes signatureBorderPulse {
          0%, 100% {
            filter:
              saturate(1)
              brightness(.88);
          }

          50% {
            filter:
              saturate(1.35)
              brightness(1.1);
          }
        }

        .signature-heading-text {
          background:
            linear-gradient(
              100deg,
              #7a2839 0%,
              #aa4058 24%,
              #661d31 45%,
              #bd7749 61%,
              #812d41 78%,
              #4e1525 100%
            );

          background-size:
            250% auto;

          -webkit-background-clip:
            text;

          background-clip:
            text;

          color:
            transparent;

          animation:
            signatureTextShine
            4s linear infinite;

          transition:
            filter .35s ease,
            text-shadow .35s ease,
            transform .35s ease;
        }

        .signature-heading-area:hover
        .signature-heading-text {
          filter:
            saturate(1.5)
            brightness(.65);

          text-shadow:
            0 8px 26px
            rgba(84,25,40,.28);

          transform:
            translateY(-1px);
        }

        .signature-special-word {
          transition:
            color .35s ease,
            text-shadow .35s ease,
            transform .35s ease;
        }

        .signature-heading-area:hover
        .signature-special-word {
          color:
            #42141f;

          text-shadow:
            0 7px 22px
            rgba(84,25,40,.18);

          transform:
            translateY(-1px);
        }

        .signature-type-cursor {
          animation:
            signatureCursor
            .7s step-end infinite;
        }

        .signature-product-name {
          background:
            linear-gradient(
              100deg,
              #4e3038 0%,
              #4e3038 34%,
              #8b3448 50%,
              #4e3038 66%,
              #4e3038 100%
            );

          background-size:
            250% auto;

          -webkit-background-clip:
            text;

          background-clip:
            text;

          color:
            transparent;

          animation:
            signatureTextShine
            6s linear infinite;
        }

        .signature-card-float {
          animation:
            signatureFloat
            7s ease-in-out infinite;
        }

        .signature-image-breath {
          animation:
            signatureImageBreath
            9s ease-in-out infinite;
        }

        .signature-auto-sweep {
          animation:
            signatureSweep
            6s ease-in-out infinite;
        }

        .signature-glow {
          animation:
            signatureGlow
            5s ease-in-out infinite;
        }

        .signature-twinkle {
          animation:
            signatureTwinkle
            2.8s ease-in-out infinite;
        }

        .signature-badge {
          animation:
            signatureBadge
            3.8s ease-in-out infinite;
        }

        .signature-price {
          animation:
            signaturePrice
            3.5s ease-in-out infinite;
        }

        .signature-heading-line {
          transform-origin:
            center;

          animation:
            signatureLine
            4.5s ease-in-out infinite;
        }

        .signature-deep-border {
          animation:
            signatureBorderPulse
            4s ease-in-out infinite;
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .signature-heading-text,
          .signature-type-cursor,
          .signature-product-name,
          .signature-card-float,
          .signature-image-breath,
          .signature-auto-sweep,
          .signature-glow,
          .signature-twinkle,
          .signature-badge,
          .signature-price,
          .signature-heading-line,
          .signature-deep-border {
            animation:
              none !important;
          }
        }
      `}</style>

      <section className="relative overflow-hidden border-y border-[#f0e1e2] bg-gradient-to-br from-[#fffaf8] via-[#fbf3f2] to-[#f5eaed] px-4 py-10 sm:px-6 sm:py-14 lg:px-9 lg:py-16">

        {/* BACKGROUND */}

        <div className="pointer-events-none absolute -left-44 -top-44 h-[520px] w-[520px] rounded-full bg-[#edcdd1]/25 blur-[150px]" />

        <div className="pointer-events-none absolute -right-44 bottom-[-180px] h-[560px] w-[560px] rounded-full bg-[#e8d8e9]/24 blur-[160px]" />

        <div className="pointer-events-none absolute left-[45%] top-[25%] h-[330px] w-[330px] rounded-full bg-[#d9e8eb]/20 blur-[140px]" />

        <div className="relative mx-auto max-w-[1480px]">

          {/* HEADER */}

          <div className="mb-8 grid gap-5 sm:mb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8">

            <div className="min-w-0 text-center lg:text-left">

              <div className="flex items-center justify-center gap-2.5 lg:justify-start">

                <span className="signature-badge relative flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#d5b7bc] bg-white text-[#792d3f] shadow-sm">

                  <span className="absolute inset-0 animate-pulse rounded-[10px] bg-[#842e43]/10" />

                  <Crown
                    size={13}
                    className="relative"
                  />
                </span>

                <p className="text-[7px] font-bold uppercase tracking-[0.27em] text-[#8c4f5c] sm:text-[8px]">
                  KM Signature
                </p>
              </div>

              {/* MAIN TITLE */}

              <h2 className="font-beauty mt-3 text-[31px] font-semibold leading-none tracking-[-0.04em] text-[#53383f] sm:text-[42px] lg:text-[48px]">
                KM Cares
              </h2>

              {/* SPECIAL + TYPEWRITER */}

              <div className="signature-heading-area relative mx-auto mt-1 flex h-[42px] max-w-[760px] cursor-default items-center justify-center overflow-hidden sm:h-[54px] lg:mx-0 lg:h-[60px] lg:justify-start">

                <div className="flex min-w-0 items-center whitespace-nowrap font-beauty font-semibold leading-none tracking-[-0.04em]">

                  {/* STATIC SPECIAL */}

                  <span className="signature-special-word shrink-0 text-[23px] text-[#53383f] sm:text-[37px] lg:text-[44px]">
                    Special
                  </span>

                  {/* FIXED WIDTH TYPEWRITER AREA */}

                  <span className="relative ml-2 inline-block text-left sm:ml-3">

                    {/* RESERVE FULL WIDTH */}

                    <span
                      aria-hidden="true"
                      className="invisible whitespace-nowrap text-[23px] sm:text-[37px] lg:text-[44px]"
                    >
                      Signature Collection
                    </span>

                    {/* ANIMATED TEXT */}

                    <span className="absolute inset-y-0 left-0 flex items-center">

                      <span className="signature-heading-text whitespace-nowrap text-[23px] sm:text-[37px] lg:text-[44px]">
                        {typedHeading}
                      </span>

                      <span className="signature-type-cursor ml-[2px] inline-block h-[22px] w-[2px] shrink-0 rounded-full bg-[#70283a] sm:h-[33px] lg:h-[40px]" />
                    </span>
                  </span>
                </div>
              </div>

              {/* ANIMATED LINE */}

              <div className="mx-auto mt-1 h-px w-20 overflow-hidden lg:mx-0">

                <div className="signature-heading-line h-full w-full bg-gradient-to-r from-transparent via-[#78283c] to-transparent" />
              </div>

              <p className="mx-auto mt-3 max-w-[470px] text-[9px] leading-5 text-[#907c81] sm:text-[10px] lg:mx-0">
                Discover KM Cares&apos;s
                most special beauty
                essentials.
              </p>

              <div className="mt-3 flex items-center justify-center gap-2 lg:justify-start">

                <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#9b4b5b]" />

                <span className="font-beauty text-[17px] font-semibold text-[#69484f] sm:text-[19px]">
                  Zafrani Cream
                </span>

                <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#9b4b5b]" />
              </div>
            </div>

            {/* VIEW ALL */}

            <div className="flex justify-center lg:justify-end">

              <Link
                to="/signature-collection"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[#cbaab0] bg-white/90 px-5 py-3 text-[7px] font-bold uppercase tracking-[0.15em] text-[#6e2b3a] shadow-[0_10px_30px_rgba(84,31,44,0.08)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#702a3c] hover:bg-[#672536] hover:text-white sm:text-[8px]"
              >

                <span className="signature-auto-sweep pointer-events-none absolute top-0 h-full w-[35%] -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                <span className="relative">
                  View All Signature
                </span>

                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#eee0e3] text-[#7e3345] transition duration-300 group-hover:translate-x-1 group-hover:bg-white/15 group-hover:text-white">

                  <ChevronRight
                    size={11}
                  />
                </span>
              </Link>
            </div>
          </div>

          {/* PRODUCTS + VIDEO */}

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_390px]">

            {/* PRODUCTS */}

            <div
              className={`grid content-start gap-4 sm:gap-5 ${productGridClass}`}
            >

              {products.map(
                (
                  product,
                  index
                ) => (

                  <div
                    key={
                      product.id
                    }
                    className={
                      products.length ===
                        3 &&
                      index === 2
                        ? "sm:col-span-2 xl:col-span-1"
                        : ""
                    }
                  >

                    <SignatureHomeCard
                      product={
                        product
                      }
                      compact={
                        compact
                      }
                      index={
                        index
                      }
                      onOpen={() =>
                        setSelectedProduct(
                          product
                        )
                      }
                    />
                  </div>
                )
              )}
            </div>

            {/* VIDEO */}

            <SignatureVideo
              videoId={
                videoId
              }
              desktopClass={
                videoDesktopClass
              }
            />
          </div>
        </div>
      </section>

      {/* DETAIL MODAL */}

      {selectedProduct && (

        <SignatureDetailModal
          product={
            selectedProduct
          }
          onClose={() =>
            setSelectedProduct(
              null
            )
          }
        />
      )}
    </>
  );
}

/* =====================================================
   SIGNATURE PRODUCT CARD
===================================================== */

function SignatureHomeCard({
  product,
  onOpen,
  compact,
  index,
}) {
  const image =
    product.images?.[0]
      ?.imageUrl ||
    null;

  const finalPrice =
    product.discountPrice ??
    product.originalPrice;

  const stock =
    Number(
      product.stock || 0
    );

  const originalPrice =
    Number(
      product.originalPrice ||
        0
    );

  const discountPrice =
    product.discountPrice
      ? Number(
          product.discountPrice
        )
      : null;

  const discountPercent =
    discountPrice &&
    originalPrice > 0
      ? Math.round(
          ((originalPrice -
            discountPrice) /
            originalPrice) *
            100
        )
      : 0;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(
        event
      ) => {
        if (
          event.key ===
            "Enter" ||
          event.key === " "
        ) {
          onOpen();
        }
      }}
      style={{
        animationDelay:
          `${index * 0.55}s`,
      }}
      className="signature-card-float group relative h-full cursor-pointer rounded-[31px] p-[3px] outline-none"
    >

      {/* DEEP GLOW */}

      <div className="signature-glow pointer-events-none absolute -inset-5 -z-10 rounded-[44px] bg-gradient-to-r from-[#702238]/25 via-[#a16825]/18 to-[#235d6c]/24 blur-3xl" />

      {/* DEEP ANIMATED BORDER */}

      <div className="signature-deep-border pointer-events-none absolute inset-0 overflow-hidden rounded-[31px] bg-[#531727]">

        <div
          className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_5s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, #3f0d1b 0deg, #961f42 40deg, #d09a37 80deg, #6b3277 120deg, #176276 165deg, #0f4353 205deg, #823263 245deg, #bd4d37 286deg, #951d3c 326deg, #3f0d1b 360deg)",
          }}
        />
      </div>

      {/* CARD */}

      <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-[28px] border border-white/60 bg-[#fffdfb] shadow-[0_22px_65px_rgba(73,31,42,0.16)]">

        {/* AUTO LIGHT */}

        <div
          className="signature-auto-sweep pointer-events-none absolute top-0 z-50 h-full w-[30%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            animationDelay:
              `${index * 0.9}s`,
          }}
        />

        {/* SPARKLES */}

        <Sparkles
          size={13}
          className="signature-twinkle pointer-events-none absolute right-5 top-5 z-40 text-white"
        />

        <Sparkles
          size={8}
          className="signature-twinkle pointer-events-none absolute right-11 top-10 z-40 text-[#e9b868]"
          style={{
            animationDelay:
              "1.1s",
          }}
        />

        {/* IMAGE */}

        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#f3e7e7] via-[#fff8f4] to-[#e8e1e9] ${
            compact
              ? "h-[185px] sm:h-[195px]"
              : "h-[220px] sm:h-[235px]"
          }`}
        >

          {image ? (

            <img
              src={image}
              alt={
                product.name
              }
              className="signature-image-breath h-full w-full object-cover"
              style={{
                animationDelay:
                  `${index * 0.8}s`,
              }}
            />

          ) : (

            <div className="h-full w-full bg-gradient-to-br from-[#e9cfd4] via-[#fff8f4] to-[#d9e5e8]" />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#391923]/35 via-transparent to-transparent" />

          {/* SIGNATURE BADGE */}

          <span className="signature-badge absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/30 bg-[#541a2b]/85 px-2.5 py-1.5 text-[5px] font-bold uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur-md">

            <Sparkles
              size={8}
            />

            Signature
          </span>

          {/* DISCOUNT */}

          {discountPercent > 0 && (

            <span className="absolute right-3 top-3 rounded-full border border-[#eccb91]/45 bg-[#7b273c]/90 px-2.5 py-1.5 text-[5px] font-bold uppercase tracking-[0.1em] text-white shadow backdrop-blur-md">

              {
                discountPercent
              }
              % Off
            </span>
          )}

          {/* IMAGE LABEL */}

          <div className="absolute bottom-3 left-3">

            <div className="rounded-full border border-white/25 bg-[#421724]/70 px-3 py-1.5 backdrop-blur-md">

              <p className="text-[5px] font-bold uppercase tracking-[0.16em] text-white">
                KM Cares Signature
              </p>
            </div>
          </div>
        </div>

        {/* DETAILS */}

        <div
          className={`flex flex-1 flex-col ${
            compact
              ? "p-3.5 sm:p-4"
              : "p-4 sm:p-5"
          }`}
        >

          <div className="flex items-center justify-between gap-2">

            <p className="text-[6px] font-bold uppercase tracking-[0.17em] text-[#94767c]">

              Code KM-

              {String(
                product.id
              ).padStart(
                4,
                "0"
              )}
            </p>

            <Sparkles
              size={9}
              className="signature-twinkle text-[#84384b]"
            />
          </div>

          {/* NAME */}

          <h3
            className={`signature-product-name font-beauty mt-1.5 line-clamp-2 font-semibold leading-[1.04] tracking-[-0.03em] ${
              compact
                ? "text-[21px] sm:text-[23px]"
                : "text-[24px] sm:text-[27px]"
            }`}
          >

            {product.name}
          </h3>

          {/* RATING */}

          <div className="mt-2">

            <CardRating
              productId={
                product.id
              }
            />
          </div>

          {/* DIVIDER */}

          <div className="mt-3 h-px w-full overflow-hidden bg-[#eadbdd]">

            <div className="signature-heading-line h-full w-full bg-gradient-to-r from-transparent via-[#72273a] to-transparent" />
          </div>

          {/* PRICE */}

          <div className="mt-3">

            <p className="text-[6px] font-bold uppercase tracking-[0.14em] text-[#927c81]">
              Signature Price
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">

              <span
                className={`signature-price font-black text-[#71283a] ${
                  compact
                    ? "text-[17px] sm:text-[19px]"
                    : "text-[18px] sm:text-[21px]"
                }`}
              >

                Rs.{" "}

                {Number(
                  finalPrice
                ).toLocaleString()}
              </span>

              {product.discountPrice && (

                <span className="text-[9px] text-[#b39fa3] line-through">

                  Rs.{" "}

                  {Number(
                    product.originalPrice
                  ).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* STOCK */}

          <div className="mt-2 flex items-center gap-2">

            <span className="relative flex h-2 w-2 items-center justify-center">

              {stock > 0 && (

                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/30" />
              )}

              <span
                className={`relative h-1.5 w-1.5 rounded-full ${
                  stock > 0
                    ? "bg-emerald-500"
                    : "bg-red-400"
                }`}
              />
            </span>

            <span className="text-[6px] font-bold uppercase tracking-[0.12em] text-[#8d797e]">

              {stock > 0
                ? `${stock} Available`
                : "Out of stock"}
            </span>
          </div>

          {/* SHOP NOW */}

          <div className="mt-auto pt-4">

            <button
              type="button"
              onClick={(
                event
              ) => {
                event.stopPropagation();

                onOpen();
              }}
              className="group/button relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#632437] px-4 py-3 text-[7px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_10px_28px_rgba(84,25,40,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#4e1929]"
            >

              <span className="signature-auto-sweep pointer-events-none absolute top-0 h-full w-[30%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <ShoppingBag
                size={11}
                className="relative"
              />

              <span className="relative">
                Shop Now
              </span>

              <ChevronRight
                size={10}
                className="relative transition duration-300 group-hover/button:translate-x-1.5"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   VIDEO
===================================================== */

function SignatureVideo({
  videoId,
  desktopClass,
}) {
  return (
    <div
      className={`group relative min-h-[350px] overflow-hidden rounded-[31px] p-[3px] sm:min-h-[420px] lg:min-h-0 ${desktopClass}`}
    >

      {/* VIDEO GLOW */}

      <div className="signature-glow pointer-events-none absolute -inset-5 -z-10 rounded-[44px] bg-gradient-to-br from-[#702238]/25 via-[#a16825]/16 to-[#235d6c]/24 blur-3xl" />

      {/* VIDEO BORDER */}

      <div className="signature-deep-border pointer-events-none absolute inset-0 overflow-hidden rounded-[31px] bg-[#541a2b]">

        <div
          className="absolute left-1/2 top-1/2 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2 animate-[spin_7s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, #3f0d1b, #951f42, #c89134, #66326f, #176276, #104654, #7e315f, #b84b37, #3f0d1b)",
          }}
        />
      </div>

      {/* VIDEO */}

      <div className="relative h-full min-h-[344px] overflow-hidden rounded-[27px] bg-[#563d45] shadow-[0_24px_65px_rgba(74,31,44,0.20)] sm:min-h-[414px] lg:min-h-0">

        {videoId ? (

          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1`}
            title="KM Signature Video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />

        ) : (

          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#8a3d52] via-[#642d3f] to-[#401e2a] p-7 text-center">

            <div>

              <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#541e31] text-white">

                <span className="absolute inset-0 animate-ping rounded-full border border-white/15" />

                <Play
                  size={18}
                  className="relative"
                />
              </div>

              <p className="font-beauty mt-4 text-[27px] text-white">
                Beauty in motion.
              </p>

              <p className="mt-2 text-[6px] uppercase tracking-[0.18em] text-[#e8c8cd]">
                Add video from admin
              </p>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#351923]/90 to-transparent" />

        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/15 bg-[#351923]/70 px-3 py-1.5 backdrop-blur-md">

          <p className="text-[6px] font-bold uppercase tracking-[0.18em] text-white">
            KM Care Film
          </p>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-5">

          <p className="text-[6px] font-bold uppercase tracking-[0.18em] text-[#f1c9ce]">
            Signature Story
          </p>

          <p className="font-beauty mt-1 text-[21px] text-white">
            Beauty in motion.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   CARD RATING
===================================================== */

function CardRating({
  productId,
}) {
  const {
    data,
  } = useQuery({
    queryKey: [
      "signature-reviews",
      productId,
    ],
    queryFn: () =>
      getSignatureProductReviews(
        productId
      ),
    staleTime:
      5 * 60 * 1000,
    refetchOnWindowFocus:
      false,
  });

  const rating =
    Number(
      data?.averageRating ||
        0
    );

  const count =
    Number(
      data?.reviewCount ||
        0
    );

  return (
    <div className="flex items-center gap-1.5">

      <Stars
        value={
          rating
        }
        size={11}
      />

      <span className="text-[7px] font-semibold text-[#8e7379]">

        {rating > 0
          ? rating.toFixed(1)
          : "0.0"}
      </span>

      <span className="text-[6px] text-[#b29ea2]">
        ({count})
      </span>
    </div>
  );
}

/* =====================================================
   DETAIL MODAL
===================================================== */

function SignatureDetailModal({
  product,
  onClose,
}) {
  const queryClient =
    useQueryClient();

  const {
    addToCart,
  } = useCart();

  const [
    activeImage,
    setActiveImage,
  ] = useState(
    product.images?.[0]
      ?.imageUrl ||
      null
  );

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    added,
    setAdded,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const {
    data:
      reviewData,
    isLoading:
      reviewsLoading,
  } = useQuery({
    queryKey: [
      "signature-reviews",
      product.id,
    ],
    queryFn: () =>
      getSignatureProductReviews(
        product.id
      ),
  });

  const reviewMutation =
    useMutation({
      mutationFn:
        addSignatureProductReview,

      onSuccess:
        async () => {
          await queryClient.invalidateQueries({
            queryKey: [
              "signature-reviews",
              product.id,
            ],
          });

          setForm({
            name: "",
            rating: 5,
            comment: "",
          });
        },
    });

  const reviews =
    reviewData?.reviews ||
    [];

  const finalPrice =
    product.discountPrice ??
    product.originalPrice;

  const handleAddToCart =
    () => {
      if (
        Number(
          product.stock
        ) < 1
      ) {
        return;
      }

      addToCart(
        {
          ...product,
          productType:
            "SIGNATURE",
        },
        quantity
      );

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1500);
    };

  const submitReview =
    (event) => {
      event.preventDefault();

      reviewMutation.mutate({
        id:
          product.id,

        payload: {
          name:
            form.name.trim(),

          rating:
            form.rating,

          comment:
            form.comment.trim(),
        },
      });
    };

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-[#4b383e]/45 p-3 backdrop-blur-md"
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-[24px] border border-[#e8d9dc] bg-[#fffaf8] shadow-[0_35px_120px_rgba(82,59,66,0.30)]">

        {/* HEADER */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#eadcdf] bg-[#fffaf8] px-4 py-3">

          <div>

            <p className="text-[6px] font-bold uppercase tracking-[0.18em] text-[#a66874]">
              KM Cares Signature
            </p>

            <p className="font-beauty mt-0.5 text-[18px] font-semibold text-[#593b42]">
              Product Detail
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e2d1d4] bg-white text-[#825860] transition duration-300 hover:rotate-90 hover:bg-[#a9616e] hover:text-white"
          >

            <X
              size={13}
            />
          </button>
        </div>

        {/* PRODUCT */}

        <div className="grid sm:grid-cols-[0.88fr_1.12fr]">

          {/* IMAGE */}

          <div className="border-b border-[#e8dadd] bg-gradient-to-br from-[#d7edf3] via-[#93cad8] to-[#5ba0b5] p-4 sm:border-b-0 sm:border-r">

            <div className="flex min-h-[260px] items-center justify-center overflow-hidden rounded-[18px] bg-white/20">

              {activeImage && (

                <img
                  src={
                    activeImage
                  }
                  alt={
                    product.name
                  }
                  className="max-h-[250px] w-[90%] object-contain p-2"
                />
              )}
            </div>

            {product.images?.length >
              1 && (

              <div className="mt-2.5 flex justify-center gap-1.5 overflow-x-auto">

                {product.images.map(
                  (
                    image
                  ) => (

                    <button
                      key={
                        image.id
                      }
                      type="button"
                      onClick={() =>
                        setActiveImage(
                          image.imageUrl
                        )
                      }
                      className={`h-10 w-10 shrink-0 overflow-hidden rounded-[9px] border bg-white ${
                        activeImage ===
                        image.imageUrl
                          ? "border-[#4e94aa]"
                          : "border-[#d9dfe1]"
                      }`}
                    >

                      <img
                        src={
                          image.imageUrl
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* DETAILS */}

          <div className="p-5 sm:p-6">

            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f2e4e7] px-2.5 py-1.5">

              <Crown
                size={9}
                className="text-[#a35d69]"
              />

              <span className="text-[6px] font-bold uppercase tracking-[0.14em] text-[#a35d69]">
                Signature
              </span>
            </div>

            <h2 className="font-beauty mt-3 text-[30px] font-semibold leading-none text-[#583a41] sm:text-[34px]">

              {
                product.name
              }
            </h2>

            <div className="mt-3 flex items-center gap-2">

              <Stars
                value={
                  reviewData
                    ?.averageRating ||
                  0
                }
              />

              <span className="text-[7px] text-[#987f84]">

                {Number(
                  reviewData
                    ?.averageRating ||
                    0
                ).toFixed(1)}
                {" "}
                (
                {reviewData
                  ?.reviewCount ||
                  0}
                )
              </span>
            </div>

            <p className="mt-4 text-[9px] leading-5 text-[#7e686d]">

              {product.shortDescription ||
                "A premium KM Cares signature essential created for your beauty ritual."}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">

              <span className="text-[20px] font-bold text-[#a9616e]">

                Rs.{" "}

                {Number(
                  finalPrice
                ).toLocaleString()}
              </span>

              {product.discountPrice && (

                <span className="text-[8px] text-[#b19da1] line-through">

                  Rs.{" "}

                  {Number(
                    product.originalPrice
                  ).toLocaleString()}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-[7px] text-[#917c80]">

              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  Number(
                    product.stock
                  ) > 0
                    ? "bg-emerald-500"
                    : "bg-red-400"
                }`}
              />

              {Number(
                product.stock
              ) > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </div>

            {/* QUANTITY + CART */}

            <div className="mt-6 flex flex-wrap items-center gap-2.5">

              <div className="flex items-center rounded-full border border-[#e3d3d6] bg-white p-1">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (
                        current
                      ) =>
                        Math.max(
                          1,
                          current -
                            1
                        )
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#80575f] transition hover:bg-[#f6e9eb]"
                >

                  <Minus
                    size={12}
                  />
                </button>

                <span className="min-w-[34px] text-center text-[9px] font-bold text-[#5b4147]">

                  {
                    quantity
                  }
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (
                        current
                      ) =>
                        Math.min(
                          Number(
                            product.stock ||
                              1
                          ),
                          current +
                            1
                        )
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#80575f] transition hover:bg-[#f6e9eb]"
                >

                  <Plus
                    size={12}
                  />
                </button>
              </div>

              <button
                type="button"
                disabled={
                  Number(
                    product.stock
                  ) < 1
                }
                onClick={
                  handleAddToCart
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#a9616e] px-5 py-3 text-[7px] font-bold uppercase tracking-[0.13em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#914f5c] disabled:cursor-not-allowed disabled:opacity-40"
              >

                {added ? (
                  <>
                    <Check
                      size={12}
                    />

                    Added
                  </>
                ) : (
                  <>
                    <ShoppingBag
                      size={12}
                    />

                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS */}

        <div className="border-t border-[#eadadd] bg-[#fff7f6] p-4 sm:p-5">

          <div className="grid gap-5 md:grid-cols-2">

            {/* REVIEW FORM */}

            <div>

              <p className="text-[6px] font-bold uppercase tracking-[0.17em] text-[#9f6974]">
                Your Experience
              </p>

              <h3 className="font-beauty mt-1 text-[21px] font-semibold text-[#5c3f46]">
                Leave a review
              </h3>

              <form
                onSubmit={
                  submitReview
                }
                className="mt-3 space-y-2.5"
              >

                <input
                  required
                  value={
                    form.name
                  }
                  onChange={(
                    event
                  ) =>
                    setForm({
                      ...form,

                      name:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Your name"
                  className="w-full rounded-[10px] border border-[#e4d5d7] bg-white px-3 py-2.5 text-[8px] text-[#5a4147] outline-none focus:border-[#ad6976]"
                />

                <div className="flex items-center gap-1 rounded-[10px] border border-[#e4d5d7] bg-white px-3 py-2.5">

                  {[
                    1,
                    2,
                    3,
                    4,
                    5,
                  ].map(
                    (
                      rating
                    ) => (

                      <button
                        key={
                          rating
                        }
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            rating,
                          })
                        }
                      >

                        <Star
                          size={14}
                          className={
                            rating <=
                            form.rating
                              ? "fill-[#d0a04b] text-[#d0a04b]"
                              : "text-[#ddd1d2]"
                          }
                        />
                      </button>
                    )
                  )}

                  <span className="ml-1 text-[7px] text-[#968287]">

                    {
                      form.rating
                    }
                    /5
                  </span>
                </div>

                <textarea
                  required
                  rows="3"
                  value={
                    form.comment
                  }
                  onChange={(
                    event
                  ) =>
                    setForm({
                      ...form,

                      comment:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Share your experience..."
                  className="w-full resize-none rounded-[10px] border border-[#e4d5d7] bg-white px-3 py-2.5 text-[8px] leading-4 text-[#5a4147] outline-none focus:border-[#ad6976]"
                />

                {reviewMutation.isError && (

                  <p className="rounded-[8px] bg-red-50 px-3 py-2 text-[7px] text-red-500">

                    {reviewMutation.error
                      ?.response
                      ?.data
                      ?.message ||
                      "Unable to add review."}
                  </p>
                )}

                {reviewMutation.isSuccess && (

                  <p className="flex items-center gap-1.5 rounded-[8px] bg-emerald-50 px-3 py-2 text-[7px] text-emerald-600">

                    <Check
                      size={10}
                    />

                    Review added.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    reviewMutation.isPending
                  }
                  className="rounded-full bg-[#a9616e] px-4 py-2.5 text-[7px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#914f5c] disabled:opacity-50"
                >

                  {reviewMutation.isPending
                    ? "Submitting..."
                    : "Submit Review"}
                </button>
              </form>
            </div>

            {/* REVIEW LIST */}

            <div>

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-[6px] font-bold uppercase tracking-[0.17em] text-[#9f6974]">
                    Customer Notes
                  </p>

                  <h3 className="font-beauty mt-1 text-[21px] font-semibold text-[#5c3f46]">
                    Reviews
                  </h3>
                </div>

                <span className="text-[7px] text-[#9b898d]">

                  {
                    reviews.length
                  }
                </span>
              </div>

              {reviewsLoading ? (

                <div className="mt-3 h-24 animate-pulse rounded-[13px] bg-[#efe4e4]" />

              ) : reviews.length ===
                0 ? (

                <div className="mt-3 rounded-[13px] border border-dashed border-[#dfcecf] bg-white px-4 py-7 text-center">

                  <Quote
                    size={16}
                    className="mx-auto text-[#b38b93]"
                  />

                  <p className="font-beauty mt-2 text-[16px] text-[#6b4c53]">
                    Be the first to review.
                  </p>
                </div>

              ) : (

                <div className="mt-3 max-h-[200px] space-y-2 overflow-y-auto pr-1">

                  {reviews.map(
                    (
                      review
                    ) => (

                      <article
                        key={
                          review.id
                        }
                        className="rounded-[12px] border border-[#e8dcdc] bg-white p-3"
                      >

                        <div className="flex items-start justify-between gap-2">

                          <div>

                            <p className="text-[8px] font-bold text-[#604249]">
                              {
                                review.name
                              }
                            </p>

                            <Stars
                              value={
                                review.rating
                              }
                              size={9}
                            />
                          </div>

                          <span className="text-[5px] text-[#ad9b9e]">

                            {new Date(
                              review.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="mt-2 text-[7px] leading-4 text-[#806b70]">
                          {
                            review.comment
                          }
                        </p>
                      </article>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   STARS
===================================================== */

function Stars({
  value,
  size = 10,
}) {
  const rating =
    Number(value) || 0;

  return (
    <div className="flex items-center gap-0.5">

      {Array.from({
        length: 5,
      }).map(
        (
          _,
          index
        ) => (

          <Star
            key={index}
            size={size}
            className={
              index <
              Math.round(
                rating
              )
                ? "fill-[#d0a04b] text-[#d0a04b]"
                : "text-[#ddd1d2]"
            }
          />
        )
      )}
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function SignatureSkeleton() {
  return (
    <section className="bg-gradient-to-br from-[#fffaf8] via-[#fbf2f1] to-[#f4e9ed] px-4 py-12 sm:px-6 lg:px-9 lg:py-16">

      <div className="mx-auto max-w-[1480px]">

        <div className="mx-auto h-8 w-[240px] animate-pulse rounded-xl bg-[#eadcdd] lg:mx-0" />

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_390px]">

          <div className="grid gap-4 sm:grid-cols-2">

            {Array.from({
              length: 4,
            }).map(
              (
                _,
                index
              ) => (

                <div
                  key={index}
                  className="h-[380px] animate-pulse rounded-[28px] bg-white/65"
                />
              )
            )}
          </div>

          <div className="min-h-[350px] animate-pulse rounded-[28px] bg-[#76525b]/25 sm:min-h-[420px] lg:h-[500px] lg:min-h-0 lg:self-center" />
        </div>
      </div>
    </section>
  );
}

export default SignatureShowcase;