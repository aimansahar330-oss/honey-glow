import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../services/categoryApi";

function CategoryShowcase() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = Array.isArray(data) ? data : [];

  if (isError) return null;

  return (
    <section className="relative overflow-hidden bg-[#fffaf7] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 xl:px-16">

      {/* DECORATION */}
      <div className="pointer-events-none absolute -left-20 top-8 h-64 w-64 rounded-full bg-[#f5d9d7]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#efd8a7]/20 blur-3xl" />

      <div className="relative mx-auto max-w-[1450px]">

        {/* HEADER */}
        <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles
                size={13}
                className="text-[#984555]"
              />

              <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#9b6870] sm:text-[9px]">
                Find Your Everyday Care
              </span>
            </div>

            <h2 className="font-beauty text-[38px] font-semibold leading-none tracking-[-0.035em] text-[#43262c] sm:text-[46px]">
              Shop by
              <span className="ml-2 text-[#8b3e4d]">
                Category
              </span>
            </h2>

            <p className="mt-3 max-w-[460px] text-[11px] leading-5 text-[#735b5f] sm:text-[12px]">
              Explore everything your daily care routine needs.
            </p>
          </div>

          <Link
            to="/categories"
            className="group inline-flex w-fit items-center gap-2 text-[9px] font-bold uppercase tracking-[0.17em] text-[#7d3a47]"
          >
            View All

            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c99ea4] bg-white transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-[#7d3a47] group-hover:text-white">
              <ArrowUpRight size={13} />
            </span>
          </Link>
        </div>

        {/* CATEGORIES */}
        {isLoading ? (
          <CategorySkeleton />
        ) : categories.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#ddc3c0] bg-[#fff7f4] px-6 py-12 text-center">
            <p className="text-xs font-semibold text-[#69494f]">
              Categories will appear here.
            </p>

            <p className="mt-2 text-[10px] text-[#987d81]">
              Add categories from the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {categories.slice(0, 12).map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryCard({ category, index }) {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group flex flex-col items-center text-center"
    >
      {/* CIRCLE IMAGE */}
      <div className="relative">

        {/* OUTER DECORATIVE RING */}
        <div className="absolute -inset-2 rounded-full border border-[#d9b7b5]/45 transition duration-500 group-hover:scale-105 group-hover:border-[#a95a67]/60" />

        {/* IMAGE CIRCLE */}
        <div className="relative h-[112px] w-[112px] overflow-hidden rounded-full border-[3px] border-white bg-[#f2dfdc] shadow-[0_10px_30px_rgba(101,58,67,0.10)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_16px_35px_rgba(101,58,67,0.16)] sm:h-[128px] sm:w-[128px] lg:h-[138px] lg:w-[138px]">

          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#f4d7d4] via-[#f8ebe7] to-[#efd9aa]" />
          )}

          {/* SOFT IMAGE OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#4e2b32]/15 via-transparent to-white/5" />

          {/* NUMBER */}
          <span className="absolute bottom-2 right-6 flex h-6 min-w-6 items-center justify-center rounded-full border border-white/60 bg-yellow-600 px-1.5 text-[7px] font-bold text-white shadow-sm backdrop-blur-md">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* CATEGORY NAME */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        <h3 className="font-beauty max-w-[140px] truncate text-[20px] font-semibold text-[#563139] transition duration-300 group-hover:text-[#913f50] sm:text-[21px]">
          {category.name}
        </h3>

        <ArrowUpRight
          size={12}
          className="text-[#a8737b] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#8c3f4d]"
        />
      </div>

      {/* SMALL DESCRIPTION */}
      {category.shortDescription && (
        <p className="mt-1 line-clamp-1 max-w-[145px] text-[8px] leading-4 text-[#9b8589] sm:text-[9px]">
          {category.shortDescription}
        </p>
      )}

      {/* SMALL BOTTOM LINE */}
      <span className="mt-2 h-px w-0 bg-[#9a4a59] transition-all duration-500 group-hover:w-10" />
    </Link>
  );
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse flex-col items-center"
        >
          <div className="h-[112px] w-[112px] rounded-full bg-[#f0dfdc] sm:h-[128px] sm:w-[128px] lg:h-[138px] lg:w-[138px]" />

          <div className="mt-5 h-4 w-20 rounded bg-[#f0dfdc]" />

          <div className="mt-2 h-2 w-14 rounded bg-[#f5e8e5]" />
        </div>
      ))}
    </div>
  );
}

export default CategoryShowcase;