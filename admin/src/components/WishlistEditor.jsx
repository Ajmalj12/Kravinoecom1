import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const WishlistEditor = ({ token, backendUrl }) => {
  const [content, setContent] = useState({
    title: '',
    subtitle: '',
    emptyTitle: '',
    emptyDescription: '',
    shopButton: '',
    continueButton: ''
  });

  const [loading, setLoading] = useState(false);

  // Fetch existing content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/content/get`);
        if (response.data.success && response.data.content.wishlist) {
          setContent({
            title: response.data.content.wishlist.title || '',
            subtitle: response.data.content.wishlist.subtitle || '',
            emptyTitle: response.data.content.wishlist.emptyTitle || '',
            emptyDescription: response.data.content.wishlist.emptyDescription || '',
            shopButton: response.data.content.wishlist.shopButton || '',
            continueButton: response.data.content.wishlist.continueButton || ''
          });
        }
      } catch (error) {
        console.error('Error fetching wishlist content:', error);
      }
    };

    fetchContent();
  }, [backendUrl]);

  const handleInputChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/content/update`,
        {
          section: 'wishlist',
          content: content
        },
        {
          headers: { token }
        }
      );

      if (response.data.success) {
        toast.success('Wishlist content updated successfully!');
      } else {
        toast.error('Failed to update wishlist content');
      }
    } catch (error) {
      console.error('Error updating wishlist content:', error);
      toast.error('Error updating wishlist content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Wishlist Page Content Editor</h2>
      
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Hero Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="My Wishlist"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={content.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                placeholder="Your curated collection of favorite items"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Empty State Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Empty Wishlist Content</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empty State Title
              </label>
              <input
                type="text"
                value={content.emptyTitle}
                onChange={(e) => handleInputChange('emptyTitle', e.target.value)}
                placeholder="Your Wishlist is Empty"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empty State Description
              </label>
              <textarea
                value={content.emptyDescription}
                onChange={(e) => handleInputChange('emptyDescription', e.target.value)}
                placeholder="Discover amazing products and save your favorites here for easy access later."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Button Text
              </label>
              <input
                type="text"
                value={content.shopButton}
                onChange={(e) => handleInputChange('shopButton', e.target.value)}
                placeholder="Start Shopping"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Action Buttons</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Continue Shopping Button Text
            </label>
            <input
              type="text"
              value={content.continueButton}
              onChange={(e) => handleInputChange('continueButton', e.target.value)}
              placeholder="Continue Shopping"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Wishlist Content'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistEditor;
