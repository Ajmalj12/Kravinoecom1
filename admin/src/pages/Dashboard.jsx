import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, Users as UsersIcon, Loader2 } from 'lucide-react';

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    productCategories: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products first (doesn't require token)
        const productsResponse = await axios.get(`${backendUrl}/api/product/list`);
        
        if (!productsResponse.data.success) {
          throw new Error("Failed to fetch products");
        }
        
        const products = productsResponse.data.products;
        
        // Get product categories distribution
        const categories = {};
        products.forEach(product => {
          if (categories[product.category]) {
            categories[product.category]++;
          } else {
            categories[product.category] = 1;
          }
        });
        
        // Set initial stats with products data
        setStats(prevStats => ({
          ...prevStats,
          totalProducts: products.length,
          productCategories: categories
        }));
        
        // Fetch orders
        const ordersResponse = await axios.post(`${backendUrl}/api/order/list`, {}, {
          headers: { token }
        });
        
        // Fetch users
        const usersResponse = await axios.get(`${backendUrl}/api/user/all`, {
          headers: { token }
        });
        
        if (ordersResponse.data.success && usersResponse.data.success) {
          const orders = ordersResponse.data.orders;
          const users = usersResponse.data.users;
          
          // Calculate total revenue
          const revenue = orders.reduce((total, order) => total + order.amount, 0);
          
          setStats(prevStats => ({
            ...prevStats,
            totalOrders: orders.length,
            totalCustomers: users.length,
            totalRevenue: revenue,
            recentOrders: orders.slice(0, 5)
          }));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<BarChartIcon className="w-8 h-8 text-indigo-600" />}
          color="bg-indigo-100"
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalCustomers} 
          icon={<UsersIcon className="w-8 h-8 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<LineChartIcon className="w-8 h-8 text-amber-600" />}
          color="bg-amber-100"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          icon={<PieChartIcon className="w-8 h-8 text-rose-600" />}
          color="bg-rose-100"
        />
      </div>
      
      {/* Category Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h2>
          <div className="h-64 flex flex-col">
            {Object.entries(stats.productCategories).length > 0 ? (
              <div className="flex-1 flex flex-col space-y-2">
                {Object.entries(stats.productCategories).map(([category, count]) => (
                  <div key={category} className="flex items-center">
                    <span className="w-32 text-sm text-gray-600">{category}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-blue-600 h-4 rounded-full" 
                        style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No category data available.</p>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h2>
          <div className="h-64 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Average Order Value</p>
                <p className="text-xl font-bold text-gray-900">
                  ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Orders per Customer</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalCustomers > 0 ? (stats.totalOrders / stats.totalCustomers).toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Revenue per Customer</p>
                <p className="text-xl font-bold text-gray-900">
                  ${stats.totalCustomers > 0 ? (stats.totalRevenue / stats.totalCustomers).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-rose-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Products per Order</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalOrders > 0 ? (stats.totalProducts / stats.totalOrders).toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{order._id.substring(0, 8)}...</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{order.name || 'Customer'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${order.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Order Placed' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent orders found.</p>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
      <div className={`${color} p-3 rounded-full mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;