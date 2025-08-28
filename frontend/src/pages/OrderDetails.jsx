import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, User, Phone, Truck, CheckCircle, Clock, AlertCircle, ShoppingBag, Receipt, Tag } from "lucide-react";
import NewsletterBox from "../components/NewsletterBox";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrderDetails = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        const order = res.data.orders.find(order => order._id === orderId);
        if (order) {
          setOrderData(order);
        } else {
          toast.error("Order not found");
          navigate('/orders');
        }
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      toast.error("Failed to load order details");
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && orderId) {
      loadOrderDetails();
    }
  }, [token, orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed': return 'bg-blue-500';
      case 'Packing': return 'bg-yellow-500';
      case 'Shipped': return 'bg-orange-500';
      case 'Out for delivery': return 'bg-purple-500';
      case 'Delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed': return <Clock className="w-5 h-5" />;
      case 'Packing': return <Package className="w-5 h-5" />;
      case 'Shipped': return <Truck className="w-5 h-5" />;
      case 'Out for delivery': return <Truck className="w-5 h-5" />;
      case 'Delivered': return <CheckCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const orderSteps = [
    { status: 'Order Placed', label: 'Order Placed', icon: <Clock className="w-4 h-4" /> },
    { status: 'Packing', label: 'Packing', icon: <Package className="w-4 h-4" /> },
    { status: 'Shipped', label: 'Shipped', icon: <Truck className="w-4 h-4" /> },
    { status: 'Out for delivery', label: 'Out for Delivery', icon: <Truck className="w-4 h-4" /> },
    { status: 'Delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const getCurrentStepIndex = () => {
    return orderSteps.findIndex(step => step.status === orderData?.status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="w-full min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center max-w-2xl mx-auto mt-20"
        >
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-4">Order Not Found</h3>
          <p className="text-gray-600 text-lg mb-8">The order you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </button>
        </motion.div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-gray-50 via-white to-gray-50 border-b border-gray-200"
      >
        <div className="px-4 sm:px-6 py-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.button
              onClick={() => navigate('/orders')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Orders
            </motion.button>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Order Details
            </h1>
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Order #{orderData._id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="w-full px-4 sm:px-6 py-6">
        <div className="w-full">
          {/* Full Width Layout - Left to Right */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
            
            {/* Left Section - Order Status & Timeline */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="xl:col-span-3 space-y-4"
            >
              {/* Order Status Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-full text-white ${getStatusColor(orderData.status)}`}>
                    {getStatusIcon(orderData.status)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{orderData.status}</h2>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(orderData.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Order Progress Timeline */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Progress</h3>
                  {orderSteps.map((step, index) => (
                    <div key={step.status} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= currentStepIndex 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                      {index <= currentStepIndex && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Items</span>
                    </div>
                    <span className="font-semibold">{orderData.items?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Payment</span>
                    </div>
                    <span className="font-semibold">{orderData.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Total</span>
                    </div>
                    <span className="font-bold text-lg text-green-600">{currency}{orderData.amount}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Center Section - Order Items */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="xl:col-span-6"
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Order Items
                </h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {orderData.items?.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <img
                        src={item.image?.[0]}
                        alt={item.name}
                        className="w-20 h-20 object-contain rounded-lg bg-gray-50"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            Size: {item.size}
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.discountedPrice ? (
                            <>
                              <span className="font-bold text-red-600 text-lg">
                                {currency}{item.discountedPrice}
                              </span>
                              <span className="text-gray-500 line-through">
                                {currency}{item.price}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-lg">
                              {currency}{item.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Section - Delivery & Payment Details */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="xl:col-span-3 space-y-4"
            >
              {/* Delivery Address */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h3>
                {orderData.address ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{orderData.address.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{orderData.address.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="text-gray-700 text-sm">
                        <p>{orderData.address.addressLine1}</p>
                        {orderData.address.addressLine2 && <p>{orderData.address.addressLine2}</p>}
                        <p className="mt-1 font-medium">
                          {orderData.address.city}, {orderData.address.state} {orderData.address.zipCode}
                        </p>
                        <p>{orderData.address.country}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Address information not available</p>
                )}
              </div>

              {/* Payment Breakdown */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Payment Details
                </h3>
                <div className="space-y-3">
                  {orderData.originalAmount && orderData.originalAmount !== orderData.amount && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{currency}{orderData.originalAmount - 10}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">-{currency}{orderData.totalDiscount || 0}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">{currency}10</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-green-600">{currency}{orderData.amount}</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Paid via {orderData.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterBox />
    </div>
  );
};

export default OrderDetails;
