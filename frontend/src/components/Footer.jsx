import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="bg-white py-16 text-gray-800">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="flex flex-col sm:grid grid-cols-3 gap-10 sm:gap-20">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center sm:text-left"
          >
            <h1 className="text-2xl font-bold text-gray-800">The Store</h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600"
            >
              Discover the latest fashion trends at The Store. Shop stylish clothing, accessories, and footwear for every occasion. Enjoy fast shipping, secure payments, and easy returns. Elevate your wardrobe with top-quality fashion at unbeatable prices. Your go-to destination for trendy and timeless styles!
            </motion.p>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center sm:text-left"
          >
            <p className="text-xl font-semibold text-gray-700 mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600">
  <motion.li 
    whileHover={{ scale: 1.05, color: "#FF6347" }} 
    className="cursor-pointer" 
    onClick={() => (window.location.href = "/")}
  >
    Home
  </motion.li>
  <motion.li 
    whileHover={{ scale: 1.05, color: "#FF6347" }} 
    className="cursor-pointer" 
    onClick={() => (window.location.href = "/about")}
  >
    About Us
  </motion.li>
  <motion.li 
    whileHover={{ scale: 1.05, color: "#FF6347" }} 
    className="cursor-pointer" 
    onClick={() => (window.location.href = "/about")}
  >
    Delivery
  </motion.li>
  <motion.li 
    whileHover={{ scale: 1.05, color: "#FF6347" }} 
    className="cursor-pointer" 
    onClick={() => (window.location.href = "/about")}
  >
    Privacy Policy
  </motion.li>
</ul>

          </motion.div>

          {/* Get In Touch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center sm:text-left"
          >
            <p className="text-xl font-semibold text-gray-700 mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <motion.li whileHover={{ scale: 1.05, color: "#FF6347" }} className="cursor-pointer">
                +91 9999999999
              </motion.li>
              <motion.li whileHover={{ scale: 1.05, color: "#FF6347" }} className="cursor-pointer">
                contact@thestore.com
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 border-t border-gray-300 pt-5"
        >
          <p className="text-sm text-center text-gray-600">
            Copyright 2025@ The Store - All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Footer;
