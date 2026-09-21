import { useMemo, useState,useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import {
  addProductReview,
  getProducts,
} from "../services/productApi";

import { getCategories } from "../services/categoryApi";
import { useCart } from "../context/CartContext";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
const categorySlug =
  searchParams.get("category") || "";

const navbarSearch =
  searchParams.get("search") || "";

const [search, setSearch] =
  useState(navbarSearch);

useEffect(() => {
  setSearch(
    navbarSearch
  );
}, [navbarSearch]);

  const [sort, setSort] = useState("newest");
  const [discountOnly, setDiscountOnly] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  const [activeCard, setActiveCard] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", categorySlug],
    queryFn: () =>
      getProducts(
        categorySlug
          ? {
              category: categorySlug,
            }
          : {}
      ),
  });

  const {
    data: categoriesData,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const products = Array.isArray(productsData)
    ? productsData
    : [];

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : [];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const keyword =
      search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((product) => {
        const productName =
          product.name?.toLowerCase() || "";

        const description =
          product.shortDescription?.toLowerCase() || "";

        const categoryName =
          product.category?.name?.toLowerCase() || "";

        return (
          productName.includes(keyword) ||
          description.includes(keyword) ||
          categoryName.includes(keyword)
        );
      });
    }

    if (discountOnly) {
      result = result.filter(
        (product) =>
          Number(product.discountPercent) > 0
      );
    }

    result.sort((a, b) => {
      const priceA = Number(
        a.discountPrice ??
          a.originalPrice
      );

      const priceB = Number(
        b.discountPrice ??
          b.originalPrice
      );

      if (sort === "price-low") {
        return priceA - priceB;
      }

      if (sort === "price-high") {
        return priceB - priceA;
      }

      if (sort === "discount") {
        return (
          Number(b.discountPercent || 0) -
          Number(a.discountPercent || 0)
        );
      }

      if (sort === "rating") {
        return (
          Number(b.averageRating || 0) -
          Number(a.averageRating || 0)
        );
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    return result;
  }, [
    products,
    search,
    sort,
    discountOnly,
  ]);

  const selectCategory = (slug) => {
    setActiveCard(null);

    if (!slug) {
      setSearchParams({});
      return;
    }

    setSearchParams({
      category: slug,
    });
  };

  return (
    <>
      <main className="min-h-screen bg-[#fffdfb]">

        {/* =========================
            PAGE HEADER
        ========================= */}
        <section className="relative overflow-hidden border-b border-[#efdedb] bg-gradient-to-br from-[#fff8f5] via-[#fdf0ec] to-[#f8e1df] px-5 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16">

          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#edc8c7]/30 blur-3xl" />

          <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#e8c97f]/15 blur-3xl" />

          <div className="relative mx-auto max-w-[1450px]">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <div className="mb-2.5 flex items-center gap-2">
                  <Sparkles
                    size={12}
                    className="text-[#964654]"
                  />

                  <span className="text-[8px] font-bold uppercase tracking-[0.24em] text-[#9c6770]">
                    The HoneyGlow Edit
                  </span>
                </div>

                <h1 className="font-beauty text-[38px] font-semibold leading-none tracking-[-0.04em] text-[#43262c] sm:text-[46px] lg:text-[50px]">
                  Find your
                  <span className="ml-2 text-[#873d4c]">
                    everyday glow.
                  </span>
                </h1>

                <p className="mt-3 max-w-[500px] text-[10px] leading-5 text-[#826a6f] sm:text-[11px]">
                  Skincare, hair care, body care and self-care
                  essentials selected for your everyday routine.
                </p>
              </div>

              <Link
                to="/"
                className="group inline-flex w-fit items-center gap-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#81404c]"
              >
                Back Home

                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#cda4a8] bg-white/70 transition group-hover:bg-[#7b3745] group-hover:text-white">
                  <ArrowRight size={12} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================
            SHOP CONTENT
        ========================= */}
        <section className="relative px-5 py-9 sm:px-8 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1450px]">

            {/* CATEGORY PILLS */}
            <div className="mb-6 overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-2">
                <CategoryPill
                  active={!categorySlug}
                  label="All Products"
                  onClick={() =>
                    selectCategory("")
                  }
                />

                {categories.map(
                  (category) => (
                    <CategoryPill
                      key={category.id}
                      active={
                        categorySlug ===
                        category.slug
                      }
                      label={category.name}
                      onClick={() =>
                        selectCategory(
                          category.slug
                        )
                      }
                    />
                  )
                )}
              </div>
            </div>

            {/* SEARCH / FILTER BAR */}
            <div className="mb-7 rounded-[20px] border border-[#ead5d2] bg-[#fff8f6] p-3 shadow-[0_8px_28px_rgba(83,48,56,0.04)]">

              <div className="flex items-center gap-2">

                {/* SEARCH */}
                <div className="flex min-w-0 flex-1 items-center rounded-xl border border-[#ead8d5] bg-white px-3 transition focus-within:border-[#a55a68]">
                  <Search
                    size={14}
                    className="shrink-0 text-[#9d747b]"
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="Search your glow..."
                    className="w-full bg-transparent px-3 py-2.5 text-[9px] text-[#51383e] outline-none placeholder:text-[#b79da2] sm:text-[10px]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      className="text-[#a37c83]"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* MOBILE FILTER BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    setMobileFilters(
                      !mobileFilters
                    )
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e4cfcc] bg-white text-[#74404a] md:hidden"
                >
                  <SlidersHorizontal
                    size={14}
                  />
                </button>

                {/* DESKTOP FILTERS */}
                <div className="hidden items-center gap-2 md:flex">
                  <DiscountToggle
                    active={discountOnly}
                    onClick={() =>
                      setDiscountOnly(
                        !discountOnly
                      )
                    }
                  />

                  <SortSelect
                    value={sort}
                    onChange={setSort}
                  />
                </div>
              </div>

              {/* MOBILE FILTERS */}
              {mobileFilters && (
                <div className="mt-3 grid gap-2 border-t border-[#eadbd8] pt-3 sm:grid-cols-2 md:hidden">
                  <DiscountToggle
                    active={discountOnly}
                    onClick={() =>
                      setDiscountOnly(
                        !discountOnly
                      )
                    }
                  />

                  <SortSelect
                    value={sort}
                    onChange={setSort}
                  />
                </div>
              )}
            </div>

            {/* RESULTS META */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-[#ad858c]">
                  Collection
                </p>

                <p className="mt-1 text-[9px] font-semibold text-[#70555b]">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "product"
                    : "products"}
                </p>
              </div>

              {categorySlug && (
                <button
                  type="button"
                  onClick={() =>
                    selectCategory("")
                  }
                  className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#8d4855]"
                >
                  Clear Category
                </button>
              )}
            </div>

            {/* PRODUCTS */}
            {isLoading ? (
              <ProductsSkeleton />
            ) : isError ? (
              <div className="rounded-[22px] border border-red-100 bg-red-50 px-6 py-12 text-center text-[10px] text-red-500">
                Products could not be loaded.
              </div>
            ) : filteredProducts.length ===
              0 ? (
              <EmptyProducts
                clearFilters={() => {
                  setSearch("");
                  setDiscountOnly(false);
                  setSort("newest");
                  selectCategory("");
                }}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:gap-5">
                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      active={
                        activeCard ===
                        product.id
                      }
                      onActivate={() =>
                        setActiveCard(
                          activeCard ===
                            product.id
                            ? null
                            : product.id
                        )
                      }
                      onShop={() =>
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

      {/* QUICK VIEW */}
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
        />
      )}
    </>
  );
}

/* =====================================================
   CATEGORY FILTER
===================================================== */

function CategoryPill({
  active,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[7px] font-bold uppercase tracking-[0.13em] transition ${
        active
          ? "border-[#793747] bg-[#793747] text-white shadow-[0_6px_18px_rgba(121,55,71,0.16)]"
          : "border-[#e2cbc8] bg-[#fff8f6] text-[#825b63] hover:border-[#a96571] hover:text-[#793747]"
      }`}
    >
      {label}
    </button>
  );
}

/* =====================================================
   DISCOUNT FILTER
===================================================== */

function DiscountToggle({
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 items-center justify-center rounded-xl border px-3 text-[7px] font-bold uppercase tracking-[0.12em] transition ${
        active
          ? "border-[#8b4150] bg-[#8b4150] text-white"
          : "border-[#e4cfcc] bg-white text-[#76545b]"
      }`}
    >
      On Sale
    </button>
  );
}

