import { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import AddressForm from "../components/AddressForm";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, MapPin, Phone, User, ArrowLeft, Home, Building2, Star } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const AddressManagement = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchAddresses();
  }, [token, navigate]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/address/list",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setAddresses(response.data.addresses);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/address/delete",
        { addressId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Address deleted successfully");
        fetchAddresses();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/address/set-default",
        { addressId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Default address updated");
        fetchAddresses();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update default address");
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const url = editingAddress 
        ? backendUrl + "/api/address/update"
        : backendUrl + "/api/address/add";
      
      const data = editingAddress 
        ? { ...formData, addressId: editingAddress._id }
        : formData;

      const response = await axios.post(url, data, { headers: { token } });

      if (response.data.success) {
        toast.success(editingAddress ? "Address updated successfully" : "Address added successfully");
        setIsFormOpen(false);
        setEditingAddress(null);
        fetchAddresses();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
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
              onClick={() => navigate('/profile')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Profile
            </motion.button>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Address Management
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage your delivery addresses for seamless shopping
            </p>
          </div>
        </div>
      </motion.div>

      <div className="w-full px-4 sm:px-6 py-8">
        <div className="w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row items-center justify-between mb-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
        >
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Addresses</h2>
            <p className="text-gray-600">Manage and organize your delivery locations</p>
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{addresses.length} Total</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">{addresses.filter(a => a.isDefault).length} Default</span>
              </div>
            </div>
          </div>
          <motion.button
            onClick={handleAddAddress}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </motion.button>
        </motion.div>

        {addresses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-200"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <MapPin className="w-12 h-12 text-gray-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No addresses found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Add your first delivery address to get started with seamless shopping experience</p>
            <motion.button
              onClick={handleAddAddress}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg font-semibold"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add Your First Address
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {addresses.map((address, index) => (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`bg-white rounded-2xl shadow-xl border-2 p-6 transition-all duration-300 ${
                  address.isDefault ? 'border-black shadow-2xl' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {address.isDefault && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-r from-black to-gray-800 text-white text-xs px-3 py-1 rounded-full w-fit mb-4 flex items-center gap-2 shadow-lg"
                  >
                    <Star className="w-3 h-3 fill-current" />
                    Default Address
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Full Name</p>
                      <p className="font-bold text-gray-900">{address.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-medium">Phone Number</p>
                      <p className="font-bold text-gray-900">{address.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mt-1">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 font-medium mb-1">Address</p>
                      <div className="text-gray-900 font-medium leading-relaxed">
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p className="text-gray-600">{address.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  {!address.isDefault && (
                    <motion.button
                      onClick={() => handleSetDefault(address._id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg"
                    >
                      <Star className="w-4 h-4 inline mr-2" />
                      Set as Default
                    </motion.button>
                  )}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => handleEditAddress(address)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-semibold"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteAddress(address._id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AddressForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingAddress(null);
          }}
          onSubmit={handleFormSubmit}
          address={editingAddress}
          isLoading={isSubmitting}
        />
        </div>
      </div>
    </div>
  );
};

export default AddressManagement;
