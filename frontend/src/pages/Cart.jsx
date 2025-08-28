import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import LoginModal from "../components/LoginModal";
import NewsletterBox from "../components/NewsletterBox";
import { motion } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

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
              Shopping Cart
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Review your selected items and proceed to checkout
          </p>
        </div>
      </motion.div>

      {/* Main Cart Content */}
      <div className="w-full py-8 md:py-12">
        <div className="w-full px-4 md:px-6 lg:px-8">
          {cartData.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12 text-center">
              <div className="mb-6">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600">Looks like you haven't added any items to your cart yet.</p>
              </div>
              <button 
                className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
                onClick={() => {
                  console.log('Empty cart continue shopping clicked');
                  navigate('/collection');
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Cart Items ({cartData.length})</h2>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {cartData.map((item, i) => {
                      const productsData = products.find(
                        (product) => product._id === item._id
                      );

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="p-6 hover:bg-gray-50 transition-colors relative"
                          style={{ pointerEvents: 'auto', zIndex: 1 }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Product Image */}
                            <div 
                              className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                              onClick={() => navigate(`/product/${productsData._id}`)}
                            >
                              <img
                                src={productsData.image[0]}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                alt={productsData.name}
                              />
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h3 
                                className="text-lg font-medium text-gray-900 mb-2 truncate cursor-pointer hover:text-gray-600 transition-colors"
                                onClick={() => navigate(`/product/${productsData._id}`)}
                              >
                                {productsData.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                                  Size: {item.size}
                                </span>
                                {productsData.discountInfo && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold">
                                    {productsData.discountInfo.discount.type === 'percentage' 
                                      ? `${productsData.discountInfo.discount.value}% OFF` 
                                      : `${currency}${productsData.discountInfo.discount.value} OFF`}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-4">
                                {productsData.discountInfo ? (
                                  <>
                                    <span className="text-xl font-bold text-red-600">
                                      {currency}{productsData.finalPrice.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      {currency}{productsData.price.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xl font-bold text-gray-900">
                                    {currency}{productsData.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              
                              {/* Quantity Controls - Moved under product info */}
                              <div className="flex items-center gap-4" style={{ pointerEvents: 'auto', zIndex: 10 }}>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      console.log('Minus clicked for:', item._id, item.size);
                                      updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1));
                                    }}
                                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 relative z-20"
                                    disabled={item.quantity <= 1}
                                    style={{ pointerEvents: 'auto' }}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="px-4 py-2 bg-gray-50 font-medium min-w-[3rem] text-center select-none">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      console.log('Plus clicked for:', item._id, item.size);
                                      updateQuantity(item._id, item.size, item.quantity + 1);
                                    }}
                                    className="p-2 hover:bg-gray-100 transition-colors relative z-20"
                                    style={{ pointerEvents: 'auto' }}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log('Remove clicked for:', item._id, item.size);
                                    updateQuantity(item._id, item.size, 0);
                                  }}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors relative z-20 bg-white"
                                  title="Remove item"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                  </div>
                  
                  <div className="p-6">
                    <CartTotal />
                    
                    <div className="mt-6 space-y-3">
                      <button
                        type="button"
                        className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors font-medium text-lg cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Checkout clicked, token:', !!token);
                          if (token) {
                            navigate("/place-order");
                          } else {
                            setShowLoginModal(true);
                          }
                        }}
                        style={{
                          position: 'relative',
                          zIndex: 100,
                          pointerEvents: 'auto'
                        }}
                      >
                        PROCEED TO CHECKOUT
                      </button>
                      
                      <button
                        type="button"
                        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Continue shopping clicked');
                          navigate('/collection');
                        }}
                        style={{
                          position: 'relative',
                          zIndex: 100,
                          pointerEvents: 'auto'
                        }}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterBox />
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLoginSuccess={() => navigate("/place-order")}
      />
    </div>
  );
};

export default Cart;
