import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X, Save, Ruler, Package } from 'lucide-react';
import Pagination from '../components/Pagination';

const Sizes = ({ token }) => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSize, setEditingSize] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    sortOrder: 0
  });
  
  // Size category management state
  const [sizeCategories, setSizeCategories] = useState([
    { id: 'clothing', name: 'Clothing', description: 'Apparel and clothing sizes' },
    { id: 'shoes', name: 'Shoes', description: 'Footwear sizes' },
    { id: 'accessories', name: 'Accessories', description: 'Accessory sizes' },
    { id: 'general', name: 'General', description: 'General purpose sizes' }
  ]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    description: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch sizes
  const fetchSizes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/size/list`);
      if (response.data.success) {
        setSizes(response.data.sizes);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch sizes');
    } finally {
      setLoading(false);
    }
  };

  // Add new size
  const addSize = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/size/add`,
        formData,
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success('Size added successfully');
        setShowAddModal(false);
        resetForm();
        fetchSizes();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add size');
    }
  };

  // Update size
  const updateSize = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/size/update`,
        { id: editingSize._id, ...formData },
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success('Size updated successfully');
        setEditingSize(null);
        resetForm();
        fetchSizes();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update size');
    }
  };

  // Delete size
  const deleteSize = async (id) => {
    if (!window.confirm('Are you sure you want to delete this size?')) return;
    
    try {
      const response = await axios.post(
        `${backendUrl}/api/size/remove`,
        { id },
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success('Size deleted successfully');
        fetchSizes();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete size');
    }
  };

  // Seed initial sizes
  const seedSizes = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/size/seed`,
        {},
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success('Sizes seeded successfully');
        fetchSizes();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to seed sizes');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'general',
      sortOrder: 0
    });
    setEditingSize(null);
  };

  // Category management functions
  const resetCategoryForm = () => {
    setCategoryFormData({
      id: '',
      name: '',
      description: ''
    });
    setEditingCategory(null);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    resetCategoryForm();
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      id: category.id,
      name: category.name,
      description: category.description
    });
    setShowCategoryModal(true);
  };

  const saveCategoryHandler = (e) => {
    e.preventDefault();
    
    if (!categoryFormData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const categoryId = categoryFormData.id || categoryFormData.name.toLowerCase().replace(/\s+/g, '_');
    
    if (editingCategory) {
      // Update existing category
      setSizeCategories(prev => 
        prev.map(cat => 
          cat.id === editingCategory.id 
            ? { ...categoryFormData, id: categoryId }
            : cat
        )
      );
      toast.success('Category updated successfully');
    } else {
      // Add new category
      if (sizeCategories.some(cat => cat.id === categoryId)) {
        toast.error('Category already exists');
        return;
      }
      setSizeCategories(prev => [...prev, { ...categoryFormData, id: categoryId }]);
      toast.success('Category added successfully');
    }
    
    setShowCategoryModal(false);
    resetCategoryForm();
  };

  const deleteCategoryHandler = (categoryId) => {
    // Check if any sizes use this category
    const sizesUsingCategory = sizes.filter(size => size.category === categoryId);
    
    if (sizesUsingCategory.length > 0) {
      toast.error(`Cannot delete category. ${sizesUsingCategory.length} sizes are using this category.`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      setSizeCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully');
    }
  };

  // Handle edit size
  const handleEditSize = (size) => {
    setEditingSize(size);
    setFormData({
      name: size.name,
      description: size.description || '',
      category: size.category || 'general',
      sortOrder: size.sortOrder || 0
    });
  };

  // Get category badge color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'clothing': return 'bg-blue-100 text-blue-800';
      case 'shoes': return 'bg-green-100 text-green-800';
      case 'accessories': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination calculations
  const totalItems = sizes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSizes = sizes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Size Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage product sizes and size categories for your store.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          {sizes.length === 0 && (
            <button
              onClick={seedSizes}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Package className="h-4 w-4 mr-2" />
              Seed Sizes
            </button>
          )}
          <button
            onClick={handleAddCategory}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Size
          </button>
        </div>
      </div>

      {/* Size Categories Section */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Size Categories</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sizeCategories.map((category) => {
                const sizesInCategory = sizes.filter(size => size.category === category.id);
                return (
                  <div key={category.id} className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(category.id)}`}>
                            {category.name}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 truncate">{category.description}</p>
                        <p className="mt-1 text-xs text-gray-400">{sizesInCategory.length} sizes</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {category.id !== 'general' && (
                          <button
                            onClick={() => deleteCategoryHandler(category.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sizes List */}
      <div className="mt-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-500">Loading sizes...</p>
          </div>
        ) : sizes.length === 0 ? (
          <div className="text-center py-12">
            <Ruler className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sizes</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new size or seeding initial data.</p>
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {currentSizes.map((size) => (
                  <li key={size._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Ruler className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {size.name}
                            </p>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(size.category)}`}>
                              {size.category}
                            </span>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Order: {size.sortOrder}
                            </span>
                          </div>
                          {size.description && (
                            <p className="mt-1 text-sm text-gray-500 truncate">
                              {size.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditSize(size)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSize(size._id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Size Modal */}
      {(showAddModal || editingSize) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingSize ? 'Edit Size' : 'Add New Size'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSize(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={editingSize ? updateSize : addSize} className="p-6">
              <div className="space-y-4">
                {/* Size Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Size Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., XL, 32, 10"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., Extra Large, Waist 32 inches"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {sizeCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    id="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSize(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingSize ? 'Update Size' : 'Create Size'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button 
                onClick={() => {
                  setShowCategoryModal(false);
                  resetCategoryForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveCategoryHandler} className="p-6">
              <div className="space-y-4">
                {/* Category Name */}
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., Electronics, Books"
                    required
                  />
                </div>

                {/* Category Description */}
                <div>
                  <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="categoryDescription"
                    rows="3"
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Brief description of this size category"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    resetCategoryForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sizes;
