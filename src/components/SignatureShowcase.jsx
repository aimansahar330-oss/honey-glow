import { useQuery } from "@tanstack/react-query";
import {
  Crown,
  Leaf,
  MoonStar,
  Play,
  Sparkles,
  Star,
} from "lucide-react";

import { getSignatureProducts } from "../services/signatureProductApi";

function getYouTubeId(url) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname.includes("youtu.be")
    ) {
      return parsedUrl.pathname.replace("/", "");
    }

    if (
      parsedUrl.hostname.includes("youtube.com")
    ) {
      if (
        parsedUrl.pathname.startsWith("/shorts/")
      ) {
        return parsedUrl.pathname.split("/")[2];
      }

      if (
        parsedUrl.pathname.startsWith("/embed/")
      ) {
        return parsedUrl.pathname.split("/")[2];
      }

      return parsedUrl.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}

function SignatureShowcase() {
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
    ? data
    : [];

  if (isLoading) {
    return <SignatureSkeleton />;
  }

  if (
    isError ||
    products.length === 0
  ) {
    return null;
  }

  const primaryProduct =
    products.find(
      (product) =>
        product.isPrimary
    ) || products[0];

  const otherProducts =
    products
      .filter(
        (product) =>
          product.id !==
          primaryProduct.id
      )
      .slice(0, 4);

  const videoId =
    getYouTubeId(
      primaryProduct.videoUrl
    );

  const finalPrice =
    primaryProduct.discountPrice ??
    primaryProduct.originalPrice;

  const mainImage =
    primaryProduct.images?.[0]
      ?.imageUrl;

  return (
    <section id="signature-products" className="relative overflow-hidden bg-[#1d1012] px-4 py-12 sm:px-7 sm:py-16 lg:px-10 lg:py-20 xl:px-14">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute -left-32 top-0 h-[460px] w-[460px] rounded-full bg-[#c98942]/15 blur-[120px]" />

      <div className="pointer-events-none absolute -right-28 bottom-0 h-[480px] w-[480px] rounded-full bg-[#8b3549]/25 blur-[130px]" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[75%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#e0b362]/45 to-transparent" />

      <div className="relative mx-auto max-w-[1450px]">
        {/* SECTION HEADER */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e0b56b]/25 bg-[#d8a75e]/10 text-[#e7bd73]">
                <Crown size={14} />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#e5ba70] sm:text-[9px]">
                  HoneyGlow Signature
                </p>

                <div className="mt-1.5 h-px w-20 bg-gradient-to-r from-[#d9a65b] to-transparent" />
              </div>
            </div>

            <h2 className="font-beauty text-[40px] font-semibold leading-[0.92] tracking-[-0.04em] text-[#fff4eb] sm:text-[50px] lg:text-[58px]">
              Our most
              <span className="ml-2 text-[#dfa856]">
                special ritual.
              </span>
            </h2>

            <p className="mt-4 max-w-[580px] text-[10px] leading-5 text-[#c8b4b7] sm:text-[11px] sm:leading-6">
              A premium collection created to represent the heart of HoneyGlow.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d7aa62]/20 bg-[#d4a15a]/10 px-4 py-2.5">
            <Sparkles size={12} className="text-[#e1b56c]" />

            <span className="text-[7px] font-bold uppercase tracking-[0.17em] text-[#dfb873]">
              Exclusive Collection
            </span>
          </div>
        </div>

        {/* MAIN PRODUCT */}

        <article className="relative overflow-hidden rounded-[30px] border border-[#d5a25b]/25 bg-gradient-to-br from-[#4b2628] via-[#32181d] to-[#201013] shadow-[0_35px_110px_rgba(8,3,5,0.4)] sm:rounded-[36px]">
          <div className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-white/5 sm:rounded-[35px]" />

          <div className="grid lg:grid-cols-[0.9fr_0.8fr_1.05fr]">
            {/* PRODUCT DETAILS */}

            <div className="relative z-10 flex flex-col justify-center p-6 sm:p-9 lg:p-10 xl:p-12">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#d9a75f]/25 bg-[#d4a15b]/10 px-3 py-2">
                <MoonStar size={12} className="text-[#e4b66d]" />

                <span className="text-[7px] font-bold uppercase tracking-[0.19em] text-[#e4b970]">
                  Primary Signature
                </span>
              </div>

              <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#bd8a83]">
                HoneyGlow Exclusive
              </p>

              <h3 className="font-beauty mt-2 max-w-[480px] text-[42px] font-semibold leading-[0.9] tracking-[-0.04em] text-[#fff5ed] sm:text-[52px] lg:text-[48px] xl:text-[58px]">
                {primaryProduct.name}
              </h3>

              <p className="mt-5 max-w-[450px] text-[10px] leading-5 text-[#cfb9bc] sm:text-[11px] sm:leading-6">
                {primaryProduct.shortDescription ||
                  "A premium HoneyGlow signature essential created to make your beauty ritual feel truly special."}
              </p>

              {/* PRICE */}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-[22px] font-bold text-[#efc274]">
                  Rs.{" "}
                  {Number(
                    finalPrice
                  ).toLocaleString()}
                </span>

                {primaryProduct.discountPrice && (
                  <span className="text-[10px] text-white/35 line-through">
                    Rs.{" "}
                    {Number(
                      primaryProduct.originalPrice
                    ).toLocaleString()}
                  </span>
                )}

                {Number(primaryProduct.discountPercent) > 0 && (
                  <span className="rounded-full border border-[#d6a158]/25 bg-[#d6a158]/10 px-2.5 py-1 text-[7px] font-bold text-[#e9c17b]">
                    {primaryProduct.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* STOCK */}

              <div className="mt-4 flex items-center gap-2 text-[8px] font-semibold text-[#cbb4b7]">
                <span className={`h-1.5 w-1.5 rounded-full ${Number(primaryProduct.stock) > 0 ? "bg-emerald-400" : "bg-red-400"}`} />

                {Number(primaryProduct.stock) > 0
                  ? `${primaryProduct.stock} in stock`
                  : "Out of stock"}
              </div>

              {/* PREMIUM NOTES */}

              <div className="mt-7 grid grid-cols-2 gap-2">
                <FeatureTag
                  icon={<Sparkles size={12} />}
                  text="Signature Care"
                />

                <FeatureTag
                  icon={<Leaf size={12} />}
                  text="Premium Ritual"
                />
              </div>
            </div>

            {/* PRODUCT IMAGE */}

            <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden border-y border-[#d5a25a]/10 bg-[#4c2726]/20 p-6 sm:min-h-[500px] lg:border-x lg:border-y-0">
              <div className="absolute h-[285px] w-[285px] rounded-full border border-[#dba75c]/20 sm:h-[340px] sm:w-[340px]" />

              <div className="absolute h-[225px] w-[225px] rounded-full border border-dashed border-[#dba75c]/20 sm:h-[285px] sm:w-[285px]" />

              <div className="absolute h-[215px] w-[215px] rounded-full bg-[#ce8e45]/20 blur-[60px]" />

              <div className="absolute left-1/2 top-1/2 h-[70%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d89f50]/10 blur-[45px]" />

              {mainImage ? (
                <img
                  src={mainImage}
                  alt={primaryProduct.name}
                  loading="eager"
                  className="relative z-10 max-h-[430px] w-[82%] max-w-[330px] object-contain drop-shadow-[0_32px_48px_rgba(0,0,0,0.5)] transition duration-700 hover:scale-[1.025]"
                />
              ) : (
                <div className="relative z-10 h-[300px] w-[215px] rounded-[32px] bg-gradient-to-br from-[#dea754] to-[#71372f]" />
              )}

              <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#e3ba75]/25 bg-[#241315]/75 px-4 py-2 backdrop-blur-md">
                <span className="text-[6px] font-bold uppercase tracking-[0.22em] text-[#e9c47f]">
                  HoneyGlow Signature
                </span>
              </div>
            </div>

            {/* VIDEO */}

            <div className="relative min-h-[400px] overflow-hidden bg-[#170c0e] sm:min-h-[500px] lg:min-h-full">
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&rel=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1`}
                  title={`${primaryProduct.name} video`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#4c2825] via-[#30171b] to-[#180c0e] p-8 text-center">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#dca75e]/25 bg-[#d5a056]/10 text-[#e0b36b]">
                      <Play size={19} fill="currentColor" />
                    </div>

                    <p className="font-beauty mt-4 text-[30px] text-[#f5e4dc]">
                      The HoneyGlow Story
                    </p>

                    <p className="mt-2 text-[7px] uppercase tracking-[0.18em] text-white/35">
                      Product video will appear here
                    </p>
                  </div>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#190c0f]/85 via-transparent to-[#2c1519]/25" />

              <div className="pointer-events-none absolute bottom-6 left-5 right-5 z-10">
                <p className="text-[7px] font-bold uppercase tracking-[0.23em] text-[#e5bd75]">
                  Behind the Ritual
                </p>

                <p className="font-beauty mt-1 max-w-[300px] text-[26px] leading-none text-white sm:text-[30px]">
                  Care made to feel special.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* OTHER SIGNATURE PRODUCTS */}

        {otherProducts.length > 0 && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#d6a76a]">
                  More Signature Care
                </p>

                <h3 className="font-beauty mt-1 text-[26px] font-semibold text-[#f3dfd8] sm:text-[30px]">
                  Complete the ritual
                </h3>
              </div>

              <span className="hidden text-[7px] uppercase tracking-[0.14em] text-white/30 sm:block">
                {otherProducts.length} products
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {otherProducts.map((product) => (
                <SignatureCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM FEATURES */}

        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          <BottomFeature
            icon={<Crown size={13} />}
            title="Signature Collection"
            text="HoneyGlow's most special products."
          />

          <BottomFeature
            icon={<MoonStar size={13} />}
            title="Premium Ritual"
            text="Care designed for memorable routines."
          />

          <BottomFeature
            icon={<Sparkles size={13} />}
            title="Exclusive Experience"
            text="A collection made to stand apart."
          />
        </div>
      </div>
    </section>
  );
}

function SignatureCard({
  product,
}) {
  const image =
    product.images?.[0]
      ?.imageUrl;

  const finalPrice =
    product.discountPrice ??
    product.originalPrice;

  return (
    <article className="group overflow-hidden rounded-[18px] border border-[#d0a15d]/20 bg-gradient-to-b from-[#412126] via-[#30171c] to-[#221114] p-1.5 shadow-[0_12px_35px_rgba(8,3,5,0.2)] transition duration-300 hover:-translate-y-1 hover:border-[#d3a65f]/40">
      <div className="relative aspect-[4/4.3] overflow-hidden rounded-[14px] bg-[#4e2927]/35">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(213,157,75,0.18),transparent_55%)]" />

        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="relative z-10 h-full w-full object-contain p-3 transition duration-700 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#5c302c] to-[#251316]" />
        )}

        {product.videoUrl && (
          <span className="absolute bottom-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/55 text-[#e5b96e] backdrop-blur-md">
            <Play size={10} fill="currentColor" />
          </span>
        )}
      </div>

      <div className="p-2.5">
        <p className="text-[5px] font-bold uppercase tracking-[0.18em] text-[#c99860]">
          Signature
        </p>

        <h4 className="font-beauty mt-1 truncate text-[16px] font-semibold text-[#fff2e9] sm:text-[18px]">
          {product.name}
        </h4>

        <p className="mt-1 line-clamp-2 text-[7px] leading-4 text-[#bca6aa]">
          {product.shortDescription ||
            "A premium HoneyGlow signature essential."}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#edbd70]">
            Rs.{" "}
            {Number(
              finalPrice
            ).toLocaleString()}
          </span>

          {product.discountPrice && (
            <span className="text-[6px] text-white/30 line-through">
              Rs.{" "}
              {Number(
                product.originalPrice
              ).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function FeatureTag({
  icon,
  text,
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#d2a05a]/15 bg-[#d1a05a]/5 px-3 py-2.5">
      <span className="text-[#dcad65]">
        {icon}
      </span>

      <span className="text-[7px] font-bold uppercase tracking-[0.11em] text-[#d9c1ba]">
        {text}
      </span>
    </div>
  );
}

function BottomFeature({
  icon,
  title,
  text,
}) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-[#d2a15a]/15 bg-[#32191d]/70 px-4 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d19a4f]/10 text-[#dcaf68]">
        {icon}
      </span>

      <div>
        <p className="text-[8px] font-bold text-[#ead8cf]">
          {title}
        </p>

        <p className="mt-0.5 text-[7px] text-white/35">
          {text}
        </p>
      </div>
    </div>
  );
}

function SignatureSkeleton() {
  return (
    <section className="bg-[#1d1012] px-4 py-16 sm:px-7 lg:px-10 xl:px-14">
      <div className="mx-auto max-w-[1450px]">
        <div className="h-[45px] w-[260px] animate-pulse rounded-xl bg-white/5" />

        <div className="mt-7 min-h-[520px] animate-pulse rounded-[34px] bg-[#351b20]" />
      </div>
    </section>
  );
}

export default SignatureShowcase;