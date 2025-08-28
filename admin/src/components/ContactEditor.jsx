import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContactEditor = ({ backendUrl, token }) => {
  const [contactData, setContactData] = useState({
    title1: "Let's",
    title2: 'Connect',
    subtitle: "Have questions? Need support? We're here to help!",
    locationTitle: 'Our Location',
    address: '',
    addressLine2: '',
    city: '',
    zipCode: '',
    contactTitle: 'Get In Touch',
    phone: '',
    email: '',
    hours: 'Mon-Fri 9AM-6PM',
    supportTitle: 'Customer Support',
    supportDescription: 'Need help with your order? Our customer support team is here to assist you with any questions or concerns.',
    supportButtonText: 'Contact Support',
    formTitle: 'Send us a Message',
    submitButtonText: 'Send Message',
    mapEmbedCode: '',
    heroImage: ''
  });

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/content/get`);
      if (response.data.success && response.data.content.contact) {
        setContactData(prev => ({ ...prev, ...response.data.content.contact }));
      }
    } catch (error) {
      console.error('Error fetching contact content:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return contactData.heroImage;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post(`${backendUrl}/api/content/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token
        }
      });

      if (response.data.success) {
        return response.data.imageUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
    return contactData.heroImage;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const heroImageUrl = await uploadImage();
      
      const updatedData = { ...contactData, heroImage: heroImageUrl };

      const response = await axios.post(`${backendUrl}/api/content/update`, {
        section: 'contact',
        content: updatedData
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('Contact page content updated successfully!');
        setImageFile(null);
      } else {
        toast.error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating contact content:', error);
      toast.error('Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Page Editor</h2>
      
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Hero Section</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title Part 1</label>
              <input
                type="text"
                value={contactData.title1}
                onChange={(e) => handleInputChange('title1', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title Part 2</label>
              <input
                type="text"
                value={contactData.title2}
                onChange={(e) => handleInputChange('title2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <textarea
              value={contactData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {contactData.heroImage && (
              <img src={contactData.heroImage} alt="Hero" className="mt-2 w-32 h-20 object-cover rounded" />
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Location Information</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Section Title</label>
            <input
              type="text"
              value={contactData.locationTitle}
              onChange={(e) => handleInputChange('locationTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
              <input
                type="text"
                value={contactData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
              <input
                type="text"
                value={contactData.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={contactData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
              <input
                type="text"
                value={contactData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Information</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Section Title</label>
            <input
              type="text"
              value={contactData.contactTitle}
              onChange={(e) => handleInputChange('contactTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={contactData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
              <input
                type="text"
                value={contactData.hours}
                onChange={(e) => handleInputChange('hours', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Support Section</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Support Title</label>
            <input
              type="text"
              value={contactData.supportTitle}
              onChange={(e) => handleInputChange('supportTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Support Description</label>
            <textarea
              value={contactData.supportDescription}
              onChange={(e) => handleInputChange('supportDescription', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Support Button Text</label>
            <input
              type="text"
              value={contactData.supportButtonText}
              onChange={(e) => handleInputChange('supportButtonText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Form</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
              <input
                type="text"
                value={contactData.formTitle}
                onChange={(e) => handleInputChange('formTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Submit Button Text</label>
              <input
                type="text"
                value={contactData.submitButtonText}
                onChange={(e) => handleInputChange('submitButtonText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Map Integration</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Map Embed Code</label>
            <textarea
              value={contactData.mapEmbedCode}
              onChange={(e) => handleInputChange('mapEmbedCode', e.target.value)}
              rows="4"
              placeholder="Paste your Google Maps or other map embed code here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              To get Google Maps embed code: Go to Google Maps → Search your location → Share → Embed a map → Copy HTML
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactEditor;
