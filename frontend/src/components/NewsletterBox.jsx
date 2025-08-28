import { motion } from "framer-motion";
import { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import "react-toastify/dist/ReactToastify.css";

const NewsletterBox = () => {
  const { pageContent } = useContext(ShopContext);
  const [email, setEmail] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (email.trim() === "") return;

    // Show success message
    toast.success("Subscribed successfully!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "light",
    });

    // Clear input after submission
    setEmail("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-black via-gray-900 to-black text-white rounded-2xl shadow-2xl overflow-hidden mx-4 sm:mx-6 mb-16"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]" />
      </div>
      
      <div className="relative z-10 px-8 sm:px-12 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                  {pageContent?.newsletter?.title || 'Stay In The Loop'}
                </h2>
                <div className="w-20 h-1 bg-white mx-auto lg:mx-0 mb-6"></div>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {pageContent?.newsletter?.subtitle || 'Subscribe now & get 20% off your first order'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <p className="text-gray-400 text-lg mb-6">
                  {pageContent?.newsletter?.description || 'Join thousands of fashion lovers and get exclusive access to:'}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-gray-300">{pageContent?.newsletter?.benefit1 || 'Early access to sales'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-gray-300">{pageContent?.newsletter?.benefit2 || 'Exclusive discounts'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-gray-300">{pageContent?.newsletter?.benefit3 || 'New arrivals first'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-gray-300">{pageContent?.newsletter?.benefit4 || 'Style tips & trends'}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-20"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  {pageContent?.newsletter?.formTitle || 'Get Your Discount'}
                </h3>
                <p className="text-gray-300">
                  {pageContent?.newsletter?.formSubtitle || 'Enter your email and unlock 20% off'}
                </p>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-4">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    type="email"
                    placeholder={pageContent?.newsletter?.placeholder || "Enter your email address"}
                    className="w-full px-6 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent transition-all duration-300"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                >
                  {pageContent?.newsletter?.buttonText || 'CLAIM MY 20% OFF'}
                </motion.button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                {pageContent?.newsletter?.disclaimer || 'No spam, unsubscribe anytime. By subscribing you agree to our Terms & Privacy Policy.'}
              </p>
            </motion.div>
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 pt-8 border-t border-white border-opacity-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">{pageContent?.newsletter?.stat1Number || '50K+'}</div>
                <div className="text-gray-400 text-sm">{pageContent?.newsletter?.stat1Label || 'Subscribers'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{pageContent?.newsletter?.stat2Number || '20%'}</div>
                <div className="text-gray-400 text-sm">{pageContent?.newsletter?.stat2Label || 'Average Savings'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{pageContent?.newsletter?.stat3Number || '24/7'}</div>
                <div className="text-gray-400 text-sm">{pageContent?.newsletter?.stat3Label || 'Support'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{pageContent?.newsletter?.stat4Number || '5★'}</div>
                <div className="text-gray-400 text-sm">{pageContent?.newsletter?.stat4Label || 'Rating'}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer />
    </motion.div>
  );
};

export default NewsletterBox;
