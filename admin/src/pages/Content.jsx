import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const CategoriesEditor = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingVisibility, setUpdatingVisibility] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(backendUrl + '/api/category/list');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (e) {
      toast.error('Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  const toggleCategoryVisibility = async (categoryId, currentVisibility) => {
    try {
      setUpdatingVisibility(categoryId);
      
      // Optimistically update the UI
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat._id === categoryId 
            ? { ...cat, showInNavigation: !currentVisibility }
            : cat
        )
      );
      
      const res = await axios.post(backendUrl + '/api/category/toggle-visibility', {
        categoryId,
        showInNavigation: !currentVisibility
      }, {
        headers: { token }
      });
      
      if (res.data.success) {
        toast.success('Category visibility updated');
        // No need to refetch - we already updated optimistically
      } else {
        toast.error(res.data.message || 'Update failed');
        // Revert the optimistic update on failure
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat._id === categoryId 
              ? { ...cat, showInNavigation: currentVisibility }
              : cat
          )
        );
      }
    } catch (e) {
      toast.error('Error updating visibility');
      // Revert the optimistic update on error
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat._id === categoryId 
            ? { ...cat, showInNavigation: currentVisibility }
            : cat
        )
      );
    } finally {
      setUpdatingVisibility(null);
    }
  };

  const toggleSubcategoryVisibility = async (categoryId, subcategoryId, currentVisibility) => {
    try {
      setUpdatingVisibility(`${categoryId}-${subcategoryId}`);
      
      // Optimistically update the UI
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat._id === categoryId 
            ? {
                ...cat,
                subCategories: cat.subCategories.map(subcat =>
                  subcat._id === subcategoryId
                    ? { ...subcat, showInNavigation: !currentVisibility }
                    : subcat
                )
              }
            : cat
        )
      );
      
      const res = await axios.post(backendUrl + '/api/category/toggle-subcategory-visibility', {
        categoryId,
        subcategoryId,
        showInNavigation: !currentVisibility
      }, {
        headers: { token }
      });
      
      if (res.data.success) {
        toast.success('Subcategory visibility updated');
        // No need to refetch - we already updated optimistically
      } else {
        toast.error(res.data.message || 'Update failed');
        // Revert the optimistic update on failure
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat._id === categoryId 
              ? {
                  ...cat,
                  subCategories: cat.subCategories.map(subcat =>
                    subcat._id === subcategoryId
                      ? { ...subcat, showInNavigation: currentVisibility }
                      : subcat
                  )
                }
              : cat
          )
        );
      }
    } catch (e) {
      toast.error('Error updating visibility');
      // Revert the optimistic update on error
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat._id === categoryId 
            ? {
                ...cat,
                subCategories: cat.subCategories.map(subcat =>
                  subcat._id === subcategoryId
                    ? { ...subcat, showInNavigation: currentVisibility }
                    : subcat
                )
              }
            : cat
        )
      );
    } finally {
      setUpdatingVisibility(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border mb-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Navigation Categories</h2>
        <p className="text-sm text-gray-600">Select which categories and subcategories to display in the top navigation bar</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading categories...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category._id} className="group relative">
              {/* Category Card */}
              <div 
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  category.showInNavigation !== false 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => toggleCategoryVisibility(category._id, category.showInNavigation !== false)}
              >
                {/* Status Indicator */}
                <div className="absolute -top-2 -right-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    category.showInNavigation !== false 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-400 text-white'
                  }`}>
                    {category.showInNavigation !== false ? '✓' : '×'}
                  </div>
                </div>

                {/* Category Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold text-lg ${
                    category.showInNavigation !== false ? 'text-blue-800' : 'text-gray-700'
                  }`}>
                    {category.name}
                  </h3>
                  {updatingVisibility === category._id && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </div>

                {/* Category Description */}
                {category.description && (
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                )}

                {/* Status Text */}
                <div className={`text-xs font-medium ${
                  category.showInNavigation !== false ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {category.showInNavigation !== false ? '🟢 Visible in Navigation' : '🔴 Hidden from Navigation'}
                </div>

                {/* Subcategories */}
                {category.subCategories && category.subCategories.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Subcategories ({category.subCategories.length})
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {category.subCategories.map((subcat) => (
                        <div 
                          key={subcat._id}
                          className={`relative p-2 rounded border cursor-pointer transition-all duration-150 ${
                            subcat.showInNavigation !== false
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubcategoryVisibility(category._id, subcat._id, subcat.showInNavigation !== false);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                subcat.showInNavigation !== false ? 'bg-green-500' : 'bg-gray-400'
                              }`}></div>
                              <span className={`text-sm font-medium ${
                                subcat.showInNavigation !== false ? 'text-green-800' : 'text-gray-600'
                              }`}>
                                {subcat.name}
                              </span>
                            </div>
                            {updatingVisibility === `${category._id}-${subcat._id}` && (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                            )}
                          </div>
                          {subcat.description && (
                            <p className="text-xs text-gray-500 mt-1 ml-5">{subcat.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">How to use:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Click category cards to show/hide in navigation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span>Click subcategory items to toggle individually</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Content = ({ token }) => {
  const [page, setPage] = useState('global');
  const [items, setItems] = useState([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [uploadKey, setUploadKey] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [pendingChanges, setPendingChanges] = useState({});
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/page/list', { params: { page } });
      if (res.data.success) {
        setItems(res.data.items);
        setPendingChanges({});
      }
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  useEffect(() => { 
    fetch(); 
  }, [page]);

  const saveItem = async (key, value) => {
    try {
      const res = await axios.post(backendUrl + '/api/page/upsert', { page, key, value }, { headers: { token } });
      if (res.data.success) { 
        await fetch(); 
        setPendingChanges(prev => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }
      else toast.error(res.data.message || 'Failed to save');
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const handleInputChange = (key, value) => {
    setPendingChanges(prev => ({ ...prev, [key]: value }));
  };

  const saveAllChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast.info('No changes to save');
      return;
    }
    
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(pendingChanges)) {
        const res = await axios.post(backendUrl + '/api/page/upsert', { page, key, value }, { headers: { token } });
        if (!res.data.success) {
          throw new Error(res.data.message || 'Failed to save');
        }
      }
      await fetch();
      setPendingChanges({});
      toast.success('All changes saved successfully');
    } catch (e) {
      toast.error('Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newKey) { toast.error('Key required'); return; }
    handleInputChange(newKey, newValue);
    setNewKey(''); setNewValue('');
  };

  const uploadImageWithKey = async (e, key) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file'); return; }
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('page', page);
    formData.append('key', key);
    
    try {
      const res = await axios.post(backendUrl + '/api/page/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          token 
        }
      });
      
      if (res.data.success) {
        toast.success('Image uploaded successfully');
        fetch();
        setFile(null);
        setFileName('');
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
      }
      else toast.error(res.data.message || 'Upload failed');
    } catch (e) { 
      console.error('Upload error:', e);
      toast.error(e.response?.data?.message || e.message); 
    }
  };

  const getValue = (key) => {
    if (pendingChanges.hasOwnProperty(key)) {
      return pendingChanges[key];
    }
    return items.find(i => i.key === key)?.value || '';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Page/Section:</label>
        <select className="border px-3 py-2" value={page} onChange={(e)=>setPage(e.target.value)}>
          <option value="global">Footer & Global</option>
          <option value="about">About Page</option>
          <option value="contact">Contact Page</option>
          <option value="policy">Our Policy</option>
          <option value="newsletter">Newsletter</option>
          <option value="products">Product Sections</option>
          <option value="categories">Categories Management</option>
        </select>
      </div>

      {page === 'global' && (
        <div className="bg-white p-4 rounded border mb-6">
          <h2 className="font-medium mb-3">Footer & Global</h2>
          {[
            { key: 'siteName', label: 'Site Name' },
            { key: 'footerAbout', label: 'Footer About' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            { key: 'copyright', label: 'Copyright' },
          ].map(({ key, label }) => (
            <div key={key} className="grid md:grid-cols-3 gap-2 items-center mb-2">
              <div className="text-sm font-medium">{label}</div>
              <input 
                key={`${key}-${page}`}
                className="border px-2 py-1 text-sm md:col-span-2" 
                value={getValue(key)} 
                onChange={(e) => handleInputChange(key, e.target.value)} 
              />
            </div>
          ))}
        </div>
      )}


      {page === 'about' && (
        <div className="bg-white p-4 rounded border mb-6">
          <h2 className="font-medium mb-3">About Page</h2>
          {[
            { key: 'title', label: 'Page Title' },
            { key: 'heading', label: 'Main Heading' },
            { key: 'description', label: 'Description' },
            { key: 'mission', label: 'Mission' },
            { key: 'vision', label: 'Vision' },
            { key: 'values', label: 'Values' },
            { key: 'teamTitle', label: 'Team Section Title' },
            { key: 'teamDescription', label: 'Team Description' },
          ].map(({ key, label }) => (
            <div key={key} className="grid md:grid-cols-3 gap-2 items-center mb-2">
              <div className="text-sm font-medium">{label}</div>
              {key.includes('description') || key.includes('mission') || key.includes('vision') || key.includes('values') ? (
                <textarea 
                  key={`${key}-${page}`}
                  className="border px-2 py-1 text-sm md:col-span-2 h-20 resize-none" 
                  value={getValue(key)} 
                  onChange={(e) => handleInputChange(key, e.target.value)} 
                />
              ) : (
                <input 
                  key={`${key}-${page}`}
                  className="border px-2 py-1 text-sm md:col-span-2" 
                  value={getValue(key)} 
                  onChange={(e) => handleInputChange(key, e.target.value)} 
                />
              )}
            </div>
          ))}
        </div>
      )}

      {page === 'contact' && (
        <div className="bg-white p-4 rounded border mb-6">
          <h2 className="font-medium mb-3">Contact Page</h2>
          {[
            { key: 'title', label: 'Page Title' },
            { key: 'heading', label: 'Main Heading' },
            { key: 'description', label: 'Description' },
            { key: 'address', label: 'Address' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            { key: 'hours', label: 'Business Hours' },
            { key: 'mapEmbed', label: 'Map Embed Code' },
          ].map(({ key, label }) => (
            <div key={key} className="grid md:grid-cols-3 gap-2 items-center mb-2">
              <div className="text-sm font-medium">{label}</div>
              {key.includes('description') || key.includes('mapEmbed') ? (
                <textarea 
                  key={`${key}-${page}`}
                  className="border px-2 py-1 text-sm md:col-span-2 h-20 resize-none" 
                  value={getValue(key)} 
                  onChange={(e) => handleInputChange(key, e.target.value)} 
                />
              ) : (
                <input 
                  key={`${key}-${page}`}
                  className="border px-2 py-1 text-sm md:col-span-2" 
                  value={getValue(key)} 
                  onChange={(e) => handleInputChange(key, e.target.value)} 
                />
              )}
            </div>
          ))}
        </div>
      )}

      {page === 'policy' && (
        <div className="bg-white p-4 rounded border mb-6">
          <h2 className="font-medium mb-3">Our Policy Section</h2>
          {[
            { key: 'easyExchangeTitle', label: 'Easy Exchange Title' },
            { key: 'easyExchangeBody', label: 'Easy Exchange Description' },
            { key: 'returnPolicyTitle', label: 'Return Policy Title' },
            { key: 'returnPolicyBody', label: 'Return Policy Description' },
            { key: 'customerSupportTitle', label: 'Customer Support Title' },
            { key: 'customerSupportBody', label: 'Customer Support Description' },
          ].map(({ key, label }) => (
            <div key={key} className="grid md:grid-cols-3 gap-2 items-center mb-2">
              <div className="text-sm font-medium">{label}</div>
              {key.includes('Body') ? (
                <textarea 
                  key={`${key}-${page}`}
                  className="border px-2 py-1 text-sm md:col-span-2 h-20 resize-none" 
                  value={getValue(key)} 
                  onChange={(e) => handleInputChange(key, e.target.value)} 
                />
              ) : (
                <input 
                  key={`${key}-${page}`}
                  className="border px-2 py-1 text-sm md:col-span-2" 
                  value={getValue(key)} 
                  onChange={(e) => handleInputChange(key, e.target.value)} 
                />
              )}
            </div>
          ))}
        </div>
      )}

      {page === 'newsletter' && (
        <div className="bg-white p-4 rounded border mb-6">
          <h2 className="font-medium mb-3">Newsletter Section</h2>
          {[
            { key: 'title', label: 'Main Title' },
            { key: 'subtitle', label: 'Subtitle' },
            { key: 'description', label: 'Description Text' },
            { key: 'benefit1', label: 'Benefit 1' },
            { key: 'benefit2', label: 'Benefit 2' },
            { key: 'benefit3', label: 'Benefit 3' },
            { key: 'benefit4', label: 'Benefit 4' },
            { key: 'formTitle', label: 'Form Title' },
            { key: 'formSubtitle', label: 'Form Subtitle' },
            { key: 'placeholder', label: 'Email Placeholder' },
            { key: 'buttonText', label: 'Button Text' },
            { key: 'disclaimer', label: 'Disclaimer Text' },
            { key: 'stat1Number', label: 'Stat 1 Number' },
            { key: 'stat1Label', label: 'Stat 1 Label' },
            { key: 'stat2Number', label: 'Stat 2 Number' },
            { key: 'stat2Label', label: 'Stat 2 Label' },
            { key: 'stat3Number', label: 'Stat 3 Number' },
            { key: 'stat3Label', label: 'Stat 3 Label' },
            { key: 'stat4Number', label: 'Stat 4 Number' },
            { key: 'stat4Label', label: 'Stat 4 Label' },
          ].map(({ key, label }) => (
            <div key={key} className="grid md:grid-cols-3 gap-2 items-center mb-2">
              <div className="text-sm font-medium">{label}</div>
              {key.includes('description') || key.includes('disclaimer') ? (
                <textarea 
                  key={`${key}-${page}`}
                  className="border px-2 py-1 text-sm md:col-span-2 h-20 resize-none" 
                  value={getValue(key)} 
                  onChange={(e) => handleInputChange(key, e.target.value)} 
                />
              ) : (
                <input 
                  key={`${key}-${page}`}
                  className="border px-2 py-1 text-sm md:col-span-2" 
                  value={getValue(key)} 
                  onChange={(e) => handleInputChange(key, e.target.value)} 
                />
              )}
            </div>
          ))}
        </div>
      )}

      {page === 'products' && (
        <div className="bg-white p-4 rounded border mb-6">
          <h2 className="font-medium mb-3">Product Section Titles</h2>
          {[
            { key: 'latestCollectionTitle', label: 'Latest Collection Title' },
            { key: 'liveOffersTitle', label: 'Live Offers Title' },
            { key: 'bestSellersTitle', label: 'Best Sellers Title' },
          ].map(({ key, label }) => (
            <div key={key} className="grid md:grid-cols-3 gap-2 items-center mb-2">
              <div className="text-sm font-medium">{label}</div>
              <input 
                key={`${key}-${page}`}
                className="border px-2 py-1 text-sm md:col-span-2" 
                value={getValue(key)} 
                onChange={(e) => handleInputChange(key, e.target.value)} 
              />
            </div>
          ))}
        </div>
      )}

      {page === 'categories' && <CategoriesEditor token={token} />}

      {Object.keys(pendingChanges).length > 0 && (
        <div className="bg-white p-4 rounded border mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {Object.keys(pendingChanges).length} unsaved change{Object.keys(pendingChanges).length > 1 ? 's' : ''}
          </div>
          <button 
            onClick={saveAllChanges} 
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded font-medium"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Content;