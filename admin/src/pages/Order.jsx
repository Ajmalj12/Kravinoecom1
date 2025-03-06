import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";
import { assets } from "../assets/assets";
import { Package, Truck, Box, MapPin, Phone, Calendar, CreditCard } from 'lucide-react';

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const res = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        setOrders(res.data.orders.reverse());
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: e.target.value },
        { headers: { token } }
      );

      if (res.data.success) {
        await fetchAllOrders();
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed": return "bg-blue-100 text-blue-800";
      case "Packing": return "bg-yellow-100 text-yellow-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Out for delivery": return "bg-orange-100 text-orange-800";
      case "Delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
      <div className="space-y-6">
        {orders.map((order, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Package className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-900">{order._id}</p>
                  </div>
                </div>
                <select
                  value={order.status}
                  className={`px-4 py-2 rounded-full font-medium text-sm ${getStatusColor(order.status)}`}
                  onChange={(e) => statusHandler(e, order._id)}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="col-span-2">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Box className="w-5 h-5 mr-2" />
                      Order Items
                    </h3>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">
                            {item.name} 
                            <span className="text-gray-500">
                              {" "}x {item.quantity} {item.size && `(${item.size})`}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Shipping Address
                    </h3>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p className="mt-1">{order.address.street}</p>
                      <p>
                        {order.address.city}, {order.address.state}
                        <br />
                        {order.address.country}, {order.address.zipcode}
                      </p>
                      <p className="mt-2 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {order.address.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 h-fit">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Items</span>
                      <span className="font-medium">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`font-medium ${order.payment ? "text-green-600" : "text-orange-600"}`}>
                        {order.payment ? "Paid" : "Pending"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Order Date</span>
                      <span className="font-medium">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount</span>
                        <span className="font-bold text-lg">
                          {currency} {order.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;