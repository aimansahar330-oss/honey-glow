import { useState } from "react";
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

function getYouTubeId(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/")[2];
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2];
      }

      return parsed.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}

function SignatureShowcase() {
  const [selectedProduct, setSelectedProduct] =
    useState(null);

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

  const products = Array.isArray(data)
    ? data.slice(0, 4)
    : [];

  const videoProduct =
    products.find(
      (product) =>
        product.isPrimary &&
        product.videoUrl
    ) ||
    products.find(
      (product) => product.videoUrl
    ) ||
    null;

  const videoId = getYouTubeId(
    videoProduct?.videoUrl
  );

  if (isLoading) {
    return <SignatureSkeleton />;
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

  return (
    <>
      <section className="relative overflow-hidden border-y border-[#f0e1e2] bg-gradient-to-br from-[#fffaf8] via-[#fbf3f2] to-[#f5eaed] px-4 py-10 sm:px-6 sm:py-14 lg:px-9 lg:py-16">
        <div className="pointer-events-none absolute -left-44 -top-44 h-[520px] w-[520px] rounded-full bg-[#edcdd1]/25 blur-[150px]" />

        <div className="pointer-events-none absolute -right-44 bottom-[-180px] h-[560px] w-[560px] rounded-full bg-[#e8d8e9]/24 blur-[160px]" />

        <div className="pointer-events-none absolute left-[45%] top-[25%] h-[330px] w-[330px] rounded-full bg-[#d9e8eb]/20 blur-[140px]" />

        <div className="relative mx-auto max-w-[1480px]">
          {/* HEADER */}

          <div className="mb-8 sm:mb-10 lg:flex lg:items-end lg:justify-between lg:gap-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center gap-2.5 lg:justify-start">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#ead8da] bg-white text-[#a75f6c] shadow-[0_5px_18px_rgba(100,68,75,0.06)]">
                  <Crown size={13} />
                </span>

                <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-[#a9737c] sm:text-[8px]">
                  KM Signature
                </p>
              </div>

              <h2 className="font-beauty mt-3 text-[31px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#53383f] sm:text-[42px] lg:text-[48px]">
                KM Cares

                <span className="mt-1 block text-[#b96f7c] sm:ml-2 sm:mt-0 sm:inline">
                  Special Signature Collection
                </span>
              </h2>

              <p className="mx-auto mt-3 max-w-[470px] text-[9px] leading-5 text-[#907c81] sm:text-[10px] lg:mx-0">
                Discover KM Cares&apos;s most
                special beauty essentials.
              </p>

              <div className="mt-3 flex items-center justify-center gap-2 lg:justify-start">
                <span className="h-px w-8 bg-[#c88b96]" />

                <span className="font-beauty text-[17px] font-semibold text-[#69484f] sm:text-[19px]">
                  Zafrani Cream
                </span>

                <span className="h-px w-8 bg-[#c88b96]" />
              </div>
            </div>

            <div className="mt-5 flex justify-center lg:mt-0">
              <Link
                to="/signature-collection"
                className="group inline-flex items-center gap-3 rounded-full border border-[#dfc7cb] bg-white/85 px-5 py-3 text-[7px] font-bold uppercase tracking-[0.15em] text-[#75434d] shadow-[0_10px_30px_rgba(101,68,75,0.07)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#a9616e] hover:bg-[#803a47] hover:text-white sm:text-[8px]"
              >
                View All Signature

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3e4e6] text-[#9f5967] transition duration-300 group-hover:translate-x-1 group-hover:bg-white/15 group-hover:text-white">
                  <ChevronRight
                    size={11}
                  />
                </span>
              </Link>
            </div>
          </div>

          {/* PRODUCTS + VIDEO */}

          <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_390px]">
            <div
              className={`grid content-start gap-4 sm:gap-5 ${productGridClass}`}
            >
              {products.map(
                (product) => (
                  <SignatureHomeCard
                    key={product.id}
                    product={product}
                    onOpen={() =>
                      setSelectedProduct(
                        product
                      )
                    }
                  />
                )
              )}
            </div>

            {/* VIDEO */}

            <div className="relative min-h-[350px] overflow-hidden rounded-[28px] border border-[#eadadd] bg-[#563d45] shadow-[0_24px_65px_rgba(74,54,61,0.16)] sm:min-h-[420px] lg:h-full lg:min-h-[430px]">
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

              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#453039]/90 to-transparent" />

              <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/15 bg-[#3d2930]/65 px-3 py-1.5 backdrop-blur-md">
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

      {selectedProduct && (
        <SignatureDetailModal
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
        />
      )}
    </>
  );
}

function SignatureHomeCard({
  product,
  onOpen,
}) {
  const image =
    product.images?.[0]?.imageUrl ||
    null;

  const finalPrice =
    product.discountPrice ??
    product.originalPrice;

  const stock =
    Number(product.stock || 0);

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
      className="group relative h-full cursor-pointer overflow-hidden rounded-[29px] p-[2px] outline-none transition duration-500 hover:-translate-y-1.5"
    >
      {/* PREMIUM ANIMATED BORDER */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[29px] bg-[#e3cfd2]">
        <div
          className="absolute left-1/2 top-1/2 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2 animate-[spin_7s_linear_infinite] opacity-55 transition duration-500 group-hover:opacity-100"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, #bb6574 42deg, #dcaf82 88deg, transparent 132deg, #799eae 172deg, #b78cb8 215deg, transparent 260deg, #d9808d 308deg, #bb6574 345deg, transparent 360deg)",
          }}
        />
      </div>

      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[38px] bg-gradient-to-r from-[#d68d99]/15 via-[#dfb58d]/12 to-[#91b4c1]/12 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-[27px] bg-[#fffdfb] shadow-[0_18px_55px_rgba(101,68,74,0.11)]">
        {/* IMAGE */}

        <div className="relative h-[220px] overflow-hidden bg-gradient-to-br from-[#f3e7e7] via-[#fff8f4] to-[#e8e1e9] sm:h-[235px]">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#e9cfd4] via-[#fff8f4] to-[#d9e5e8]" />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#4c3239]/25 via-transparent to-transparent" />

          {product.isPrimary && (
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/25 bg-[#5f3d46]/75 px-2.5 py-1.5 text-[5px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              <Sparkles size={8} />
              Signature
            </span>
          )}

          {discountPercent > 0 && (
            <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-[#a55d6a]/85 px-2.5 py-1.5 text-[5px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-md">
              {discountPercent}% Off
            </span>
          )}

          <div className="absolute bottom-3 left-3 right-3">
            <div className="inline-flex rounded-full border border-white/25 bg-[#533741]/55 px-3 py-1.5 backdrop-blur-md">
              <p className="text-[5px] font-bold uppercase tracking-[0.16em] text-white">
                KM Cares Signature
              </p>
            </div>
          </div>
        </div>

        {/* DETAILS */}

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="text-[6px] font-bold uppercase tracking-[0.17em] text-[#aa8f94]">
            Code KM-
            {String(
              product.id
            ).padStart(4, "0")}
          </p>

          <h3 className="font-beauty mt-1.5 line-clamp-2 text-[24px] font-semibold leading-[1.02] tracking-[-0.03em] text-[#553840] sm:text-[27px]">
            {product.name}
          </h3>

          <div className="mt-2.5">
            <CardRating
              productId={
                product.id
              }
            />
          </div>

          <div className="mt-3 h-px w-full bg-gradient-to-r from-[#a3787d]/45 via-[#ecd8ce] to-transparent" />

          <div className="mt-3">
            <p className="text-[6px] font-bold uppercase tracking-[0.14em] text-[#a18c91]">
              Signature Price
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-[18px] font-black text-[#88424f] sm:text-[21px]">
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

          <div className="mt-2 flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stock > 0
                  ? "bg-emerald-500"
                  : "bg-red-400"
              }`}
            />

            <span className="text-[6px] font-bold uppercase tracking-[0.12em] text-[#968388]">
              {stock > 0
                ? `${stock} Available`
                : "Out of stock"}
            </span>
          </div>

          <div className="mt-auto pt-4">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpen();
              }}
              className="group/button flex w-full items-center justify-center gap-2.5 rounded-full bg-[#803a47] px-4 py-3 text-[7px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_10px_25px_rgba(128,58,71,0.17)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#914f5c]"
            >
              <ShoppingBag
                size={11}
              />

              Shop Now

              <ChevronRight
                size={10}
                className="transition duration-300 group-hover/button:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

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
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const rating =
    Number(
      data?.averageRating || 0
    );

  const count =
    Number(
      data?.reviewCount || 0
    );

  return (
    <div className="flex items-center gap-1.5">
      <Stars
        value={rating}
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

function SignatureDetailModal({
  product,
  onClose,
}) {
  const queryClient =
    useQueryClient();

  const { addToCart } =
    useCart();

  const [
    activeImage,
    setActiveImage,
  ] = useState(
    product.images?.[0]
      ?.imageUrl || null
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
    data: reviewData,
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
    reviewData?.reviews || [];

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
      onMouseDown={(event) => {
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
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e2d1d4] bg-white text-[#825860] transition duration-300 hover:rotate-90 hover:bg-[#a9616e] hover:text-white"
          >
            <X size={13} />
          </button>
        </div>

        {/* PRODUCT */}

        <div className="grid sm:grid-cols-[0.88fr_1.12fr]">
          {/* IMAGE */}

          <div className="border-b border-[#e8dadd] bg-gradient-to-br from-[#d7edf3] via-[#93cad8] to-[#5ba0b5] p-4 sm:border-b-0 sm:border-r">
            <div className="flex min-h-[260px] items-center justify-center overflow-hidden rounded-[18px] bg-white/20">
              {activeImage && (
                <img
                  src={activeImage}
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
                  (image) => (
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
              {product.name}
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
                      (current) =>
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
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (current) =>
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
            {/* FORM */}

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
                  {[1, 2, 3, 4, 5].map(
                    (rating) => (
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
                  {reviews.length}
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
                    (review) => (
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

function SignatureSkeleton() {
  return (
    <section className="bg-gradient-to-br from-[#fffaf8] via-[#fbf2f1] to-[#f4e9ed] px-4 py-12 sm:px-6 lg:px-9 lg:py-16">
      <div className="mx-auto max-w-[1480px]">
        <div className="mx-auto h-8 w-[240px] animate-pulse rounded-xl bg-[#eadcdd] lg:mx-0" />

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: 3,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-[430px] animate-pulse rounded-[28px] bg-white/65"
                />
              )
            )}
          </div>

          <div className="min-h-[350px] animate-pulse rounded-[28px] bg-[#76525b]/25 sm:min-h-[420px]" />
        </div>
      </div>
    </section>
  );
}

export default SignatureShowcase;