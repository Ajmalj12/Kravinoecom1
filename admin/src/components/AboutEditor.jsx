import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AboutEditor = ({ backendUrl, token }) => {
  const [aboutData, setAboutData] = useState({
    title1: 'ABOUT',
    title2: 'US',
    body1: '',
    body2: 'Why Shop With Us?',
    body3: 'Our Mission',
    body4: '',
    mainTitle: 'Our Story',
    story: '',
    feature1: 'Trendy & Timeless Styles',
    feature2: 'Fast & Secure Shipping',
    feature3: 'Secure Payments',
    feature4: 'Hassle-Free Returns',
    whyTitle1: 'WHY',
    whyTitle2: 'CHOOSE US',
    why1Title: 'Quality Assurance',
    why1Body: 'We meticulously select and vet each product to ensure it meets our stringent quality standards.',
    why2Title: 'Convenience',
    why2Body: 'With our user-friendly interface and hassle-free ordering process, shopping has never been easier.',
    why3Title: 'Exceptional Customer Service',
    why3Body: 'Our team of dedicated professionals is here to assist you every step of the way, ensuring your satisfaction is our top priority.',
    stat1Number: '10K+',
    stat1Label: 'Happy Customers',
    stat2Number: '500+',
    stat2Label: 'Products',
    stat3Number: '50+',
    stat3Label: 'Brands',
    stat4Number: '99%',
    stat4Label: 'Satisfaction',
    heroImage: ''
  });

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/content/get`);
      if (response.data.success && response.data.content.about) {
        setAboutData(prev => ({ ...prev, ...response.data.content.about }));
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setAboutData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return aboutData.heroImage;

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
    return aboutData.heroImage;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const heroImageUrl = await uploadImage();
      
      const updatedData = { ...aboutData, heroImage: heroImageUrl };

      const response = await axios.post(`${backendUrl}/api/content/update`, {
        section: 'about',
        content: updatedData
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('About page content updated successfully!');
        setImageFile(null);
      } else {
        toast.error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating about content:', error);
      toast.error('Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">About Page Editor</h2>
      
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Hero Section</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title Part 1</label>
              <input
                type="text"
                value={aboutData.title1}
                onChange={(e) => handleInputChange('title1', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title Part 2</label>
              <input
                type="text"
                value={aboutData.title2}
                onChange={(e) => handleInputChange('title2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {aboutData.heroImage && (
              <img src={aboutData.heroImage} alt="Hero" className="mt-2 w-32 h-20 object-cover rounded" />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Main Content</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
            <input
              type="text"
              value={aboutData.mainTitle}
              onChange={(e) => handleInputChange('mainTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Text</label>
            <textarea
              value={aboutData.body1}
              onChange={(e) => handleInputChange('body1', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Story Text</label>
            <textarea
              value={aboutData.story}
              onChange={(e) => handleInputChange('story', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Features Section</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Features Title</label>
            <input
              type="text"
              value={aboutData.body2}
              onChange={(e) => handleInputChange('body2', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Feature 1</label>
              <input
                type="text"
                value={aboutData.feature1}
                onChange={(e) => handleInputChange('feature1', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Feature 2</label>
              <input
                type="text"
                value={aboutData.feature2}
                onChange={(e) => handleInputChange('feature2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Feature 3</label>
              <input
                type="text"
                value={aboutData.feature3}
                onChange={(e) => handleInputChange('feature3', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Feature 4</label>
              <input
                type="text"
                value={aboutData.feature4}
                onChange={(e) => handleInputChange('feature4', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Mission Section</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mission Title</label>
            <input
              type="text"
              value={aboutData.body3}
              onChange={(e) => handleInputChange('body3', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mission Text</label>
            <textarea
              value={aboutData.body4}
              onChange={(e) => handleInputChange('body4', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Why Choose Us Section</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Why Title Part 1</label>
              <input
                type="text"
                value={aboutData.whyTitle1}
                onChange={(e) => handleInputChange('whyTitle1', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Why Title Part 2</label>
              <input
                type="text"
                value={aboutData.whyTitle2}
                onChange={(e) => handleInputChange('whyTitle2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason 1 Title</label>
              <input
                type="text"
                value={aboutData.why1Title}
                onChange={(e) => handleInputChange('why1Title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Reason 1 Description</label>
              <textarea
                value={aboutData.why1Body}
                onChange={(e) => handleInputChange('why1Body', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason 2 Title</label>
              <input
                type="text"
                value={aboutData.why2Title}
                onChange={(e) => handleInputChange('why2Title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Reason 2 Description</label>
              <textarea
                value={aboutData.why2Body}
                onChange={(e) => handleInputChange('why2Body', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason 3 Title</label>
              <input
                type="text"
                value={aboutData.why3Title}
                onChange={(e) => handleInputChange('why3Title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Reason 3 Description</label>
              <textarea
                value={aboutData.why3Body}
                onChange={(e) => handleInputChange('why3Body', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Statistics Section</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stat 1 Number</label>
              <input
                type="text"
                value={aboutData.stat1Number}
                onChange={(e) => handleInputChange('stat1Number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Stat 1 Label</label>
              <input
                type="text"
                value={aboutData.stat1Label}
                onChange={(e) => handleInputChange('stat1Label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stat 2 Number</label>
              <input
                type="text"
                value={aboutData.stat2Number}
                onChange={(e) => handleInputChange('stat2Number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Stat 2 Label</label>
              <input
                type="text"
                value={aboutData.stat2Label}
                onChange={(e) => handleInputChange('stat2Label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stat 3 Number</label>
              <input
                type="text"
                value={aboutData.stat3Number}
                onChange={(e) => handleInputChange('stat3Number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Stat 3 Label</label>
              <input
                type="text"
                value={aboutData.stat3Label}
                onChange={(e) => handleInputChange('stat3Label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stat 4 Number</label>
              <input
                type="text"
                value={aboutData.stat4Number}
                onChange={(e) => handleInputChange('stat4Number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Stat 4 Label</label>
              <input
                type="text"
                value={aboutData.stat4Label}
                onChange={(e) => handleInputChange('stat4Label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

export default AboutEditor;
