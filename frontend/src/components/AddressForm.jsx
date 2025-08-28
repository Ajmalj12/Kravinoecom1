import { useState, useEffect } from "react";
import { X } from "lucide-react";

const AddressForm = ({ isOpen, onClose, onSubmit, address = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    isDefault: false
  });

  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        isDefault: false
      });
    }
  }, [address, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {address ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            style={{ pointerEvents: 'auto', zIndex: 10 }}
          >
            <X className="w-5 h-5 pointer-events-none" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="House no, Building name, Street"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Area, Landmark (Optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="State"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="ZIP Code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto', zIndex: 5 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ pointerEvents: 'auto', zIndex: 5 }}
            >
              {isLoading ? "Saving..." : (address ? "Update" : "Add Address")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
