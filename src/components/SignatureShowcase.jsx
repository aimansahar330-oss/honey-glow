import {
  useEffect,
  useRef,
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
  ChevronLeft,
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
import {
  useCart,
} from "../context/CartContext";
/* =====================================================
   YOUTUBE
===================================================== */
function getYouTubeId(url) {
  if (!url) {
    return null;
  }
  try {
    const parsed =
      new URL(url);
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
   MAIN
===================================================== */
function SignatureShowcase() {
  const timerRef =
    useRef(null);
  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);
  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);
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
  /* ===================================================
     FIXED VIDEO
  =================================================== */
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
  /* ===================================================
     CHANGE PRODUCT
  =================================================== */
  const changeProduct = (
    nextIndex
  ) => {
    if (
      products.length <= 1
    ) {
      return;
    }
    let safeIndex =
      nextIndex;
    if (
      safeIndex >=
      products.length
    ) {
      safeIndex = 0;
    }
    if (
      safeIndex < 0
    ) {
      safeIndex =
        products.length - 1;
    }
    setActiveIndex(
      safeIndex
    );
  };
  /* ===================================================
     AUTO SLIDE
  =================================================== */
  useEffect(() => {
    if (
      products.length <= 1
    ) {
      return;
    }
    clearInterval(
      timerRef.current
    );
    timerRef.current =
      setInterval(() => {
        setActiveIndex(
          (previous) =>
            (previous + 1) %
            products.length
        );
      }, 5000);
    return () => {
      clearInterval(
        timerRef.current
      );
    };
  }, [
    products.length,
  ]);
  useEffect(() => {
    if (
      products.length > 0 &&
      activeIndex >=
      products.length
    ) {
      setActiveIndex(0);
    }
  }, [
    products.length,
    activeIndex,
  ]);
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
  return (
    <>
      <section className="relative overflow-hidden border-y border-[#f0e1e2] bg-gradient-to-br from-[#fffaf8] via-[#fbf2f1] to-[#f4e9ed] px-4 py-12 sm:px-6 sm:py-16 lg:px-9 lg:py-20">
        {/* =================================================
            BACKGROUND DECOR
        ================================================= */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-[#efcdd1]/30 blur-[150px]" />
        <div className="pointer-events-none absolute -right-40 bottom-[-160px] h-[580px] w-[580px] rounded-full bg-[#e6d1e8]/26 blur-[160px]" />
        <div className="pointer-events-none absolute left-[48%] top-[35%] h-[380px] w-[380px] rounded-full bg-[#dbe9ed]/24 blur-[140px]" />
        <div className="relative mx-auto max-w-[1480px] lg:[zoom:0.80]">
          {/* =================================================
              HEADER
          ================================================= */}
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#ead8da] bg-white text-[#a75f6c] shadow-sm">
                  <Crown
                    size={13}
                  />
                </span>
                <p className="text-[7px] font-bold uppercase tracking-[0.24em] text-[#a9737c] sm:text-[8px]">
                  KM  Signature
                </p>
              </div>
              <h2 className="font-beauty mt-3 text-[34px] font-semibold leading-[0.94] tracking-[-0.04em] text-[#53383f] sm:text-[44px] lg:text-[50px]">
                KM Cares
                <span className="ml-2 text-[#b96f7c]">
                  Special Signature Collection
                </span>
              </h2>
              <p className="mt-3 max-w-[470px] text-[8px] leading-5 text-[#907c81] sm:text-[9px]">
                Discover KM Cares&apos;s most special beauty essentials.
              </p>
              <h2 className="font-beauty mt-3 text-[34px] font-semibold leading-[0.94] tracking-[-0.04em] text-[#53383f] sm:text-[44px] lg:text-[50px]">
                Zafrani Cream
              </h2>
            </div>
            <Link
              to="/signature-collection"
              className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#dfc7cb] bg-white px-5 py-3 text-[8px] font-bold uppercase tracking-[0.15em] text-[#75434d] shadow-[0_10px_30px_rgba(101,68,75,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#a9616e] hover:bg-[#803a47] hover:text-white"
            >
              View All Signature
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3e4e6] text-[#9f5967] transition duration-300 group-hover:translate-x-1 group-hover:bg-white/15 group-hover:text-white">
                <ChevronRight size={11} />
              </span>
            </Link>

          </div>
          {/* =================================================
    MAIN LAYOUT
    PRODUCT = 60%
    VIDEO   = 40%
    BOTH    = 600PX HEIGHT
================================================= */}
          <div className="grid items-stretch gap-5 lg:grid-cols-[3fr_2fr]">
            {/* =================================================
      LEFT PRODUCT PANEL
  ================================================= */}
            <div className="flex min-h-[620px] flex-col overflow-hidden rounded-[32px] border border-[#eadcdd] bg-[#fffdfb] shadow-[0_30px_80px_rgba(101,68,75,0.12)] lg:h-[600px] lg:min-h-0">
              {/* =============================================
        MAIN SLIDER
        Remaining height automatically use karega
    ============================================= */}
              <div className="relative min-h-[500px] flex-1 overflow-hidden lg:min-h-0">
                {/* BACKGROUND */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fbf4f3] via-[#fffaf8] to-[#f3e9ed]" />
                <div className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[#e7bac2]/25 blur-[90px]" />
                <div className="pointer-events-none absolute -right-28 bottom-[-60px] h-80 w-80 rounded-full bg-[#cddfe7]/28 blur-[100px]" />
                {/* BIG INDEX */}
                <div className="pointer-events-none absolute left-5 top-4 font-beauty text-[105px] font-bold leading-none text-[#8e6870]/[0.04] sm:text-[145px]">
                  0{activeIndex + 1}
                </div>
                {/* =============================================
          PRODUCT CARDS
      ============================================= */}
                {products.map((product, index) => {
                  const position =
                    getCardPosition(
                      index,
                      activeIndex,
                      products.length
                    );
                  return (
                    <div
                      key={product.id}
                      className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 py-3"
                    >
                      <AnimatedProductCard
                        product={product}
                        position={position}
                        onClick={() => {
                          if (position === "active") {
                            setSelectedProduct(product);
                            return;
                          }
                          setActiveIndex(index);
                        }}
                      />
                    </div>
                  );
                })}
                {/* LEFT ARROW */}
                <button
                  type="button"
                  onClick={() =>
                    changeProduct(
                      activeIndex - 1
                    )
                  }
                  className="absolute left-2 top-[110px] z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#e7d5d8] bg-[#fffaf8]/95 text-[#89565f] shadow-[0_5px_16px_rgba(120,76,84,0.14)] transition duration-300 hover:bg-[#a9616e] hover:text-white sm:left-3 sm:top-1/2 sm:h-9 sm:w-9"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-[14px] sm:w-[14px]" strokeWidth={2} />
                </button>
                {/* RIGHT ARROW */}
                <button
                  type="button"
                  onClick={() =>
                    changeProduct(
                      activeIndex + 1
                    )
                  }
                  className="absolute right-2 top-[110px] z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#e7d5d8] bg-[#fffaf8]/95 text-[#89565f] shadow-[0_5px_16px_rgba(120,76,84,0.14)] transition duration-300 hover:bg-[#a9616e] hover:text-white sm:right-3 sm:top-1/2 sm:h-9 sm:w-9"
                >
                  <ChevronRight className="h-4 w-4 sm:h-[14px] sm:w-[14px]" strokeWidth={2} />
                </button>
                {/* COUNTER */}
                <div className="absolute bottom-3 left-5 z-50 flex items-center gap-2">
                  <span className="text-[7px] font-bold tracking-[0.14em] text-[#a85f6b]">
                    0{activeIndex + 1}
                  </span>
                  <span className="h-px w-7 bg-[#8c6f74]/20" />
                  <span className="text-[6px] tracking-[0.14em] text-[#8c6f74]/55">
                    0{products.length}
                  </span>
                </div>
              </div>
              {/* =============================================
        SMALL RELATED PRODUCT IMAGES
        Fixed compact height.
        Is wajah se slider properly remaining
        height le ga.
    ============================================= */}
              <div className="relative z-50 shrink-0 border-t border-[#efe2e2] bg-[#fffaf8] px-4 py-2 sm:px-5 lg:h-[80px]">
                <div className="flex h-full items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {products.map((product, index) => (
                    <SignatureMiniCard
                      key={product.id}
                      product={product}
                      active={
                        index === activeIndex
                      }
                      onClick={() =>
                        setActiveIndex(index)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* =================================================
      RIGHT VIDEO
      EXACT SAME HEIGHT AS PRODUCT PANEL
  ================================================= */}
            <div className="relative min-h-[450px] overflow-hidden rounded-[32px] border border-[#eadadd] bg-[#563d45] shadow-[0_30px_80px_rgba(74,54,61,0.18)] lg:h-[600px] lg:min-h-0">
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1`}
                  title="KM Signature Video"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#a76b77] via-[#79505a] to-[#50383f] p-7 text-center">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#69454e] text-white">
                      <Play size={18} />
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
              {/* VIDEO OVERLAYS */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#453039]/90 to-transparent" />
              <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/15 bg-[#3d2930]/70 px-3 py-1.5">
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
        </div>
      </section>
      {/* =================================================
          DETAIL MODAL
      ================================================= */}
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
   CARD POSITION
===================================================== */
function getCardPosition(
  index,
  activeIndex,
  length
) {
  if (
    index ===
    activeIndex
  ) {
    return "active";
  }
  const next =
    (activeIndex + 1) %
    length;
  const previous =
    (
      activeIndex -
      1 +
      length
    ) %
    length;
  if (
    index === next
  ) {
    return "next";
  }
  if (
    index === previous
  ) {
    return "previous";
  }
  return "hidden";
}
/* =====================================================
   BIG PREMIUM CARD
===================================================== */
function AnimatedProductCard({
  product,
  position,
  onClick,
}) {
  const image =
    product.images?.[0]
      ?.imageUrl;
  const finalPrice =
    product.discountPrice ??
    product.originalPrice;
  const isActive =
    position === "active";
  const positionStyles = {
    active:
      "z-30 translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100",
    next:
      "z-20 translate-x-[55%] translate-y-4 rotate-[5deg] scale-[0.84] opacity-28",
    previous:
      "z-20 -translate-x-[55%] translate-y-4 -rotate-[5deg] scale-[0.84] opacity-22",
    hidden:
      "z-0 translate-y-12 scale-[0.72] opacity-0",
  };
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={
        onClick
      }
      onKeyDown={(
        event
      ) => {
        if (
          event.key ===
          "Enter" ||
          event.key === " "
        ) {
          onClick();
        }
      }}
      className={`pointer-events-auto relative h-auto w-[96%] max-w-[850px] cursor-pointer text-left outline-none transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[94%] ${positionStyles[position]}`}
    >
      {/* =====================================
          ACTIVE COLOR BORDER
      ===================================== */}
      <div
        className={`pointer-events-none absolute -inset-[3px] overflow-hidden rounded-[34px] transition-opacity duration-500 ${isActive
          ? "opacity-100"
          : "opacity-0"
          }`}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, #b75f70 40deg, #d99b74 90deg, #669fb4 145deg, #b68ac1 200deg, transparent 235deg, #d87e8d 285deg, #b75f70 340deg, transparent 360deg)",
          }}
        />
      </div>
      {/* ACTIVE GLOW */}
      <div
        className={`pointer-events-none absolute -inset-6 -z-10 rounded-[44px] bg-gradient-to-r from-[#d38692]/22 via-[#d9a478]/18 to-[#7ca8b8]/18 blur-2xl transition-all duration-700 ${isActive
          ? "scale-100 opacity-100"
          : "scale-90 opacity-0"
          }`}
      />
      {/* =====================================
          CARD
      ===================================== */}
      <div className="relative z-10 h-auto overflow-hidden rounded-[31px] border border-[#f0e3e3] bg-[#fffdfb] shadow-[0_32px_85px_rgba(101,68,74,0.18)] sm:h-full">
        <div className="grid h-auto sm:h-full sm:grid-cols-[1.08fr_0.92fr]">
          {/* =================================
              FULL IMAGE
          ================================= */}
          <div className="relative h-[190px] overflow-hidden rounded-b-[30px] bg-[#63a7be] sm:h-full sm:rounded-b-none sm:rounded-r-[36px]">
            {image ? (
              <img
                src={
                  image
                }
                alt={
                  product.name
                }
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#86c8d6] via-[#5aa5bd] to-[#3e849d]" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#244b59]/25 via-transparent to-transparent" />
            {/* DECOR */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full border-[34px] border-white/[0.09]" />
            <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-white/[0.08]" />
            {/* BADGE */}
            {product.isPrimary && (
              <span className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-white/25 bg-[#275c6c]/70 px-3 py-1.5 text-[5px] font-bold uppercase tracking-[0.15em] text-white">
                <Sparkles
                  size={8}
                />
                Signature
              </span>
            )}
            {/* BOTTOM LABEL */}
            <div className="absolute bottom-4 left-4 right-4 rounded-[12px] border border-white/20 bg-[#245365]/60 px-3.5 py-2.5">
              <p className="text-[5px] font-bold uppercase tracking-[0.18em] text-white">
                KM Cares Signature Collection
              </p>
            </div>
          </div>
          {/* =================================
              DETAILS
          ================================= */}
          <div className="flex h-auto min-w-0 flex-col justify-center bg-[#fffaf7] p-3.5 sm:h-full sm:p-8">
            <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#aa8f94]">
              Code HG-
              {String(
                product.id
              ).padStart(
                4,
                "0"
              )}
            </p>
            {/* NAME */}
            <h3 className="font-beauty mt-1.5 text-[24px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#553840] sm:mt-2 sm:text-[34px]">
              {
                product.name
              }
            </h3>
            {/* RATING */}
            <div className="mt-2 sm:mt-3">
              <CardRating
                productId={
                  product.id
                }
              />
            </div>
            {/* DIVIDER */}
            <div className="mt-3 h-px w-full bg-gradient-to-r from-[#a3787d] via-[#ecd8ce] to-transparent sm:mt-5" />
            {/* PRICE */}
            <div className="mt-3 sm:mt-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#a18c91]">
                Signature Price
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                <span className="text-[21px] font-black text-[#88424f] sm:text-[27px]">
                  Rs.{" "}
                  {Number(
                    finalPrice
                  ).toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span className="text-[12px] text-[#b39fa3] line-through">
                    Rs.{" "}
                    {Number(
                      product.originalPrice
                    ).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            {/* STOCK */}
            <div className="mt-2 flex items-center gap-2 sm:mt-3">
              <span
                className={`h-1.5 w-1.5 rounded-full ${Number(
                  product.stock
                ) > 0
                  ? "bg-emerald-500"
                  : "bg-red-400"
                  }`}
              />
              <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#968388]">
                {Number(
                  product.stock
                ) > 0
                  ? `${product.stock} Available`
                  : "Out of stock"}
              </span>
            </div>
            {/* DISCOUNT */}
            {Number(
              product.discountPercent
            ) > 0 && (
                <span className="mt-2 w-fit rounded-full border border-[#e1c7a3] bg-[#f6eada] px-2.5 py-1 text-[9px] font-bold text-[#9c7443] sm:mt-3">
                  {
                    product.discountPercent
                  }
                  % OFF
                </span>
              )}
            {/* =================================
                SHOP NOW
                WEBSITE COLOR
                NO WHITE BLUR
            ================================= */}
            <div
              className={`mt-4 transition-all duration-500 sm:mt-7 ${isActive
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
                }`}
            >
              <button
                type="button"
                onClick={(
                  event
                ) => {
                  event.stopPropagation();
                  onClick();
                }}
                className="group inline-flex items-center gap-3 rounded-full bg-[#803a47] px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_24px_rgba(169,97,110,0.20)] transition duration-300 hover:-translate-y-1 hover:bg-[#914f5c] sm:py-3"
              >
                <ShoppingBag
                  size={12}
                />
                Shop Now
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#bd7b86] transition duration-500 group-hover:translate-x-1.5">
                  <ChevronRight
                    size={11}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
/* =====================================================
   SMALL RELATED PRODUCT IMAGE
===================================================== */
function SignatureMiniCard({
  product,
  active,
  onClick,
}) {
  const image =
    product.images?.[0]
      ?.imageUrl;
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      aria-label={
        product.name
      }
      className={`group relative h-[54px] w-[54px] shrink-0 transition-all duration-500 sm:h-[60px] sm:w-[60px] ${active
        ? "-translate-y-0.5 scale-[1.05]"
        : "opacity-65 hover:opacity-100"
        }`}
    >
      {/* ACTIVE BORDER */}
      <div
        className={`pointer-events-none absolute -inset-[2px] overflow-hidden rounded-[13px] transition-opacity duration-500 ${active
          ? "opacity-100"
          : "opacity-0"
          }`}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, #aa5f6c, #d19a72, #589bb0, #af82bb, #d97d8c, #aa5f6c)",
          }}
        />
      </div>
      {/* IMAGE */}
      <div
        className={`relative z-10 h-full w-full overflow-hidden rounded-[12px] border bg-[#f4e7e5] ${active
          ? "border-transparent shadow-[0_7px_20px_rgba(151,91,102,0.18)]"
          : "border-[#eadada]"
          }`}
      >
        {image ? (
          <img
            src={
              image
            }
            alt={
              product.name
            }
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#85c5d4] to-[#4c91aa]" />
        )}
        {/* ACTIVE DOT */}
        {active && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow">
            <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-[#a9616e]/30" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[#a9616e]" />
          </span>
        )}
      </div>
    </button>
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
        size={
          11
        }
      />
      <span className="text-[7px] font-semibold text-[#8e7379]">
        {rating > 0
          ? rating.toFixed(
            1
          )
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
  /* ===================================================
     CART
  =================================================== */
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
  /* ===================================================
     REVIEW
  =================================================== */
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
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-[#4b383e]/45 p-3 backdrop-blur-md">
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
        {/* =================================================
            PRODUCT
        ================================================= */}
        <div className="grid sm:grid-cols-[0.88fr_1.12fr]">
          {/* IMAGE */}
          <div className="border-b border-[#e8dadd] bg-gradient-to-br from-[#d7edf3] via-[#93cad8] to-[#5ba0b5] p-4 sm:border-b-0 sm:border-r">
            <div className="flex min-h-[260px] items-center justify-center overflow-hidden rounded-[18px] bg-white/20">
              {activeImage ? (
                <img
                  src={
                    activeImage
                  }
                  alt={
                    product.name
                  }
                  className="max-h-[250px] w-[90%] object-contain p-2"
                />
              ) : null}
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
                        className={`h-10 w-10 shrink-0 overflow-hidden rounded-[9px] border bg-white ${activeImage ===
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
            {/* RATING */}
            <div className="mt-3 flex items-center gap-2">
              <Stars
                value={
                  reviewData?.averageRating ||
                  0
                }
              />
              <span className="text-[7px] text-[#987f84]">
                {Number(
                  reviewData?.averageRating ||
                  0
                ).toFixed(
                  1
                )}{" "}
                (
                {reviewData?.reviewCount ||
                  0}
                )
              </span>
            </div>
            {/* DESCRIPTION ONLY MODAL */}
            <p className="mt-4 text-[9px] leading-5 text-[#7e686d]">
              {product.shortDescription ||
                "A premium KM Cares signature essential created for your beauty ritual."}
            </p>
            {/* PRICE */}
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
            {/* STOCK */}
            <div className="mt-3 flex items-center gap-2 text-[7px] text-[#917c80]">
              <span
                className={`h-1.5 w-1.5 rounded-full ${Number(
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
            {/* QUANTITY + ADD TO CART */}
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
        {/* =================================================
            REVIEWS
        ================================================= */}
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
                        event
                          .target
                          .value,
                    })
                  }
                  placeholder="Your name"
                  className="w-full rounded-[10px] border border-[#e4d5d7] bg-white px-3 py-2.5 text-[8px] text-[#5a4147] outline-none focus:border-[#ad6976]"
                />
                {/* STARS */}
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
                          size={
                            14
                          }
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
                        event
                          .target
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
                              size={
                                9
                              }
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
            key={
              index
            }
            size={
              size
            }
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
    <section className="bg-gradient-to-br from-[#fffaf8] via-[#fbf2f1] to-[#f4e9ed] px-4 py-16 sm:px-6 lg:px-9">
      <div className="mx-auto max-w-[1480px]">
        <div className="h-9 w-[260px] animate-pulse rounded-xl bg-[#eadcdd]" />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.48fr_0.52fr]">
          <div className="h-[650px] animate-pulse rounded-[32px] bg-white/60" />
          <div className="h-[515px] animate-pulse rounded-[28px] bg-[#76525b]/25" />
        </div>
      </div>
    </section>
  );
}
export default SignatureShowcase;