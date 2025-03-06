import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import Title from "../components/Title";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Title Section */}
      <motion.div
        className="text-2xl text-center pt-8 border-t pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Title text1={"ABOUT"} text2={"US"} />
      </motion.div>

      {/* About Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="my-10 flex flex-col md:flex-row gap-16 mx-6 md:mx-16"
      >
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px] rounded-lg shadow-lg"
          alt="About Image"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p className="text-lg leading-relaxed">
          Welcome to The Store, your ultimate destination for trendy, stylish, and high-quality fashion. We believe fashion is more than just clothing—it’s a statement, an expression of individuality, and a way to embrace confidence in every step.
          </p>
          <p className="text-lg leading-relaxed">
          <h1>Why Shop With Us?</h1>
✨ Trendy & Timeless Styles – A wide range of fashion-forward pieces for every occasion.
🚀 Fast & Secure Shipping – Get your orders quickly and safely delivered to your doorstep.
💳 Secure Payments – Shop with confidence using our trusted payment options.
🔄 Hassle-Free Returns – Easy returns and exchanges for a seamless shopping experience.
          </p>

          <b className="text-gray-800 text-xl">Our Mission</b>
          <p className="text-lg leading-relaxed">
          At The Store, our mission is to empower individuals through fashion by offering affordable, high-quality, and stylish apparel. Whether you're dressing up for an event or keeping it casual, we’ve got something special for you.

Join us on our journey and make every outfit a statement. Happy shopping! 💖


          </p>
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20 gap-6 mx-6 md:mx-16">
        {/* Quality Assurance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border p-6 md:p-10 flex flex-col gap-5 rounded-lg shadow-lg"
        >
          <b className="text-xl text-gray-700">Quality Assurance:</b>
          <p className="text-gray-600">
            We meticulously select and vet each product to ensure it meets our
            stringent quality standard.
          </p>
        </motion.div>

        {/* Convenience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border p-6 md:p-10 flex flex-col gap-5 rounded-lg shadow-lg"
        >
          <b className="text-xl text-gray-700">Convenience:</b>
          <p className="text-gray-600">
            With our user-friendly interface and hassle-free ordering process,
            shopping has never been easier.
          </p>
        </motion.div>

        {/* Exceptional Customer Service */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border p-6 md:p-10 flex flex-col gap-5 rounded-lg shadow-lg"
        >
          <b className="text-xl text-gray-700">Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Our team of dedicated professionals is here to assist you the way,
            ensuring your satisfaction is our top priority.
          </p>
        </motion.div>
      </div>

      {/* Newsletter Subscription */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-16"
      >
        <NewsletterBox />
      </motion.div>
    </div>
  );
};

export default About;
