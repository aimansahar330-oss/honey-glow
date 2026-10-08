import Hero from "../components/Hero";
import SignatureShowcase from "../components/SignatureShowcase";
import CategoryShowcase from "../components/CategoryShowcase";
import FeaturedProducts from "../components/FeaturedProducts";

function Home() {
  return (
    <>
      <Hero />

      <SignatureShowcase />

      <CategoryShowcase />

      <FeaturedProducts />
    </>
  );
}

export default Home;