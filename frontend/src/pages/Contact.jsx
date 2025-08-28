import { useContext } from "react";
import NewsletterBox from "../components/NewsletterBox";
import Title from "../components/Title";
import { motion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";

const Contact = () => {
  const { pageContent } = useContext(ShopContext);
  const title1 = pageContent?.contact?.title1 || "Let's";
  const title2 = pageContent?.contact?.title2 || "Connect";
  const subtitle = pageContent?.contact?.subtitle || "Have questions? Need support? We're here to help!";
  const addressTitle = pageContent?.contact?.addressTitle || "📍 Our Store";
  const address = pageContent?.contact?.address || "City, Country";
  const infoTitle = pageContent?.contact?.infoTitle || "📞 Contact Info";
  const phone = pageContent?.global?.phone || pageContent?.contact?.phone || "+91 9999999999";
  const email = pageContent?.global?.email || pageContent?.contact?.email || "admin@thestore.com";
  const careersTitle = pageContent?.contact?.careersTitle || "🚀 Careers";
  const careersBody = pageContent?.contact?.careersBody || "Join our growing team and make an impact with us!";
  const heroImage = pageContent?.contact?.heroImage;

  return (
    <div className="min-h-screen bg-white px-6 py-12 flex flex-col items-center">
      <motion.div className="text-center text-black" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Title text1={title1} text2={title2} />
        <p className="mt-3 text-lg max-w-xl mx-auto text-gray-600">{subtitle}</p>
      </motion.div>

      <motion.div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-10 max-w-6xl w-full bg-gray-100 shadow-xl rounded-2xl p-8 border border-gray-300" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <div className="w-full sm:w-1/2 flex justify-center">
          {heroImage ? (
            <motion.img src={heroImage} alt="Contact" className="rounded-xl shadow-lg" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} />
          ) : null}
        </div>

        <div className="w-full sm:w-1/2 flex flex-col gap-6 text-black">
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h3 className="text-2xl font-bold">{addressTitle}</h3>
            <p className="text-lg opacity-90 mt-1">{address}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <h3 className="text-2xl font-bold">{infoTitle}</h3>
            <p className="text-lg opacity-90 mt-1">Tel: {phone} <br /> Email: {email}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
            <h3 className="text-2xl font-bold">{careersTitle}</h3>
            <p className="text-lg opacity-90 mt-1">{careersBody}</p>
          </motion.div>

          <motion.a href="#" className="mt-4 w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105 hover:bg-blue-500" whileHover={{ scale: 1.1 }}>
            Explore Jobs
          </motion.a>
        </div>
      </motion.div>

      <motion.div className="mt-16 w-full max-w-4xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }}>
        <NewsletterBox />
      </motion.div>
    </div>
  );
};

export default Contact;
