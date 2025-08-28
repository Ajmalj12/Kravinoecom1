import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import CategoryNavigation from "../components/CategoryNavigation";
import HeroBanner from "../components/HeroBanner";
import TopBanner from "../components/TopBanner";
import MiddleBanner from "../components/MiddleBanner";
import ProductSection from "../components/ProductSection";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";

const Home = () => {
  const { products } = useContext(ShopContext);

  // Filter products for different sections
  const latestProducts = products.slice(0, 10);
  const bestSellers = products.filter(item => item.bestSeller).slice(0, 10);
  const liveOffers = products.filter(item => item.discountInfo && item.discountInfo.discountedPrice < item.discountInfo.originalPrice).slice(0, 10);

  return (
    <div className="bg-gray-50 min-h-screen">
      <CategoryNavigation />
      <HeroBanner />
      
      <ProductSection
        title="Latest Collection"
        products={latestProducts}
        viewAllLink="/collection"
        fullWidth={true}
      />

      <TopBanner />

      <ProductSection
        title="Live Offers"
        products={liveOffers}
        viewAllLink="/collection?discount=true"
        fullWidth={true}
      />

      <MiddleBanner />
      
      <ProductSection
        title="Best Sellers"
        products={bestSellers}
        viewAllLink="/collection?bestseller=true"
        fullWidth={true}
      />
      
      <div className="bg-white mt-8">
        <OurPolicy />
        <NewsletterBox />
      </div>
    </div>
  );
};

export default Home;
