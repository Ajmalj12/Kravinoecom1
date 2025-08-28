import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Heart, 
  Settings, 
  LogOut,
  Edit3,
  Camera,
  ArrowLeft,
  Shield,
  CreditCard,
  Bell,
  Star,
  Calendar,
  TrendingUp
} from "lucide-react";

const Profile = () => {
  const { token, backendUrl, setToken, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(
          `${backendUrl}/api/user/profile`,
          {
            headers: { token }
          }
        );
        
        if (response.data?.success && response.data.user) {
          setUserData({
            name: response.data.user.name || "",
            email: response.data.user.email || "",
            phone: response.data.user.phone || "",
            address: response.data.user.address || ""
          });
        } else {
          toast.error(response.data?.message || "Failed to load profile data");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data: " + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token, backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        userData,
        {
          headers: { token }
        }
      );
      
      if (response.data.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile: " + (error.response?.data?.message || error.message));
    }
  };

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="mb-4">You need to be logged in to view your profile.</p>
          <a
            href="/login"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-black via-gray-900 to-black text-white"
      >
        <div className="px-4 sm:px-6 py-12">
          <div className="w-full text-center">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </motion.button>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              My Profile
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </motion.div>

      <div className="w-full px-4 sm:px-6 py-8">
        <div className="w-full">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
            <div className="flex items-center gap-6 mb-6 lg:mb-0">
              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <User size={48} className="text-white" />
                </motion.div>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-2 right-2 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors shadow-lg"
                >
                  <Camera size={20} />
                </motion.button>
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{userData.name || 'User Name'}</h2>
                <p className="text-gray-600 text-lg mb-2">{userData.email}</p>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <span className="text-gray-600 ml-2">Premium Member</span>
                </div>
              </div>
            </div>
            <motion.button
              onClick={() => setIsEditing(!isEditing)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
            >
              <Edit3 size={18} />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </motion.button>
          </div>


          {/* Profile Information */}
          {isEditing ? (
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-lg font-semibold"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Full Name</p>
                  <p className="font-bold text-gray-900 text-lg">{userData.name || 'Not provided'}</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Mail className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Email</p>
                  <p className="font-bold text-gray-900 text-lg">{userData.email || 'Not provided'}</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Phone className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Phone</p>
                  <p className="font-bold text-gray-900 text-lg">{userData.phone || 'Not provided'}</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors lg:col-span-2"
              >
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <MapPin className="text-red-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Address</p>
                  <p className="font-bold text-gray-900 text-lg">{userData.address || 'Not provided'}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div 
            onClick={() => navigate('/orders')}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Package className="text-blue-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">My Orders</h3>
              <p className="text-gray-600">Track your orders</p>
            </div>
          </motion.div>

          <motion.div 
            onClick={() => navigate('/wishlist')}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                <Heart className="text-red-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Wishlist</h3>
              <p className="text-gray-600">Your saved items</p>
            </div>
          </motion.div>

          <motion.div 
            onClick={() => navigate('/address-management')}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <MapPin className="text-green-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Addresses</h3>
              <p className="text-gray-600">Manage addresses</p>
            </div>
          </motion.div>

          <motion.div 
            onClick={() => navigate('/account-settings')}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Settings className="text-purple-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Settings</h3>
              <p className="text-gray-600">Account preferences</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Account Stats & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={28} />
              Account Overview
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                <div className="text-gray-600">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                <div className="text-gray-600">Wishlist Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
                <div className="text-gray-600">Saved Addresses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">2Y</div>
                <div className="text-gray-600">Member Since</div>
              </div>
            </div>
          </motion.div>

          {/* Account Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Shield className="text-green-600" size={28} />
              Security & Privacy
            </h3>
            <div className="space-y-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="text-blue-600" size={20} />
                  <span className="font-semibold text-gray-900">Payment Methods</span>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">→</div>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Bell className="text-yellow-600" size={20} />
                  <span className="font-semibold text-gray-900">Notifications</span>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">→</div>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Shield className="text-green-600" size={20} />
                  <span className="font-semibold text-gray-900">Privacy Settings</span>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">→</div>
              </motion.button>
              
              <motion.button 
                onClick={logout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-semibold mt-6"
              >
                <LogOut size={20} />
                Logout
              </motion.button>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;