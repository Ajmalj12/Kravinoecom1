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
    <div className="bg-white text-gray-800 min-h-screen w-full">
      {/* Title Section */}
      <motion.div
        className="text-2xl text-center pt-4 sm:pt-8 pb-8 sm:pb-12 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Title text1={aboutTitle1} text2={aboutTitle2} />
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 px-4 sm:px-6"
      >
        {aboutHeroImage && (
          <div className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
            <img src={aboutHeroImage} className="w-full h-full object-cover" alt="About Hero" />
          </div>
        )}
      </motion.div>

      {/* About Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16 px-4 sm:px-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-6">{pageContent?.about?.mainTitle || 'Our Story'}</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">{aboutBody1}</p>
            <p className="text-gray-700 text-lg leading-relaxed">{pageContent?.about?.story || `Founded with a passion for fashion and a commitment to quality, ${siteName} has grown from a small startup to a trusted name in online retail. We believe that great style should be accessible to everyone.`}</p>
          </div>

          {/* Features Box */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-6">{aboutBody2}</h2>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-black rounded-full mr-4"></div>
                <span className="text-lg">{pageContent?.about?.feature1 || 'Trendy & Timeless Styles'}</span>
              </li>
              <li className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-black rounded-full mr-4"></div>
                <span className="text-lg">{pageContent?.about?.feature2 || 'Fast & Secure Shipping'}</span>
              </li>
              <li className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-black rounded-full mr-4"></div>
                <span className="text-lg">{pageContent?.about?.feature3 || 'Secure Payments'}</span>
              </li>
              <li className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-black rounded-full mr-4"></div>
                <span className="text-lg">{pageContent?.about?.feature4 || 'Hassle-Free Returns'}</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-16 px-4 sm:px-6"
      >
        <div className="bg-gray-50 rounded-lg p-8 sm:p-12 border border-gray-200">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-6">{aboutBody3}</h2>
            <p className="text-xl text-gray-700 leading-relaxed">{aboutBody4}</p>
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-16 px-4 sm:px-6"
      >
        <div className="text-center mb-12">
          <Title text1={pageContent?.about?.whyTitle1 || 'WHY'} text2={pageContent?.about?.whyTitle2 || 'CHOOSE US'} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.8 }} 
            className="bg-white border border-gray-200 p-8 flex flex-col gap-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <h3 className="text-xl font-bold text-black">{pageContent?.about?.why1Title || 'Quality Assurance'}</h3>
            <p className="text-gray-600 leading-relaxed">{pageContent?.about?.why1Body || 'We meticulously select and vet each product to ensure it meets our stringent quality standards.'}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 1.0 }} 
            className="bg-white border border-gray-200 p-8 flex flex-col gap-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <h3 className="text-xl font-bold text-black">{pageContent?.about?.why2Title || 'Convenience'}</h3>
            <p className="text-gray-600 leading-relaxed">{pageContent?.about?.why2Body || 'With our user-friendly interface and hassle-free ordering process, shopping has never been easier.'}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 1.2 }} 
            className="bg-white border border-gray-200 p-8 flex flex-col gap-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1"
          >
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <h3 className="text-xl font-bold text-black">{pageContent?.about?.why3Title || 'Exceptional Customer Service'}</h3>
            <p className="text-gray-600 leading-relaxed">{pageContent?.about?.why3Body || 'Our team of dedicated professionals is here to assist you every step of the way, ensuring your satisfaction is our top priority.'}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="mb-16 px-4 sm:px-6"
      >
        <div className="bg-black text-white rounded-lg p-8 sm:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold mb-2">{pageContent?.about?.stat1Number || '10K+'}</h3>
              <p className="text-gray-300">{pageContent?.about?.stat1Label || 'Happy Customers'}</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">{pageContent?.about?.stat2Number || '500+'}</h3>
              <p className="text-gray-300">{pageContent?.about?.stat2Label || 'Products'}</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">{pageContent?.about?.stat3Number || '50+'}</h3>
              <p className="text-gray-300">{pageContent?.about?.stat3Label || 'Brands'}</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">{pageContent?.about?.stat4Number || '99%'}</h3>
              <p className="text-gray-300">{pageContent?.about?.stat4Label || 'Satisfaction'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 1.6 }} 
        className="mb-16 px-4 sm:px-6"
      >
        <NewsletterBox />
      </motion.div>
    </div>
  );
};

export default About;
