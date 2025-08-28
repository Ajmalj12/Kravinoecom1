import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import NewsletterBox from "../components/NewsletterBox";
import Title from "../components/Title";
import { motion } from "framer-motion";

const About = () => {
  const { pageContent } = useContext(ShopContext);
  const siteName = pageContent?.global?.siteName || 'The Store';
  const aboutHeroImage = pageContent?.about?.heroImage;
  const aboutTitle1 = pageContent?.about?.title1 || 'ABOUT';
  const aboutTitle2 = pageContent?.about?.title2 || 'US';
  const aboutBody1 = pageContent?.about?.body1 || `Welcome to ${siteName}, your ultimate destination for trendy, stylish, and high-quality fashion.`;
  const aboutBody2 = pageContent?.about?.body2 || `Why Shop With Us?`;
  const aboutBody3 = pageContent?.about?.body3 || `Our Mission`;
  const aboutBody4 = pageContent?.about?.body4 || `At ${siteName}, our mission is to empower individuals through fashion by offering affordable, high-quality, and stylish apparel.`;

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Title Section */}
      <motion.div
        className="text-2xl text-center pt-8 border-t pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Title text1={aboutTitle1} text2={aboutTitle2} />
      </motion.div>

      {/* About Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="my-10 flex flex-col md:flex-row gap-16 mx-6 md:mx-16"
      >
        {aboutHeroImage ? (
          <img src={aboutHeroImage} className="w-full md:max-w-[450px] rounded-lg shadow-lg" alt="About" />
        ) : null}
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p className="text-lg leading-relaxed">{aboutBody1}</p>
          <div>
            <h2 className="text-xl font-semibold mb-2">{aboutBody2}</h2>
            <ul className="list-disc list-inside text-lg leading-relaxed space-y-1">
              <li>Trendy & Timeless Styles</li>
              <li>Fast & Secure Shipping</li>
              <li>Secure Payments</li>
              <li>Hassle-Free Returns</li>
            </ul>
          </div>

          <b className="text-gray-800 text-xl">{aboutBody3}</b>
          <p className="text-lg leading-relaxed">{aboutBody4}</p>
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <div className="text-xl py-4">
        <Title text1={pageContent?.about?.whyTitle1 || 'WHY'} text2={pageContent?.about?.whyTitle2 || 'CHOOSE US'} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20 gap-6 mx-6 md:mx-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="border p-6 md:p-10 flex flex-col gap-5 rounded-lg shadow-lg">
          <b className="text-xl text-gray-700">{pageContent?.about?.why1Title || 'Quality Assurance'}</b>
          <p className="text-gray-600">{pageContent?.about?.why1Body || 'We meticulously select and vet each product to ensure it meets our stringent quality standard.'}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="border p-6 md:p-10 flex flex-col gap-5 rounded-lg shadow-lg">
          <b className="text-xl text-gray-700">{pageContent?.about?.why2Title || 'Convenience'}</b>
          <p className="text-gray-600">{pageContent?.about?.why2Body || 'With our user-friendly interface and hassle-free ordering process, shopping has never been easier.'}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="border p-6 md:p-10 flex flex-col gap-5 rounded-lg shadow-lg">
          <b className="text-xl text-gray-700">{pageContent?.about?.why3Title || 'Exceptional Customer Service'}</b>
          <p className="text-gray-600">{pageContent?.about?.why3Body || 'Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.'}</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="mb-16">
        <NewsletterBox />
      </motion.div>
    </div>
  );
};

export default About;
