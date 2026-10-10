import { useState } from "react";
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
   MAIN
===================================================== */

function SignatureCollection() {
  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["signature-products"],
    queryFn: getSignatureProducts,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const products =
    Array.isArray(data)
      ? data
      : [];

  if (isLoading) {
    return (
      <SignatureCollectionSkeleton />
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fffaf8] px-4">
        <div className="text-center">
          <h2 className="font-beauty text-[30px] font-semibold text-[#573b42]">
            Signature Collection
          </h2>

          <p className="mt-2 text-[9px] text-[#987f85]">
            Unable to load signature products.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>{`
        @keyframes signatureCollectionBorder {
          0%, 100% {
            filter: saturate(1) brightness(.9);
          }

          50% {
            filter: saturate(1.4) brightness(1.12);
          }
        }

        @keyframes signatureCollectionFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes signatureCollectionImage {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.025);
          }
        }

        @keyframes signatureCollectionSweep {
          0% {
            left: -80%;
            opacity: 0;
          }

          20% {
            opacity: 0;
          }

          30% {
            opacity: .6;
          }

          52% {
            left: 135%;
            opacity: 0;
          }

          100% {
            left: 135%;
            opacity: 0;
          }
        }

        @keyframes signatureCollectionGlow {
          0%, 100% {
            opacity: .2;
            transform: scale(.97);
          }

          50% {
            opacity: .5;
            transform: scale(1.025);
          }
        }

        @keyframes signatureCollectionTwinkle {
          0%, 100% {
            opacity: .2;
            transform: scale(.7) rotate(0deg);
          }

          50% {
            opacity: 1;
            transform: scale(1.15) rotate(18deg);
          }
        }

        @keyframes signatureCollectionName {
          0% {
            background-position: 220% center;
          }

          100% {
            background-position: -220% center;
          }
        }

        .signature-collection-border {
          animation:
            signatureCollectionBorder
            4s ease-in-out infinite;
        }

        .signature-collection-card {
          animation:
            signatureCollectionFloat
            7s ease-in-out infinite;
        }

        .signature-collection-image {
          animation:
            signatureCollectionImage
            9s ease-in-out infinite;
        }

        .signature-collection-sweep {
          animation:
            signatureCollectionSweep
            6s ease-in-out infinite;
        }

        .signature-collection-glow {
          animation:
            signatureCollectionGlow
            5s ease-in-out infinite;
        }

        .signature-collection-twinkle {
          animation:
            signatureCollectionTwinkle
            2.8s ease-in-out infinite;
        }

        .signature-collection-name {
          background:
            linear-gradient(
              100deg,
              #4e3038 0%,
              #4e3038 34%,
              #8d3048 50%,
              #4e3038 66%,
              #4e3038 100%
            );

          background-size: 250% auto;

          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;

          animation:
            signatureCollectionName
            6s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .signature-collection-border,
          .signature-collection-card,
          .signature-collection-image,
          .signature-collection-sweep,
          .signature-collection-glow,
          .signature-collection-twinkle,
          .signature-collection-name {
            animation: none !important;
          }
        }
      `}</style>

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fbf4f3] to-[#fffaf8]">

        {/* =================================================
            HEADING
        ================================================= */}

        <section className="border-b border-[#eddddf] bg-[#fffaf8] px-4 py-7 sm:px-6 sm:py-9 lg:px-9">

          <div className="mx-auto max-w-[1400px] text-center">

            <div className="flex items-center justify-center gap-2">

              <Crown
                size={11}
                className="text-[#84384b]"
              />

              <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-[#9a5a67] sm:text-[8px]">
                KM Cares Signature
              </p>
            </div>

            <h1 className="font-beauty mt-2 text-[31px] font-semibold tracking-[-0.04em] text-[#53383f] sm:text-[39px] lg:text-[45px]">

              Signature

              <span className="ml-2 text-[#8e3549]">
                Collection
              </span>
            </h1>

            <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#78283c] to-transparent" />
          </div>
        </section>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <section className="relative overflow-hidden px-4 py-9 sm:px-6 lg:px-9 lg:py-12">

          <div className="pointer-events-none absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-[#eccbd0]/20 blur-[150px]" />

          <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#e0d3e8]/20 blur-[150px]" />

          <div className="relative mx-auto max-w-[1400px]">

            {products.length === 0 ? (

              <div className="rounded-[26px] border border-dashed border-[#dfced1] bg-white px-6 py-16 text-center">

                <Crown
                  size={22}
                  className="mx-auto text-[#b17984]"
                />

                <h2 className="font-beauty mt-3 text-[28px] font-semibold text-[#573b42]">
                  Collection coming soon.
                </h2>
              </div>

            ) : (

              <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {products.map(
                  (
                    product,
                    index
                  ) => (

                    <SignatureProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      onOpen={() =>
                        setSelectedProduct(
                          product
                        )
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* =================================================
          DETAIL MODAL
      ================================================= */}

      {selectedProduct && (

        <SignatureDetailModal
          product={selectedProduct}
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
   COMPACT SAME SIZE CARD
===================================================== */

function SignatureProductCard({
  product,
  index,
  onOpen,
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
      product.originalPrice || 0
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
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          onOpen();
        }
      }}
      style={{
        animationDelay:
          `${index * 0.45}s`,
      }}
      className="signature-collection-card group relative h-[360px] w-full cursor-pointer rounded-[27px] p-[2px] outline-none sm:h-[375px]"
    >

      {/* GLOW */}

      <div className="signature-collection-glow pointer-events-none absolute -inset-4 -z-10 rounded-[36px] bg-gradient-to-r from-[#702238]/22 via-[#a16825]/14 to-[#235d6c]/20 blur-2xl" />

      {/* DEEP BORDER */}

      <div className="signature-collection-border pointer-events-none absolute inset-0 overflow-hidden rounded-[27px] bg-[#531727]">

        <div
          className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_5s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, #3f0d1b 0deg, #961f42 40deg, #d09a37 80deg, #6b3277 120deg, #176276 165deg, #0f4353 205deg, #823263 245deg, #bd4d37 286deg, #951d3c 326deg, #3f0d1b 360deg)",
          }}
        />
      </div>

      {/* BODY */}

      <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-[25px] border border-white/60 bg-[#fffdfb] shadow-[0_18px_50px_rgba(73,31,42,0.14)]">

        {/* LIGHT SWEEP */}

        <div
          className="signature-collection-sweep pointer-events-none absolute top-0 z-50 h-full w-[30%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            animationDelay:
              `${index * 0.8}s`,
          }}
        />

        {/* IMAGE */}

        <div className="relative h-[165px] shrink-0 overflow-hidden bg-gradient-to-br from-[#f3e7e7] via-[#fff8f4] to-[#e8e1e9] sm:h-[180px]">

          {image ? (

            <img
              src={image}
              alt={product.name}
              className="signature-collection-image h-full w-full object-cover"
              style={{
                animationDelay:
                  `${index * 0.7}s`,
              }}
            />

          ) : (

            <div className="h-full w-full bg-gradient-to-br from-[#e9cfd4] via-[#fff8f4] to-[#d9e5e8]" />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#391923]/35 via-transparent to-transparent" />

          {/* BADGE */}

          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/30 bg-[#541a2b]/85 px-2.5 py-1.5 text-[5px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">

            <Sparkles
              size={8}
            />

            Signature
          </span>

          {/* DISCOUNT */}

          {discountPercent > 0 && (

            <span className="absolute right-3 top-3 rounded-full border border-[#eccb91]/45 bg-[#7b273c]/90 px-2.5 py-1.5 text-[5px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-md">

              {discountPercent}% Off
            </span>
          )}
        </div>

        {/* DETAILS */}

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3">

          {/* CODE */}

          <div className="flex items-center justify-between">

            <p className="text-[5px] font-bold uppercase tracking-[0.16em] text-[#94767c]">

              KM-
              {String(
                product.id
              ).padStart(
                4,
                "0"
              )}
            </p>

            <Sparkles
              size={8}
              className="signature-collection-twinkle text-[#84384b]"
            />
          </div>

          {/* FIXED TITLE HEIGHT */}

          <h2 className="signature-collection-name mt-1 line-clamp-2 h-[42px] overflow-hidden font-beauty text-[21px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[23px]">

            {product.name}
          </h2>

          {/* STARS ONLY */}

          <div className="mt-1.5 h-[12px]">

            <CardRating
              productId={
                product.id
              }
            />
          </div>

          {/* PRICE + STOCK */}

          <div className="mt-2 flex items-end justify-between gap-2">

            <div>

              <span className="text-[17px] font-black text-[#71283a] sm:text-[18px]">

                Rs.{" "}

                {Number(
                  finalPrice
                ).toLocaleString()}
              </span>

              {product.discountPrice && (

                <span className="ml-1.5 text-[7px] text-[#b39fa3] line-through">

                  Rs.{" "}

                  {Number(
                    product.originalPrice
                  ).toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5 pb-0.5">

              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  stock > 0
                    ? "bg-emerald-500"
                    : "bg-red-400"
                }`}
              />

              <span className="text-[5px] font-bold uppercase tracking-[0.08em] text-[#8d797e]">

                {stock > 0
                  ? "In Stock"
                  : "Sold Out"}
              </span>
            </div>
          </div>

          {/* BUTTON ALWAYS SAME POSITION */}

          <div className="mt-auto pt-2.5">

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpen();
              }}
              className="group/button relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#632437] px-4 py-2.5 text-[6px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_24px_rgba(84,25,40,0.20)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#4e1929]"
            >

              <span className="signature-collection-sweep pointer-events-none absolute top-0 h-full w-[30%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <ShoppingBag
                size={10}
                className="relative"
              />

              <span className="relative">
                Shop Now
              </span>

              <ChevronRight
                size={9}
                className="relative transition duration-300 group-hover/button:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   STARS ONLY ON CARD
===================================================== */

function CardRating({
  productId,
}) {
  const { data } = useQuery({
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
      data?.averageRating || 0
    );

  return (
    <Stars
      value={rating}
      size={10}
    />
  );
}

/* =====================================================
   MODAL
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

  const stock =
    Number(
      product.stock || 0
    );

  const handleAddToCart =
    () => {
      if (stock < 1) {
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
      className="fixed inset-0 z-[180] flex items-center justify-center bg-[#351b24]/55 p-3 backdrop-blur-md"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="max-h-[92vh] w-full max-w-[820px] overflow-y-auto rounded-[26px] border border-[#d9c1c6] bg-[#fffaf8] shadow-[0_40px_130px_rgba(57,24,34,0.35)]">

        {/* HEADER */}

        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#eadcdf] bg-[#fffaf8]/95 px-4 py-3 backdrop-blur-xl sm:px-5">

          <div>

            <p className="text-[6px] font-bold uppercase tracking-[0.18em] text-[#8b4051]">
              KM Cares Signature
            </p>

            <p className="font-beauty mt-0.5 text-[19px] font-semibold text-[#593b42]">
              Product Detail
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbc5ca] bg-white text-[#742d40] transition duration-300 hover:rotate-90 hover:bg-[#632437] hover:text-white"
          >

            <X size={14} />
          </button>
        </div>

        {/* PRODUCT */}

        <div className="grid md:grid-cols-[0.9fr_1.1fr]">

          {/* IMAGES */}

          <div className="relative border-b border-[#e4d5d8] bg-gradient-to-br from-[#eee0e4] via-[#fff6f2] to-[#dbe8eb] p-4 md:border-b-0 md:border-r">

            <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-[20px] border border-white/50 bg-white/25">

              {activeImage && (

                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-h-[290px] w-[94%] object-contain p-3"
                />
              )}
            </div>

            {/* MULTIPLE IMAGES */}

            {product.images?.length >
              1 && (

              <div className="mt-3 flex gap-2 overflow-x-auto">

                {product.images.map(
                  (image) => (

                    <button
                      key={image.id}
                      type="button"
                      onClick={() =>
                        setActiveImage(
                          image.imageUrl
                        )
                      }
                      className={`h-12 w-12 shrink-0 overflow-hidden rounded-[10px] border bg-white ${
                        activeImage ===
                        image.imageUrl
                          ? "border-[#70283b]"
                          : "border-[#ddd0d3]"
                      }`}
                    >

                      <img
                        src={image.imageUrl}
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

            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#dfc4ca] bg-[#f4e8ea] px-2.5 py-1.5">

              <Crown
                size={9}
                className="text-[#7b2c40]"
              />

              <span className="text-[6px] font-bold uppercase tracking-[0.14em] text-[#7b2c40]">
                Signature Essential
              </span>
            </div>

            <h2 className="font-beauty mt-3 text-[31px] font-semibold leading-[0.98] text-[#52343c] sm:text-[36px]">

              {product.name}
            </h2>

            {/* MODAL RATING */}

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

                {" "}(
                {reviewData
                  ?.reviewCount ||
                  0}
                )
              </span>
            </div>

            {/* DESCRIPTION ONLY HERE */}

            <p className="mt-4 text-[9px] leading-5 text-[#7e686d]">

              {product.shortDescription ||
                "A premium KM Cares signature essential created for your beauty ritual."}
            </p>

            <div className="mt-5 h-px bg-gradient-to-r from-[#7d3144]/45 via-[#e4d1d5] to-transparent" />

            {/* PRICE */}

            <div className="mt-5">

              <p className="text-[6px] font-bold uppercase tracking-[0.15em] text-[#9c858a]">
                Signature Price
              </p>

              <div className="mt-1.5 flex items-center gap-2">

                <span className="text-[22px] font-black text-[#71283a]">

                  Rs.{" "}

                  {Number(
                    finalPrice
                  ).toLocaleString()}
                </span>

                {product.discountPrice && (

                  <span className="text-[9px] text-[#b19da1] line-through">

                    Rs.{" "}

                    {Number(
                      product.originalPrice
                    ).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* STOCK */}

            <div className="mt-3 flex items-center gap-2 text-[7px] text-[#917c80]">

              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  stock > 0
                    ? "bg-emerald-500"
                    : "bg-red-400"
                }`}
              />

              {stock > 0
                ? `${stock} available`
                : "Out of stock"}
            </div>

            {/* QUANTITY + CART */}

            <div className="mt-6 flex flex-wrap items-center gap-3">

              <div className="flex items-center rounded-full border border-[#ddc8cd] bg-white p-1">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        Math.max(
                          1,
                          current - 1
                        )
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#6d3542] hover:bg-[#f4e7e9]"
                >

                  <Minus size={12} />
                </button>

                <span className="min-w-[38px] text-center text-[9px] font-bold">

                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        Math.min(
                          Math.max(
                            stock,
                            1
                          ),
                          current + 1
                        )
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#6d3542] hover:bg-[#f4e7e9]"
                >

                  <Plus size={12} />
                </button>
              </div>

              <button
                type="button"
                disabled={
                  stock < 1
                }
                onClick={
                  handleAddToCart
                }
                className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-[7px] font-bold uppercase tracking-[0.14em] text-white ${
                  added
                    ? "bg-emerald-500"
                    : "bg-[#632437] hover:bg-[#4e1929]"
                } disabled:opacity-40`}
              >

                {added ? (
                  <>
                    <Check size={12} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={12} />
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

        <div className="border-t border-[#e4d5d8] bg-[#fff7f6] p-4 sm:p-5">

          <div className="grid gap-6 md:grid-cols-2">

            {/* FORM */}

            <div>

              <p className="text-[6px] font-bold uppercase tracking-[0.17em] text-[#8a4051]">
                Your Experience
              </p>

              <h3 className="font-beauty mt-1 text-[22px] font-semibold text-[#51343c]">
                Leave a review
              </h3>

              <form
                onSubmit={submitReview}
                className="mt-4 space-y-3"
              >

                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Your name"
                  className="w-full rounded-[12px] border border-[#e1d0d4] bg-white px-3.5 py-3 text-[8px] outline-none focus:border-[#7b3043]"
                />

                <div className="flex items-center gap-1 rounded-[12px] border border-[#e1d0d4] bg-white px-3.5 py-3">

                  {[1, 2, 3, 4, 5].map(
                    (rating) => (

                      <button
                        key={rating}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            rating,
                          })
                        }
                      >

                        <Star
                          size={15}
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
                </div>

                <textarea
                  required
                  rows="4"
                  value={form.comment}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      comment:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Share your experience..."
                  className="w-full resize-none rounded-[12px] border border-[#e1d0d4] bg-white px-3.5 py-3 text-[8px] outline-none focus:border-[#7b3043]"
                />

                {reviewMutation.isError && (

                  <p className="rounded-[9px] bg-red-50 px-3 py-2 text-[7px] text-red-500">

                    {reviewMutation.error
                      ?.response
                      ?.data
                      ?.message ||
                      "Unable to add review."}
                  </p>
                )}

                {reviewMutation.isSuccess && (

                  <p className="flex items-center gap-1.5 rounded-[9px] bg-emerald-50 px-3 py-2 text-[7px] text-emerald-600">

                    <Check size={10} />

                    Review added successfully.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    reviewMutation.isPending
                  }
                  className="rounded-full bg-[#632437] px-5 py-3 text-[7px] font-bold uppercase tracking-[0.13em] text-white hover:bg-[#4e1929] disabled:opacity-50"
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

                  <p className="text-[6px] font-bold uppercase tracking-[0.17em] text-[#8a4051]">
                    Customer Notes
                  </p>

                  <h3 className="font-beauty mt-1 text-[22px] font-semibold text-[#51343c]">
                    Reviews
                  </h3>
                </div>

                <span className="text-[7px] text-[#9b898d]">

                  {reviews.length}
                </span>
              </div>

              {reviewsLoading ? (

                <div className="mt-4 h-24 animate-pulse rounded-[13px] bg-[#efe4e4]" />

              ) : reviews.length ===
                0 ? (

                <div className="mt-4 rounded-[14px] border border-dashed border-[#dbc5ca] bg-white px-4 py-8 text-center">

                  <Quote
                    size={18}
                    className="mx-auto text-[#9b6672]"
                  />

                  <p className="font-beauty mt-2 text-[17px] text-[#6b4c53]">
                    Be the first to review.
                  </p>
                </div>

              ) : (

                <div className="mt-4 max-h-[270px] space-y-2.5 overflow-y-auto pr-1">

                  {reviews.map(
                    (review) => (

                      <article
                        key={review.id}
                        className="rounded-[13px] border border-[#e3d4d7] bg-white p-3.5"
                      >

                        <div className="flex items-start justify-between gap-2">

                          <div>

                            <p className="text-[8px] font-bold text-[#5b3c44]">

                              {review.name}
                            </p>

                            <div className="mt-1">

                              <Stars
                                value={
                                  review.rating
                                }
                                size={9}
                              />
                            </div>
                          </div>

                          <span className="text-[5px] text-[#ad9b9e]">

                            {new Date(
                              review.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="mt-2.5 text-[7px] leading-4 text-[#806b70]">

                          {review.comment}
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
        (_, index) => (

          <Star
            key={index}
            size={size}
            className={
              index <
              Math.round(rating)
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

function SignatureCollectionSkeleton() {
  return (
    <main className="min-h-screen bg-[#fffaf8]">

      <section className="border-b border-[#eddddf] px-4 py-8">

        <div className="mx-auto max-w-[1400px]">

          <div className="mx-auto h-4 w-32 animate-pulse rounded-full bg-[#efe2e4]" />

          <div className="mx-auto mt-3 h-10 w-72 animate-pulse rounded-xl bg-[#eee1e2]" />
        </div>
      </section>

      <section className="px-4 py-9 sm:px-6 lg:px-9 lg:py-12">

        <div className="mx-auto grid max-w-[1400px] gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {Array.from({
            length: 8,
          }).map(
            (_, index) => (

              <div
                key={index}
                className="h-[360px] animate-pulse rounded-[27px] bg-[#f1e6e5] sm:h-[375px]"
              />
            )
          )}
        </div>
      </section>
    </main>
  );
}

export default SignatureCollection;