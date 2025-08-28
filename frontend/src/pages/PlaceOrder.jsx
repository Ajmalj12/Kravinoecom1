import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import AddressSelection from "../components/AddressSelection";
import NewsletterBox from "../components/NewsletterBox";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { CreditCard, Truck, MapPin, ShoppingBag } from "lucide-react";

const PlaceOrder = () => {
  const {
    products,
    delivery_fee,
    cartItems,
    getCartAmount,
    getOriginalCartAmount,
    getTotalDiscount,
    navigate,
    backendUrl,
    token,
    setCartItems,
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const onSubmitHandler = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Check if address is selected
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      // Show processing toast
      toast.info("Processing your order...");
      
      const orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );

            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              // Use backend-calculated final price
              if (itemInfo.finalPrice) {
                itemInfo.price = itemInfo.finalPrice;
              }
              orderItems.push(itemInfo);
            }
          }
        }
      }

      // Check if cart is empty
      if (orderItems.length === 0) {
        toast.error("Your cart is empty. Please add items before placing an order.");
        return;
      }

      let orderData = {
        address: selectedAddress,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        originalAmount: getOriginalCartAmount() + delivery_fee,
        totalDiscount: getTotalDiscount(),
      };

      // Log the order data for debugging
      console.log("Placing order with data:", orderData);

      switch (method) {
        //API CALLS FOR COD
        case "cod":
          const res = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          console.log("COD order response:", res.data);
          
          if (res.data.success) {
            toast.success("Order placed successfully!");
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(res.data.message || "Failed to place order");
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          console.log("Stripe order response:", responseStripe.data);

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message || "Failed to create payment session");
          }
          break;

        default:
          toast.error("Please select a payment method");
          break;
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || error.message || "An error occurred while placing your order");
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gradient-to-r from-gray-50 to-gray-100 py-16 md:py-20"
      >
        <div className="w-full px-4 md:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-700" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Checkout
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your order by selecting delivery address and payment method
          </p>
        </div>
      </motion.div>

      {/* Main Checkout Content */}
      <div className="w-full py-8 md:py-12" style={{ position: 'relative', zIndex: 1 }}>
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Address Selection */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-gray-700" />
                    <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Choose where you want your order delivered</p>
                </div>
                
                <div className="p-6" style={{ position: 'relative', zIndex: 2 }}>
                  <AddressSelection
                    onAddressSelect={handleAddressSelect}
                    selectedAddressId={selectedAddress?._id}
                  />
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-6"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-gray-700" />
                    <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Select your preferred payment option</p>
                </div>
                
                <div className="p-6" style={{ position: 'relative', zIndex: 2 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Stripe payment selected');
                        setMethod("stripe");
                      }}
                      className={`flex items-center gap-4 border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        method === "stripe" 
                          ? "border-black bg-gray-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ 
                        pointerEvents: 'auto', 
                        zIndex: 50,
                        position: 'relative',
                        touchAction: 'manipulation'
                      }}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        method === "stripe" ? "border-black" : "border-gray-300"
                      }`}>
                        {method === "stripe" && (
                          <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <img src={assets.stripe_logo} className="h-6" alt="Stripe" />
                        <div>
                          <p className="font-medium text-gray-900">Credit/Debit Card</p>
                          <p className="text-sm text-gray-500">Secure payment with Stripe</p>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('COD payment selected');
                        setMethod("cod");
                      }}
                      className={`flex items-center gap-4 border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        method === "cod" 
                          ? "border-black bg-gray-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ 
                        pointerEvents: 'auto', 
                        zIndex: 50,
                        position: 'relative',
                        touchAction: 'manipulation'
                      }}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        method === "cod" ? "border-black" : "border-gray-300"
                      }`}>
                        {method === "cod" && (
                          <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Truck className="w-6 h-6 text-gray-700" />
                        <div>
                          <p className="font-medium text-gray-900">Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Pay when you receive</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-8"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>
                
                <div className="p-6" style={{ position: 'relative', zIndex: 3 }}>
                  <CartTotal />
                  
                  <button
                    type="button"
                    className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors font-medium text-lg mt-6 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Place Order button clicked');
                      onSubmitHandler(e);
                    }}
                    style={{ 
                      pointerEvents: 'auto', 
                      zIndex: 100,
                      position: 'relative',
                      touchAction: 'manipulation'
                    }}
                  >
                    PLACE ORDER
                  </button>
                  
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      By placing this order, you agree to our terms and conditions
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterBox />
    </div>
  );
};

export default PlaceOrder;
