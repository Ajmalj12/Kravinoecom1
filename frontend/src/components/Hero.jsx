import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row bg-white py-20 px-6 sm:px-12 text-black">
      {/* Left Section - Text & Call to Action */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="w-full sm:w-1/2 flex flex-col justify-center items-start gap-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8 }}
            className="h-[2px] bg-black"
          ></motion.div>
          <p className="font-medium text-sm md:text-base">OUR EXCLUSIVE DEALS</p>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl font-bold leading-tight"
        >
          Discover the Best of Our Collection
        </motion.h1>

        <p className="text-lg md:text-xl mt-4">
          Experience top-notch quality and exclusive deals on our latest arrivals.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-6"
        >
          <a href="/collection" className="bg-black text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-all ease-in-out duration-300">
  Shop Now
</a>

        </motion.div>
      </motion.div>

      {/* Right Section - Decorative Graphic */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="w-full sm:w-1/2 flex items-center justify-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-40"></div>
        <div className="relative z-10 text-center text-xl font-semibold">
          <p className="text-black">Elevate Your Shopping Experience</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