/* =====================================================
   SORT
===================================================== */

function SortSelect({
  value,
  onChange,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="h-9 w-full appearance-none rounded-xl border border-[#e4cfcc] bg-white py-0 pl-3 pr-8 text-[7px] font-bold uppercase tracking-[0.1em] text-[#76545b] outline-none md:w-[150px]"
      >
        <option value="newest">
          Newest
        </option>

        <option value="price-low">
          Price: Low
        </option>

        <option value="price-high">
          Price: High
        </option>

        <option value="discount">
          Biggest Discount
        </option>

        <option value="rating">
          Top Rated
        </option>
      </select>

      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a6269]"
      />
    </div>
  );
}

/* =====================================================
   PRODUCT CARD
===================================================== */

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
      <div className="relative overflow-hidden rounded-[20px] border border-[#e5c9c8] bg-gradient-to-b from-[#fff7f5] via-[#fdf1ee] to-[#f8e7e3] p-1.5 shadow-[0_8px_24px_rgba(92,50,59,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#c88e97] hover:shadow-[0_14px_34px_rgba(92,50,59,0.14)]">

        <div className="pointer-events-none absolute inset-[5px] rounded-[16px] border border-white/70" />

        {/* IMAGE */}
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

          {/* DISCOUNT */}
          {Number(
            product.discountPercent
          ) > 0 && (
            <span className="absolute left-2 top-2 rounded-full border border-white/30 bg-[#833848] px-2 py-1 text-[6px] font-bold tracking-[0.08em] text-white shadow-md">
              {product.discountPercent}% OFF
            </span>
          )}

          {/* HOVER/TAP */}
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
              className={`flex w-full translate-y-3 items-center justify-center gap-2 rounded-full border border-white/60 bg-white/95 px-3 py-2 text-[7px] font-bold uppercase tracking-[0.13em] text-[#67313d] shadow-lg transition duration-300 lg:group-hover:translate-y-0 ${
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

        {/* INFO */}
        <div className="relative mt-2 rounded-[15px] border border-[#ecd8d5] bg-white/55 px-2.5 py-2.5 backdrop-blur-sm">

          <p className="truncate text-[6px] font-bold uppercase tracking-[0.15em] text-[#a2767e]">
            {product.category?.name}
          </p>

          <h3 className="font-beauty mt-1 truncate text-[15px] font-semibold leading-tight text-[#4d3037] transition duration-300 group-hover:text-[#8b3e4d] sm:text-[16px]">
            {product.name}
          </h3>

          {/* REVIEW */}
          <div className="mt-1.5 flex items-center gap-1">
            <Stars
              value={
                product.averageRating ||
                0
              }
              size={9}
            />

            <span className="text-[6px] text-[#a18b90]">
              {product.averageRating ||
                "0.0"}{" "}
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#763743]">
              Rs.{" "}
              {Number(
                finalPrice
              ).toLocaleString()}
            </span>

            {product.discountPrice && (
              <span className="text-[7px] text-[#ad969b] line-through">
                Rs.{" "}
                {Number(
                  product.originalPrice
                ).toLocaleString()}
              </span>
            )}
          </div>

          <div className="mt-2.5 h-px w-full bg-gradient-to-r from-transparent via-[#d5a0a8] to-transparent" />
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   PRODUCT QUICK VIEW
===================================================== */

function ProductQuickView({
  product,
  onClose,
}) {
  const queryClient =
    useQueryClient();

  const { addToCart } =
    useCart();

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

  const [localReviews, setLocalReviews] =
    useState(
      Array.isArray(product.reviews)
        ? product.reviews
        : []
    );

  const images =
    product.images || [];

  const finalPrice =
    product.discountPrice ??
    product.originalPrice;

  const reviewMutation =
    useMutation({
      mutationFn:
        addProductReview,

      onSuccess: async (
        response
      ) => {
        if (response?.data) {
          setLocalReviews(
            (previous) => [
              response.data,
              ...previous,
            ]
          );
        }

        setReviewForm({
          name: "",
          comment: "",
        });

        setRating(5);

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "products",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "featured-products",
            ],
          }),
        ]);
      },
    });

  const submitReview = (e) => {
    e.preventDefault();

    reviewMutation.mutate({
      productId:
        product.id,

      payload: {
        name:
          reviewForm.name,
        rating,
        comment:
          reviewForm.comment,
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

  const averageRating =
    localReviews.length > 0
      ? (
          localReviews.reduce(
            (
              total,
              review
            ) =>
              total +
              Number(
                review.rating
              ),
            0
          ) /
          localReviews.length
        ).toFixed(1)
      : Number(
          product.averageRating ||
            0
        ).toFixed(1);

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

          {/* IMAGES */}
          <div className="bg-[#f3e2dd] p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-[18px] border border-[#e5cbc7] bg-white/35">

              {images[imageIndex] ? (
                <img
                  src={
                    images[
                      imageIndex
                    ].imageUrl
                  }
                  alt={product.name}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="aspect-[4/5]" />
              )}

              {images.length >
                1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setImageIndex(
                        imageIndex ===
                          0
                          ? images.length -
                              1
                          : imageIndex -
                              1
                      )
                    }
                    className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow"
                  >
                    <ChevronLeft
                      size={14}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setImageIndex(
                        imageIndex ===
                          images.length -
                            1
                          ? 0
                          : imageIndex +
                              1
                      )
                    }
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow"
                  >
                    <ChevronRight
                      size={14}
                    />
                  </button>
                </>
              )}
            </div>

            {/* THUMBNAILS */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      type="button"
                      key={
                        image.id
                      }
                      onClick={() =>
                        setImageIndex(
                          index
                        )
                      }
                      className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 ${
                        imageIndex ===
                        index
                          ? "border-[#873d4c]"
                          : "border-transparent"
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

            <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#a16d76]">
              {
                product.category
                  ?.name
              }
            </p>

            <h2 className="font-beauty mt-1 text-[29px] font-semibold leading-none text-[#45282f] sm:text-[34px]">
              {product.name}
            </h2>

            {/* RATING */}
            <div className="mt-3 flex items-center gap-2">
              <Stars
                value={
                  averageRating
                }
                size={11}
              />

              <span className="text-[7px] text-[#967f84]">
                {
                  averageRating
                }{" "}
                ·{" "}
                {
                  localReviews.length
                }{" "}
                reviews
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
                    {
                      product.discountPercent
                    }
                    % OFF
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
                  product.stock >
                  0
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />

              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </div>

            {/* ADD CART */}
            <button
              type="button"
              disabled={
                product.stock < 1
              }
              onClick={
                handleAddToCart
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#793747] py-2.5 text-[8px] font-bold uppercase tracking-[0.13em] text-white shadow-[0_10px_25px_rgba(121,55,71,0.2)] transition hover:bg-[#632d39] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {added ? (
                <>
                  <Check
                    size={13}
                  />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag
                    size={13}
                  />
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
                  {
                    localReviews.length
                  }{" "}
                  reviews
                </span>
              </div>

              {/* EXISTING REVIEWS */}
              <div className="mt-3 max-h-[145px] space-y-2.5 overflow-y-auto pr-1">
                {localReviews.length ===
                0 ? (
                  <p className="text-[8px] text-[#9e858a]">
                    No reviews yet.
                    Be the first to
                    share your
                    thoughts.
                  </p>
                ) : (
                  localReviews.map(
                    (review) => (
                      <div
                        key={
                          review.id
                        }
                        className="rounded-xl border border-[#ecd9d5] bg-[#f8efec] p-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-[8px] font-bold text-[#69404a]">
                            {
                              review.name
                            }
                          </p>

                          <Stars
                            value={
                              review.rating
                            }
                            size={
                              8
                            }
                          />
                        </div>

                        <p className="mt-1.5 text-[7px] leading-4 text-[#806a6f]">
                          {
                            review.comment
                          }
                        </p>
                      </div>
                    )
                  )
                )}
              </div>

              {/* WRITE REVIEW */}
              <form
                onSubmit={
                  submitReview
                }
                className="mt-4"
              >
                <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#8b6068]">
                  Write a Review
                </p>

                <div className="mt-2 flex gap-1">
                  {Array.from({
                    length: 5,
                  }).map(
                    (
                      _,
                      index
                    ) => {
                      const value =
                        index + 1;

                      return (
                        <button
                          type="button"
                          key={
                            value
                          }
                          onClick={() =>
                            setRating(
                              value
                            )
                          }
                        >
                          <Star
                            size={
                              14
                            }
                            className={
                              value <=
                              rating
                                ? "fill-[#d5a34f] text-[#d5a34f]"
                                : "text-[#d9c6c3]"
                            }
                          />
                        </button>
                      );
                    }
                  )}
                </div>

                <input
                  required
                  value={
                    reviewForm.name
                  }
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      name:
                        e.target
                          .value,
                    })
                  }
                  placeholder="Your name"
                  className="mt-3 w-full rounded-xl border border-[#e1cfcc] bg-white px-3 py-2.5 text-[8px] outline-none focus:border-[#a45b68]"
                />

                <textarea
                  required
                  rows="3"
                  value={
                    reviewForm.comment
                  }
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      comment:
                        e.target
                          .value,
                    })
                  }
                  placeholder="Share your experience..."
                  className="mt-2 w-full resize-none rounded-xl border border-[#e1cfcc] bg-white px-3 py-2.5 text-[8px] outline-none focus:border-[#a45b68]"
                />

                {reviewMutation.isError && (
                  <p className="mt-2 text-[7px] text-red-500">
                    {reviewMutation.error
                      ?.response
                      ?.data
                      ?.message ||
                      "Unable to add review."}
                  </p>
                )}

                {reviewMutation.isSuccess && (
                  <p className="mt-2 text-[7px] text-emerald-600">
                    Review added
                    successfully.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    reviewMutation.isPending
                  }
                  className="mt-3 rounded-full border border-[#a65d69] px-4 py-2 text-[7px] font-bold uppercase tracking-[0.12em] text-[#793747] transition hover:bg-[#793747] hover:text-white disabled:opacity-50"
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
      }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className={
            index <
            Math.round(rating)
              ? "fill-[#d5a34f] text-[#d5a34f]"
              : "text-[#d7c5c2]"
          }
        />
      ))}
    </div>
  );
}

/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyProducts({
  clearFilters,
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#ddc7c3] bg-[#fff8f6] px-6 py-14 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f1dfdc] text-[#87404e]">
        <Search size={16} />
      </div>

      <h2 className="font-beauty mt-4 text-[24px] font-semibold text-[#4c3036]">
        Nothing matched
      </h2>

      <p className="mt-2 text-[9px] text-[#967e83]">
        Try another category or
        search term.
      </p>

      <button
        type="button"
        onClick={clearFilters}
        className="mt-4 rounded-full border border-[#a86470] px-4 py-2 text-[7px] font-bold uppercase tracking-[0.12em] text-[#7c3a47]"
      >
        Clear Filters
      </button>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function ProductsSkeleton() {
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

export default Products;