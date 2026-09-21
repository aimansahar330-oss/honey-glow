import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  addProductReview,
  getFeaturedProducts,
} from "../services/productApi";

import { useCart } from "../context/CartContext";

function FeaturedProducts() {
  const [activeCard, setActiveCard] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featured-products"],
    queryFn: getFeaturedProducts,
  });

  const products = Array.isArray(data) ? data : [];

  if (isError) return null;

  return (
    <>
      <section className="relative overflow-hidden bg-[#fffdfb] px-5 py-12 sm:px-8 sm:py-14 lg:px-12 xl:px-16">

        {/* DECORATION */}
        <div className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-[#f6deda]/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#f0d9aa]/15 blur-3xl" />

        <div className="relative mx-auto max-w-[1450px]">

          {/* HEADER */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2.5 flex items-center gap-2">
                <Sparkles
                  size={12}
                  className="text-[#974555]"
                />

                <span className="text-[8px] font-bold uppercase tracking-[0.24em] text-[#9a6870]">
                  HoneyGlow Favorites
                </span>
              </div>

              <h2 className="font-beauty text-[34px] font-semibold leading-none tracking-[-0.035em] text-[#43262c] sm:text-[42px]">
                Made to make you
                <span className="ml-2 text-[#8b3e4d]">
                  glow
                </span>
              </h2>

              <p className="mt-3 max-w-[430px] text-[10px] leading-5 text-[#806a6e] sm:text-[11px]">
                A few of our favorite everyday care essentials,
                selected for softer routines and brighter moments.
              </p>
            </div>

            <Link
              to="/products"
              className="group inline-flex w-fit items-center gap-2 text-[8px] font-bold uppercase tracking-[0.18em] text-[#7d3a47]"
            >
              View Collection

              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c99ea4] bg-white transition duration-300 group-hover:bg-[#7d3a47] group-hover:text-white">
                <ArrowRight size={12} />
              </span>
            </Link>
          </div>

          {/* PRODUCTS */}
          {isLoading ? (
            <ProductSkeleton />
          ) : products.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-[#dfcbc7] bg-[#fff8f6] px-6 py-10 text-center">
              <p className="text-[10px] text-[#967e83]">
                Featured products will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  active={activeCard === product.id}
                  onActivate={() =>
                    setActiveCard(
                      activeCard === product.id
                        ? null
                        : product.id
                    )
                  }
                  onShop={() =>
                    setSelectedProduct(product)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

function ProductCard({
  product,
  active,
  onActivate,
  onShop,
}) {
  const mainImage =
    product.images?.[0]?.imageUrl;

  const finalPrice =
    product.discountPrice ??
    product.originalPrice;

  return (
    <article
      onClick={onActivate}
      className="group mx-auto w-full max-w-[210px] cursor-pointer sm:max-w-[220px] lg:max-w-[215px]"
    >
      {/* FULL CARD */}
      <div className="relative overflow-hidden rounded-[20px] border border-[#e5c9c8] bg-gradient-to-b from-[#fff7f5] via-[#fdf1ee] to-[#f8e7e3] p-1.5 shadow-[0_8px_24px_rgba(92,50,59,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#c88e97] hover:shadow-[0_14px_34px_rgba(92,50,59,0.14)]">

        {/* INNER DECORATIVE BORDER */}
        <div className="pointer-events-none absolute inset-[5px] rounded-[16px] border border-white/70" />

        {/* IMAGE AREA */}
        <div className="relative overflow-hidden rounded-[16px] border border-[#ecd4d1] bg-[#f5e8e4]">

          <div className="aspect-[4/4.6] overflow-hidden">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.055]"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#f4d9d5] via-[#f8ebe8] to-[#edd5a8]" />
            )}
          </div>

          {/* DISCOUNT BADGE */}
          {product.discountPercent > 0 && (
            <span className="absolute left-2 top-2 rounded-full border border-white/30 bg-[#833848] px-2 py-1 text-[6px] font-bold tracking-[0.08em] text-white shadow-md">
              {product.discountPercent}% OFF
            </span>
          )}

          {/* HOVER / MOBILE TAP */}
          <div
            className={`absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#392127]/65 via-transparent to-transparent p-2.5 transition duration-300 lg:opacity-0 lg:group-hover:opacity-100 ${
              active
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShop();
              }}
              className={`flex w-full translate-y-3 items-center justify-center gap-2 rounded-full border border-white/60 bg-[#67313d] px-3 py-2 text-[7px] font-bold uppercase tracking-[0.13em] text-white shadow-lg transition duration-300 lg:group-hover:translate-y-0 ${
                active
                  ? "translate-y-0"
                  : ""
              }`}
            >
              Shop Now
              <ArrowRight size={11} />
            </button>
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="relative mt-2 rounded-[15px] border border-[#ecd8d5] bg-white/55 px-2.5 py-2.5 backdrop-blur-sm">

          {/* CATEGORY */}
          <p className="truncate text-[6px] font-bold uppercase tracking-[0.15em] text-[#a2767e]">
            {product.category?.name}
          </p>

          {/* NAME */}
          <h3 className="font-beauty mt-1 truncate text-[15px] font-semibold leading-tight text-[#4d3037] transition duration-300 group-hover:text-[#8b3e4d] sm:text-[16px]">
            {product.name}
          </h3>

          {/* RATING */}
          <div className="mt-1.5 flex items-center gap-1">
            <Stars
              value={product.averageRating || 0}
              size={9}
            />

            <span className="text-[6px] text-[#a18b90]">
              {product.averageRating || "0.0"} ({product.reviewCount || 0})
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#763743]">
              Rs. {Number(finalPrice).toLocaleString()}
            </span>

            {product.discountPrice && (
              <span className="text-[7px] text-[#ad969b] line-through">
                Rs. {Number(product.originalPrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* ACCENT LINE */}
          <div className="mt-2.5 h-px w-full bg-gradient-to-r from-transparent via-[#d5a0a8] to-transparent" />
        </div>
      </div>
    </article>
  );
}

function ProductQuickView({
  product,
  onClose,
}) {
  const queryClient = useQueryClient();
  const { addToCart } = useCart();

  const [imageIndex, setImageIndex] =
    useState(0);

  const [rating, setRating] =
    useState(5);

  const [reviewForm, setReviewForm] =
    useState({
      name: "",
      comment: "",
    });

  const [added, setAdded] =
    useState(false);

  const images =
    product.images || [];

  const reviews =
    product.reviews || [];

  const finalPrice =
    product.discountPrice ??
    product.originalPrice;

  const reviewMutation = useMutation({
    mutationFn: addProductReview,

    onSuccess: async () => {
      setReviewForm({
        name: "",
        comment: "",
      });

      setRating(5);

      await queryClient.invalidateQueries({
        queryKey: ["featured-products"],
      });
    },
  });

  const submitReview = (e) => {
    e.preventDefault();

    reviewMutation.mutate({
      productId: product.id,

      payload: {
        name: reviewForm.name,
        rating,
        comment: reviewForm.comment,
      },
    });
  };

  const handleAddToCart = () => {
    addToCart(product, 1);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-[#2b191e]/55 p-3 backdrop-blur-md sm:p-5"
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="relative max-h-[94vh] w-full max-w-[900px] overflow-y-auto rounded-[24px] border border-[#e5cac7] bg-[#fffaf8] shadow-[0_30px_100px_rgba(42,22,28,0.3)]"
      >
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#ead5d1] bg-white/90 text-[#643842] shadow-md"
        >
          <X size={14} />
        </button>

        <div className="grid lg:grid-cols-[0.88fr_1.12fr]">

          {/* IMAGE SIDE */}
          <div className="bg-[#f3e2dd] p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-[18px] border border-[#e5cbc7] bg-white/35">

              {images[imageIndex] ? (
                <img
                  src={
                    images[imageIndex]
                      .imageUrl
                  }
                  alt={product.name}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="aspect-[4/5]" />
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setImageIndex(
                        imageIndex === 0
                          ? images.length - 1
                          : imageIndex - 1
                      )
                    }
                    className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setImageIndex(
                        imageIndex ===
                          images.length - 1
                          ? 0
                          : imageIndex + 1
                      )
                    }
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow"
                  >
                    <ChevronRight size={14} />
                  </button>
                </>
              )}
            </div>

            {/* THUMBNAILS */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map(
                  (image, index) => (
                    <button
                      type="button"
                      key={image.id}
                      onClick={() =>
                        setImageIndex(index)
                      }
                      className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 ${
                        imageIndex === index
                          ? "border-[#873d4c]"
                          : "border-transparent"
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

          {/* PRODUCT INFO */}
          <div className="p-5 sm:p-6">

            <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#a16d76]">
              {product.category?.name}
            </p>

            <h2 className="font-beauty mt-1 text-[29px] font-semibold leading-none text-[#45282f] sm:text-[34px]">
              {product.name}
            </h2>

            {/* RATING */}
            <div className="mt-3 flex items-center gap-2">
              <Stars
                value={
                  product.averageRating ||
                  0
                }
                size={11}
              />

              <span className="text-[7px] text-[#967f84]">
                {product.averageRating ||
                  "0.0"}{" "}
                · {product.reviewCount || 0} reviews
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-bold text-[#763743]">
                Rs.{" "}
                {Number(
                  finalPrice
                ).toLocaleString()}
              </span>

              {product.discountPrice && (
                <>
                  <span className="text-[9px] text-[#a99196] line-through">
                    Rs.{" "}
                    {Number(
                      product.originalPrice
                    ).toLocaleString()}
                  </span>

                  <span className="rounded-full bg-[#f1dedd] px-2.5 py-1 text-[6px] font-bold text-[#8c3e4c]">
                    {product.discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="mt-4 max-w-[470px] text-[9px] leading-5 text-[#796267] sm:text-[10px]">
              {product.shortDescription ||
                "A carefully selected HoneyGlow beauty essential."}
            </p>

            {/* STOCK */}
            <div className="mt-4 flex items-center gap-2 text-[7px] font-semibold text-[#6f565b]">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  product.stock > 0
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />

              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </div>

            {/* ADD TO CART */}
            <button
              type="button"
              disabled={
                product.stock < 1
              }
              onClick={handleAddToCart}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#793747] py-2.5 text-[8px] font-bold uppercase tracking-[0.13em] text-white shadow-[0_10px_25px_rgba(121,55,71,0.2)] transition hover:bg-[#632d39] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {added ? (
                <>
                  <Check size={13} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={13} />
                  Add to Cart
                </>
              )}
            </button>

            {/* REVIEWS */}
            <div className="mt-6 border-t border-[#eadbd8] pt-5">

              <div className="flex items-center justify-between">
                <h3 className="font-beauty text-[21px] font-semibold text-[#503039]">
                  Reviews
                </h3>

                <span className="text-[7px] text-[#9b8388]">
                  {reviews.length} reviews
                </span>
              </div>

              {/* EXISTING REVIEWS */}
              <div className="mt-3 max-h-[145px] space-y-2.5 overflow-y-auto pr-1">
                {reviews.length === 0 ? (
                  <p className="text-[8px] text-[#9e858a]">
                    No reviews yet. Be the first to share your thoughts.
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-[#ecd9d5] bg-[#f8efec] p-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] font-bold text-[#69404a]">
                          {review.name}
                        </p>

                        <Stars
                          value={review.rating}
                          size={8}
                        />
                      </div>

                      <p className="mt-1.5 text-[7px] leading-4 text-[#806a6f]">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* REVIEW FORM */}
              <form
                onSubmit={submitReview}
                className="mt-4"
              >
                <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#8b6068]">
                  Write a Review
                </p>

                {/* STARS */}
                <div className="mt-2 flex gap-1">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => {
                    const value =
                      index + 1;

                    return (
                      <button
                        type="button"
                        key={value}
                        onClick={() =>
                          setRating(value)
                        }
                      >
                        <Star
                          size={14}
                          className={
                            value <= rating
                              ? "fill-[#d5a34f] text-[#d5a34f]"
                              : "text-[#d9c6c3]"
                          }
                        />
                      </button>
                    );
                  })}
                </div>

                <input
                  required
                  value={reviewForm.name}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Your name"
                  className="mt-3 w-full rounded-xl border border-[#e1cfcc] bg-white px-3 py-2.5 text-[8px] outline-none focus:border-[#a45b68]"
                />

                <textarea
                  required
                  rows="3"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      comment:
                        e.target.value,
                    })
                  }
                  placeholder="Share your experience..."
                  className="mt-2 w-full resize-none rounded-xl border border-[#e1cfcc] bg-white px-3 py-2.5 text-[8px] outline-none focus:border-[#a45b68]"
                />

                {reviewMutation.isError && (
                  <p className="mt-2 text-[7px] text-red-500">
                    {reviewMutation.error
                      ?.response?.data
                      ?.message ||
                      "Unable to add review."}
                  </p>
                )}

                {reviewMutation.isSuccess && (
                  <p className="mt-2 text-[7px] text-emerald-600">
                    Review added successfully.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    reviewMutation.isPending
                  }
                  className="mt-3 rounded-full border border-[#a65d69] px-4 py-2 text-[7px] font-bold uppercase tracking-[0.12em] text-[#793747] transition hover:bg-[#793747] hover:text-white"
                >
                  {reviewMutation.isPending
                    ? "Submitting..."
                    : "Submit Review"}
                </button>
              </form>
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
      }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className={
            index < Math.round(rating)
              ? "fill-[#d5a34f] text-[#d5a34f]"
              : "text-[#d7c5c2]"
          }
        />
      ))}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:gap-5">
      {Array.from({
        length: 10,
      }).map((_, index) => (
        <div
          key={index}
          className="mx-auto w-full max-w-[210px] animate-pulse sm:max-w-[220px] lg:max-w-[215px]"
        >
          <div className="overflow-hidden rounded-[20px] border border-[#ead5d2] bg-gradient-to-b from-[#fff7f5] via-[#fdf1ee] to-[#f8e7e3] p-1.5">

            <div className="aspect-[4/4.6] rounded-[16px] bg-[#f0dfdc]" />

            <div className="mt-2 rounded-[15px] border border-[#ecd8d5] bg-white/55 px-2.5 py-2.5">
              <div className="h-2 w-14 rounded bg-[#eee2df]" />

              <div className="mt-2 h-4 w-3/4 rounded bg-[#eee2df]" />

              <div className="mt-2 h-2.5 w-20 rounded bg-[#f2e7e4]" />

              <div className="mt-2 h-3 w-16 rounded bg-[#eee2df]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeaturedProducts;