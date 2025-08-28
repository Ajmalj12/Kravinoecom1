import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ShoppingBag, Calendar, CreditCard, Truck, Eye, Filter, Grid, List } from "lucide-react";
import NewsletterBox from "../components/NewsletterBox";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return;
      }

      const res = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        // Keep orders as complete order objects instead of flattening
        setOrderData(res.data.orders.reverse());
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrderData();
    }
  }, [token]);

  // Sort and filter orders
  const processedOrders = orderData.filter(order => {
    if (filterBy === 'all') return true;
    return order.status.toLowerCase() === filterBy.toLowerCase();
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'amount-high':
        return b.amount - a.amount;
      case 'amount-low':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-gray-50 to-white py-12 px-0"
      >
        <div className="w-full text-center px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
            My Orders
          </h1>
          <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track and manage your order history
          </p>
        </div>
      </motion.div>

      <div className="w-full px-4 sm:px-6 py-4">
        {orderData.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center max-w-2xl mx-auto"
          >
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">
              No Orders Yet
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <button
              onClick={() => navigate('/collection')}
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <Package className="w-5 h-5 mr-2" />
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 w-full"
          >
            {/* Header with stats and controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-black text-white px-4 py-2 rounded-lg font-semibold">
                  {processedOrders.length} Orders
                </div>
                <p className="text-gray-600">
                  {processedOrders.length !== orderData.length && `Showing ${processedOrders.length} of ${orderData.length} orders`}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 relative z-10">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setViewMode('grid');
                    }}
                    className={`p-2 rounded-md transition-colors cursor-pointer relative z-20 ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Grid View"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Grid className="w-4 h-4 pointer-events-none" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setViewMode('list');
                    }}
                    className={`p-2 rounded-md transition-colors cursor-pointer relative z-20 ${
                      viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="List View"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <List className="w-4 h-4 pointer-events-none" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white cursor-pointer relative z-20"
                  style={{ pointerEvents: 'auto' }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white cursor-pointer relative z-20"
                  style={{ pointerEvents: 'auto' }}
                >
                  <option value="all">All Status</option>
                  <option value="order placed">Order Placed</option>
                  <option value="packing">Packing</option>
                  <option value="shipped">Shipped</option>
                  <option value="out for delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Grid/List */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {processedOrders.map((order, index) => (
                <motion.div 
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={viewMode === 'grid' 
                    ? "group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    : "group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex cursor-pointer"
                  }
                  onClick={() => navigate(`/order-details/${order._id}`)}
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className={viewMode === 'grid' ? "relative" : "relative w-48 flex-shrink-0"}>
                    <div className={viewMode === 'grid' ? "w-full h-48 bg-gray-100 flex items-center justify-center" : "w-full h-32 bg-gray-100 flex items-center justify-center"}>
                      {order.items && order.items.length > 0 && order.items[0].image ? (
                        <img 
                          src={order.items[0].image[0]} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                          alt={order.items[0].name} 
                        />
                      ) : (
                        <Package className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 rounded-lg text-xs font-bold">
                      #{order._id?.slice(-6).toUpperCase()}
                    </div>
                    <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
                      order.status === 'Order Placed' ? 'bg-blue-500' :
                      order.status === 'Packing' ? 'bg-yellow-500' :
                      order.status === 'Shipped' ? 'bg-orange-500' :
                      order.status === 'Out for delivery' ? 'bg-purple-500' :
                      order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  </div>

                  <div className={viewMode === 'grid' ? "p-6" : "flex-1 p-6 flex flex-col justify-between"}>
                    <div>
                      <h3 className="font-semibold text-lg text-black mb-2 line-clamp-1">
                        Order #{order._id?.slice(-8).toUpperCase()}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 rounded-md text-sm font-medium ${
                          order.status === 'Order Placed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Packing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Shipped' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'Out for delivery' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-2xl font-bold text-black">
                          {currency}{order.amount}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>{order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    <div className={viewMode === 'grid' ? "space-y-2" : "flex gap-3"}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/order-details/${order._id}`);
                        }}
                        className="flex-1 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2 cursor-pointer relative z-20"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <Eye className="w-4 h-4 pointer-events-none" />
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Continue Shopping */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <button
                onClick={() => navigate('/collection')}
                className="inline-flex items-center px-8 py-4 bg-gray-100 text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors shadow-lg"
              >
                <Package className="w-5 h-5 mr-2" />
                Continue Shopping
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Newsletter Section */}
      <NewsletterBox />
    </div>
  );
};

export default Orders;
