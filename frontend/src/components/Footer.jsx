import { motion } from "framer-motion";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const Footer = () => {
  const { pageContent } = useContext(ShopContext);
  const siteName = pageContent?.global?.siteName || 'The Store';
  const footerAbout = pageContent?.global?.footerAbout || `Discover the latest fashion trends at ${siteName}.`;
  const phone = pageContent?.global?.phone || '+91 9999999999';
  const email = pageContent?.global?.email || 'contact@thestore.com';
  const copyright = pageContent?.global?.copyright || `Copyright 2025@ ${siteName} - All Rights Reserved.`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg mx-4 my-4 overflow-hidden">
      <div className="px-6 sm:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left w-full"
          >
            <h1 className="text-2xl font-bold text-gray-800">{siteName}</h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600"
            >
              {footerAbout}
            </motion.p>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center w-full"
          >
            <p className="text-xl font-semibold text-gray-700 mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600">
                <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer hover:text-black transition-colors" onClick={() => (window.location.href = "/")}>
                Home
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer hover:text-black transition-colors" onClick={() => (window.location.href = "/about")}>
                About Us
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer hover:text-black transition-colors" onClick={() => (window.location.href = "/about")}>
                Delivery
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer hover:text-black transition-colors" onClick={() => (window.location.href = "/about")}>
                Privacy Policy
              </motion.li>
            </ul>

          </motion.div>

          {/* Get In Touch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-right w-full"
          >
            <p className="text-xl font-semibold text-gray-700 mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer hover:text-black transition-colors">
                {phone}
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer hover:text-black transition-colors">
                {email}
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200 col-span-full w-full"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-sm text-gray-600">
              {copyright}
            </p>
            <div className="flex gap-4 text-sm text-gray-600">
              <span className="hover:text-black cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-black cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-black cursor-pointer transition-colors">Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Footer;
