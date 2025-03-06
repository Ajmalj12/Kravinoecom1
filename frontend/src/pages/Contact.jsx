import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import Title from "../components/Title";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white px-6 py-12 flex flex-col items-center">
      {/* Title Section */}
      <motion.div
        className="text-center text-black"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title text1="Let's" text2="Connect" />
        <p className="mt-3 text-lg max-w-xl mx-auto text-gray-600">
          Have questions? Need support? We're here to help! Contact us and let's start something amazing together.
        </p>
      </motion.div>

      {/* Contact Card Section */}
      <motion.div
        className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-10 max-w-6xl w-full bg-gray-100 shadow-xl rounded-2xl p-8 border border-gray-300"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Left Side: Image */}
        <div className="w-full sm:w-1/2 flex justify-center">
          <motion.img
            src={assets.contact_img}
            alt="Contact Us"
            className="rounded-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Right Side: Contact Details */}
        <div className="w-full sm:w-1/2 flex flex-col gap-6 text-black">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold">📍 Our Store</h3>
            <p className="text-lg opacity-90 mt-1">
              Ayoor,Kollam <br /> kerala,India
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold">📞 Contact Info</h3>
            <p className="text-lg opacity-90 mt-1">
              Tel: +91 9999999999 <br /> Email: admin@thestore.com
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h3 className="text-2xl font-bold">🚀 Careers at The Store</h3>
            <p className="text-lg opacity-90 mt-1">
              Join our growing team and make an impact with us!
            </p>
          </motion.div>

          <motion.button
            className="mt-4 w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105 hover:bg-blue-500"
            whileHover={{ scale: 1.1 }}
          >
            Explore Jobs
          </motion.button>
        </div>
      </motion.div>

      {/* Newsletter Section */}
      <motion.div
        className="mt-16 w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <NewsletterBox />
      </motion.div>
    </div>
  );
};

export default Contact;
