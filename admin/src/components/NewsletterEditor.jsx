import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const NewsletterEditor = ({ token, backendUrl }) => {
  const [content, setContent] = useState({
    title: '',
    subtitle: '',
    description: '',
    benefit1: '',
    benefit2: '',
    benefit3: '',
    benefit4: '',
    formTitle: '',
    formSubtitle: '',
    placeholder: '',
    buttonText: '',
    disclaimer: '',
    stat1Number: '',
    stat1Label: '',
    stat2Number: '',
    stat2Label: '',
    stat3Number: '',
    stat3Label: '',
    stat4Number: '',
    stat4Label: ''
  });

  const [loading, setLoading] = useState(false);

  // Fetch existing content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/content/get`);
        if (response.data.success && response.data.content.newsletter) {
          setContent({
            title: response.data.content.newsletter.title || '',
            subtitle: response.data.content.newsletter.subtitle || '',
            description: response.data.content.newsletter.description || '',
            benefit1: response.data.content.newsletter.benefit1 || '',
            benefit2: response.data.content.newsletter.benefit2 || '',
            benefit3: response.data.content.newsletter.benefit3 || '',
            benefit4: response.data.content.newsletter.benefit4 || '',
            formTitle: response.data.content.newsletter.formTitle || '',
            formSubtitle: response.data.content.newsletter.formSubtitle || '',
            placeholder: response.data.content.newsletter.placeholder || '',
            buttonText: response.data.content.newsletter.buttonText || '',
            disclaimer: response.data.content.newsletter.disclaimer || '',
            stat1Number: response.data.content.newsletter.stat1Number || '',
            stat1Label: response.data.content.newsletter.stat1Label || '',
            stat2Number: response.data.content.newsletter.stat2Number || '',
            stat2Label: response.data.content.newsletter.stat2Label || '',
            stat3Number: response.data.content.newsletter.stat3Number || '',
            stat3Label: response.data.content.newsletter.stat3Label || '',
            stat4Number: response.data.content.newsletter.stat4Number || '',
            stat4Label: response.data.content.newsletter.stat4Label || ''
          });
        }
      } catch (error) {
        console.error('Error fetching newsletter content:', error);
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
          section: 'newsletter',
          content: content
        },
        {
          headers: { token }
        }
      );

      if (response.data.success) {
        toast.success('Newsletter content updated successfully!');
      } else {
        toast.error('Failed to update newsletter content');
      }
    } catch (error) {
      console.error('Error updating newsletter content:', error);
      toast.error('Error updating newsletter content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Newsletter Content Editor</h2>
      
      <div className="space-y-6">
        {/* Main Content Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Main Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Title
              </label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Stay In The Loop"
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
                placeholder="Subscribe now & get 20% off your first order"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Join thousands of fashion lovers and get exclusive access to:"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefit 1
              </label>
              <input
                type="text"
                value={content.benefit1}
                onChange={(e) => handleInputChange('benefit1', e.target.value)}
                placeholder="Early access to sales"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefit 2
              </label>
              <input
                type="text"
                value={content.benefit2}
                onChange={(e) => handleInputChange('benefit2', e.target.value)}
                placeholder="Exclusive discounts"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefit 3
              </label>
              <input
                type="text"
                value={content.benefit3}
                onChange={(e) => handleInputChange('benefit3', e.target.value)}
                placeholder="New arrivals first"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefit 4
              </label>
              <input
                type="text"
                value={content.benefit4}
                onChange={(e) => handleInputChange('benefit4', e.target.value)}
                placeholder="Style tips & trends"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Form Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Title
              </label>
              <input
                type="text"
                value={content.formTitle}
                onChange={(e) => handleInputChange('formTitle', e.target.value)}
                placeholder="Get Your Discount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Subtitle
              </label>
              <input
                type="text"
                value={content.formSubtitle}
                onChange={(e) => handleInputChange('formSubtitle', e.target.value)}
                placeholder="Enter your email and unlock 20% off"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Placeholder
              </label>
              <input
                type="text"
                value={content.placeholder}
                onChange={(e) => handleInputChange('placeholder', e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={content.buttonText}
                onChange={(e) => handleInputChange('buttonText', e.target.value)}
                placeholder="CLAIM MY 20% OFF"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disclaimer Text
            </label>
            <textarea
              value={content.disclaimer}
              onChange={(e) => handleInputChange('disclaimer', e.target.value)}
              placeholder="No spam, unsubscribe anytime. By subscribing you agree to our Terms & Privacy Policy."
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Statistics Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stat 1 Number
              </label>
              <input
                type="text"
                value={content.stat1Number}
                onChange={(e) => handleInputChange('stat1Number', e.target.value)}
                placeholder="50K+"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                Stat 1 Label
              </label>
              <input
                type="text"
                value={content.stat1Label}
                onChange={(e) => handleInputChange('stat1Label', e.target.value)}
                placeholder="Subscribers"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stat 2 Number
              </label>
              <input
                type="text"
                value={content.stat2Number}
                onChange={(e) => handleInputChange('stat2Number', e.target.value)}
                placeholder="20%"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                Stat 2 Label
              </label>
              <input
                type="text"
                value={content.stat2Label}
                onChange={(e) => handleInputChange('stat2Label', e.target.value)}
                placeholder="Average Savings"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stat 3 Number
              </label>
              <input
                type="text"
                value={content.stat3Number}
                onChange={(e) => handleInputChange('stat3Number', e.target.value)}
                placeholder="24/7"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                Stat 3 Label
              </label>
              <input
                type="text"
                value={content.stat3Label}
                onChange={(e) => handleInputChange('stat3Label', e.target.value)}
                placeholder="Support"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stat 4 Number
              </label>
              <input
                type="text"
                value={content.stat4Number}
                onChange={(e) => handleInputChange('stat4Number', e.target.value)}
                placeholder="5★"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                Stat 4 Label
              </label>
              <input
                type="text"
                value={content.stat4Label}
                onChange={(e) => handleInputChange('stat4Label', e.target.value)}
                placeholder="Rating"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Newsletter Content'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterEditor;
