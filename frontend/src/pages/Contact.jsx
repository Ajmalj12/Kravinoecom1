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
    <div className="min-h-screen bg-white w-full">
      {/* Title Section */}
      <motion.div 
        className="text-center pt-4 sm:pt-8 pb-8 sm:pb-12 px-4 sm:px-6" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        <Title text1={title1} text2={title2} />
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16 px-4 sm:px-6"
      >
        {heroImage && (
          <div className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
            <img src={heroImage} className="w-full h-full object-cover" alt="Contact Hero" />
          </div>
        )}
      </motion.div>

      {/* Contact Information Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-16 px-4 sm:px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Address Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">{pageContent?.contact?.locationTitle || 'Our Location'}</h3>
            <p className="text-gray-600 leading-relaxed mb-2">{address}</p>
            <p className="text-gray-600 leading-relaxed">{pageContent?.contact?.addressLine2 || ''}</p>
            <p className="text-gray-600 leading-relaxed">{pageContent?.contact?.city || ''} {pageContent?.contact?.zipCode || ''}</p>
          </motion.div>

          {/* Contact Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">{pageContent?.contact?.contactTitle || 'Get In Touch'}</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <span className="font-medium mr-2">Phone:</span>
                <span>{phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium mr-2">Email:</span>
                <span>{email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium mr-2">Hours:</span>
                <span>{pageContent?.contact?.hours || 'Mon-Fri 9AM-6PM'}</span>
              </div>
            </div>
          </motion.div>

          {/* Support Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1"
          >
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">{pageContent?.contact?.supportTitle || 'Customer Support'}</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{pageContent?.contact?.supportDescription || 'Need help with your order? Our customer support team is here to assist you with any questions or concerns.'}</p>
            <button className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              {pageContent?.contact?.supportButtonText || 'Contact Support'}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mb-16 px-4 sm:px-6"
      >
        <div className="bg-gray-50 rounded-lg p-8 sm:p-12 border border-gray-200">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-black text-center mb-8">{pageContent?.contact?.formTitle || 'Send us a Message'}</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  {pageContent?.contact?.submitButtonText || 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Map Section */}
      {pageContent?.contact?.mapEmbedCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mb-16 px-4 sm:px-6"
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="h-96 w-full" dangerouslySetInnerHTML={{ __html: pageContent.contact.mapEmbedCode }}></div>
          </div>
        </motion.div>
      )}

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

export default Contact;
