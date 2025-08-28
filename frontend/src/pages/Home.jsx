import BestSeller from "../components/BestSeller";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div>
      <Hero />
      <Banner position="home" />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <Banner position="footer" />
      <NewsletterBox />
    </div>
  );
};

export default Home;
