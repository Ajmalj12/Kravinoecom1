import BestSeller from "../components/BestSeller";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import Banner from "../components/Banner";
import LiveOffers from "../components/LiveOffers";

const Home = () => {
  return (
    <div>
      <Hero />
      <Banner section="hero" />
      <LatestCollection />
      <LiveOffers />
      <BestSeller />
      <OurPolicy />
      <Banner section="home" />
      <NewsletterBox />
      <Banner section="footer" />
    </div>
  );
};

export default Home;
