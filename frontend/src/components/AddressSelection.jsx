import { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import AddressForm from "./AddressForm";
import { Plus, MapPin, Phone, User, Check } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const AddressSelection = ({ onAddressSelect, selectedAddressId = null }) => {
  const { backendUrl, token } = useContext(ShopContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/address/list",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setAddresses(response.data.addresses);
        // Auto-select default address if no address is selected
        if (!selectedAddressId && response.data.addresses.length > 0) {
          const defaultAddress = response.data.addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            onAddressSelect(defaultAddress);
          }
        }
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
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/address/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Address added successfully");
        setIsFormOpen(false);
        fetchAddresses();
        // Auto-select the newly added address if it's set as default
        if (formData.isDefault || addresses.length === 0) {
          onAddressSelect(response.data.address);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAddress = (address) => {
    console.log('Address selected:', address);
    onAddressSelect(address);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select Delivery Address</h3>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddAddress();
          }}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          style={{ pointerEvents: 'auto', zIndex: 5 }}
        >
          <Plus className="w-4 h-4 pointer-events-none" />
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h4>
          <p className="text-gray-600 mb-4">Add your first delivery address to continue</p>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddAddress();
            }}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            style={{ pointerEvents: 'auto', zIndex: 5 }}
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedAddressId === address._id
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Address card clicked:', address._id);
                handleSelectAddress(address);
              }}
              style={{ 
                pointerEvents: 'auto', 
                zIndex: 50,
                position: 'relative',
                touchAction: 'manipulation'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{address.fullName}</span>
                    {address.isDefault && (
                      <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{address.phone}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div className="text-gray-700 text-sm">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                </div>

                {selectedAddressId === address._id && (
                  <div className="flex items-center justify-center w-6 h-6 bg-black rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AddressSelection;
