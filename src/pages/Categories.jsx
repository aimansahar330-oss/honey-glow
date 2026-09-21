import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getCategories } from "../services/categoryApi";

function Categories() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  return (
    <main className="min-h-screen bg-[#fffdfb]">

      {/* =========================
          HEADER
      ========================= */}
      <section className="relative overflow-hidden border-b border-[#eedbd8] bg-gradient-to-br from-[#fff8f5] via-[#fdf0ec] to-[#f7e2df] px-5 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16">

        {/* DECORATION */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ecc8c7]/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#efd5a4]/20 blur-3xl" />

        <div className="relative mx-auto max-w-[1350px]">

          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#82404c] transition hover:text-[#a44c5c]"
          >
            <ArrowLeft size={12} />
            Back Home
          </Link>

          <div className="max-w-[600px]">

            <div className="mb-3 flex items-center gap-2">
              <Sparkles
                size={13}
                className="text-[#974653]"
              />

              <span className="text-[9px] font-bold uppercase tracking-[0.23em] text-[#a06c75]">
                Find Your Care
              </span>
            </div>

            <h1 className="font-beauty text-[40px] font-semibold leading-[0.95] tracking-[-0.04em] text-[#43262c] sm:text-[50px]">
              Shop by
              <span className="ml-2 text-[#873d4c]">
                category.
              </span>
            </h1>

            <p className="mt-4 max-w-[500px] text-[11px] leading-5 text-[#81696e] sm:text-[12px]">
              Explore skincare, hair care, body care and
              everyday self-care essentials made for every
              part of your routine.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          CATEGORIES
      ========================= */}
      <section className="relative overflow-hidden px-5 py-9 sm:px-8 sm:py-11 lg:px-12 xl:px-16">

        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#f7dedb]/25 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#efd9ac]/15 blur-3xl" />

        <div className="relative mx-auto max-w-[1250px]">

          {/* TOP */}
          <div className="mb-7 flex items-end justify-between gap-4">

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#a0777e]">
                HoneyGlow Collection
              </p>

              <h2 className="font-beauty mt-1 text-[28px] font-semibold text-[#4b2d34] sm:text-[32px]">
                All Categories
              </h2>
            </div>

            {!isLoading && (
              <span className="rounded-full border border-[#e0c6c3] bg-[#fff8f6] px-3 py-1.5 text-[8px] font-bold text-[#87505a]">
                {categories.length}{" "}
                {categories.length === 1
                  ? "Category"
                  : "Categories"}
              </span>
            )}
          </div>

          {/* LOADING */}
          {isLoading ? (
            <CategorySkeleton />
          ) : isError ? (
            <div className="rounded-[22px] border border-red-100 bg-red-50 px-6 py-12 text-center">
              <p className="text-[10px] text-red-500">
                Categories could not be loaded.
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-[#dec7c4] bg-[#fff8f6] px-6 py-14 text-center">

              <p className="font-beauty text-[25px] font-semibold text-[#55343b]">
                No categories yet.
              </p>

              <p className="mt-2 text-[9px] text-[#9b8287]">
                Categories added from the admin panel will
                appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-7 xl:grid-cols-6">

              {categories.map(
                (category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    index={index}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* =====================================================
   CATEGORY CARD
===================================================== */

function CategoryCard({
  category,
  index,
}) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(
        category.slug
      )}`}
      className="group mx-auto flex w-full max-w-[170px] flex-col items-center text-center"
    >
      {/* IMAGE FRAME */}
      <div className="relative">

        {/* OUTER DECORATIVE RING */}
        <div className="absolute -inset-2 rounded-full border border-[#efd9d6] transition duration-500 group-hover:-inset-3 group-hover:border-[#c99098]" />

        {/* NUMBER */}
        <span className="absolute -right-1 top-2 z-20 flex h-6 min-w-6 items-center justify-center rounded-full border border-white/70 bg-[#7d3947] px-1.5 text-[6px] font-bold text-white shadow-md">
          {String(
            index + 1
          ).padStart(2, "0")}
        </span>

        {/* IMAGE */}
        <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full border-[5px] border-[#fff7f5] bg-[#f1ddda] shadow-[0_10px_30px_rgba(84,45,54,0.10)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_16px_38px_rgba(84,45,54,0.16)] sm:h-[135px] sm:w-[135px]">

          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#f2d7d4] via-[#f7e7e3] to-[#ecd6a8]" />
          )}

          {/* HOVER OVERLAY */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#4d2730]/0 transition duration-300 group-hover:bg-[#4d2730]/20">

            <span className="flex h-9 w-9 translate-y-3 items-center justify-center rounded-full bg-white text-[#783946] opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* NAME */}
      <h3 className="font-beauty mt-4 max-w-full truncate text-[18px] font-semibold leading-none text-[#4e3037] transition duration-300 group-hover:text-[#934553] sm:text-[20px]">
        {category.name}
      </h3>

      {/* DESCRIPTION */}
      {category.shortDescription && (
        <p className="mt-2 line-clamp-2 min-h-[32px] text-[8px] leading-4 text-[#947b80] sm:text-[9px]">
          {category.shortDescription}
        </p>
      )}

      {/* SHOP LINK */}
      <span className="mt-2 inline-flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-[0.13em] text-[#8b4a56] opacity-70 transition duration-300 group-hover:opacity-100">
        Shop Category

        <ArrowRight
          size={9}
          className="transition group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-7 xl:grid-cols-6">

      {Array.from({
        length: 12,
      }).map((_, index) => (
        <div
          key={index}
          className="mx-auto flex w-full max-w-[170px] animate-pulse flex-col items-center"
        >
          <div className="h-[120px] w-[120px] rounded-full bg-[#efddda] sm:h-[135px] sm:w-[135px]" />

          <div className="mt-4 h-4 w-24 rounded bg-[#eee0dd]" />

          <div className="mt-2 h-2.5 w-28 rounded bg-[#f1e5e2]" />

          <div className="mt-1 h-2.5 w-20 rounded bg-[#f1e5e2]" />
        </div>
      ))}
    </div>
  );
}

export default Categories;