import Hero from "../components/Hero";
import SignatureShowcase from "../components/SignatureShowcase";
import CategoryShowcase from "../components/CategoryShowcase";
import FeaturedProducts from "../components/FeaturedProducts";
import WhatsAppFloat from "../components/WhatsAppFloat";


function Home() {
  return (
    <>
      <Hero />

      <SignatureShowcase />

      <CategoryShowcase />

      <FeaturedProducts />

      <WhatsAppFloat />
    </>
  );
}

export default Home;