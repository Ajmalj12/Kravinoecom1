import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X, Save, FolderPlus, Tag } from 'lucide-react';

const Categories = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subCategories: []
  });
  const [newSubCategory, setNewSubCategory] = useState({ name: '', description: '', image: null });
  const [categoryImage, setCategoryImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [subcategoryImage, setSubcategoryImage] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/category/list`);
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Add new category
  const addCategory = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      
      // First create the category
      const response = await axios.post(
        `${backendUrl}/api/category/add`,
        formData,
        { headers: { token } }
      );
      
      if (response.data.success) {
        const categoryId = response.data.category._id;
        
        // If there's a category image, upload it
        if (categoryImage) {
          const imageFormData = new FormData();
          imageFormData.append('image', categoryImage);
          
          try {
            await axios.post(
              `${backendUrl}/api/category/${categoryId}/upload-image`,
              imageFormData,
              { 
                headers: { 
                  'Content-Type': 'multipart/form-data',
                  token 
                } 
              }
            );
          } catch (imageError) {
            console.error('Category image upload failed:', imageError);
            toast.warning('Category created but category image upload failed');
          }
        }

        // Upload subcategory images if any
        const subcategoriesWithImages = formData.subCategories.filter(sub => sub.image);
        if (subcategoriesWithImages.length > 0) {
          // Get the updated category with subcategory IDs
          const updatedCategoryResponse = await axios.get(`${backendUrl}/api/category/list`);
          const updatedCategory = updatedCategoryResponse.data.categories.find(cat => cat._id === categoryId);
          
          for (const subcatWithImage of subcategoriesWithImages) {
            // Find the corresponding subcategory in the saved category
            const savedSubcat = updatedCategory.subCategories.find(sub => 
              sub.name === subcatWithImage.name && sub.description === subcatWithImage.description
            );
            
            if (savedSubcat && subcatWithImage.image) {
              const subcatImageFormData = new FormData();
              subcatImageFormData.append('image', subcatWithImage.image);
              
              try {
                await axios.post(
                  `${backendUrl}/api/category/${categoryId}/subcategory/${savedSubcat._id}/upload-image`,
                  subcatImageFormData,
                  { 
                    headers: { 
                      'Content-Type': 'multipart/form-data',
                      token 
                    } 
                  }
                );
              } catch (subcatImageError) {
                console.error('Subcategory image upload failed:', subcatImageError);
                toast.warning(`Subcategory "${subcatWithImage.name}" image upload failed`);
              }
            }
          }
        }
        
        toast.success('Category added successfully');
        setShowAddModal(false);
        resetForm();
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add category');
    } finally {
      setUploading(false);
    }
  };

  // Update category
  const updateCategory = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      
      // First update the category
      const response = await axios.post(
        `${backendUrl}/api/category/update`,
        { id: editingCategory._id, ...formData },
        { headers: { token } }
      );
      
      if (response.data.success) {
        const categoryId = editingCategory._id;
        
        // If there's a new category image, upload it
        if (categoryImage) {
          const imageFormData = new FormData();
          imageFormData.append('image', categoryImage);
          
          try {
            await axios.post(
              `${backendUrl}/api/category/${categoryId}/upload-image`,
              imageFormData,
              { 
                headers: { 
                  'Content-Type': 'multipart/form-data',
                  token 
                } 
              }
            );
          } catch (imageError) {
            console.error('Category image upload failed:', imageError);
            toast.warning('Category updated but image upload failed');
          }
        }
        
        toast.success('Category updated successfully');
        setEditingCategory(null);
        resetForm();
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update category');
    } finally {
      setUploading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await axios.post(
        `${backendUrl}/api/category/remove`,
        { id },
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success('Category deleted successfully');
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete category');
    }
  };

  // Seed initial categories
  const seedCategories = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/category/seed`,
        {},
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success('Categories seeded successfully');
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to seed categories');
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

  // Add subcategory to form
  const addSubCategoryToForm = () => {
    if (!newSubCategory.name.trim()) {
      toast.error('Subcategory name is required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      subCategories: [...prev.subCategories, { 
        name: newSubCategory.name,
        description: newSubCategory.description,
        image: newSubCategory.image
      }]
    }));
    setNewSubCategory({ name: '', description: '', image: null });
  };

  // Remove subcategory from form
  const removeSubCategoryFromForm = (index) => {
    setFormData(prev => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, i) => i !== index)
    }));
  };

  // Edit subcategory
  const handleEditSubcategory = (subcategory, categoryId) => {
    setEditingSubcategory({ ...subcategory, categoryId });
  };

  // Update subcategory
  const updateSubcategory = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      
      const { categoryId, _id, name, description } = editingSubcategory;
      
      // Find the category and update the subcategory
      const category = categories.find(cat => cat._id === categoryId);
      if (!category) {
        toast.error('Category not found');
        return;
      }
      
      // Update subcategory in the category
      const updatedSubCategories = category.subCategories.map(sub => 
        sub._id === _id ? { ...sub, name, description } : sub
      );
      
      const response = await axios.post(
        `${backendUrl}/api/category/update`,
        { 
          id: categoryId, 
          name: category.name,
          description: category.description,
          subCategories: updatedSubCategories
        },
        { headers: { token } }
      );
      
      if (response.data.success) {
        // If there's a new subcategory image, upload it
        if (subcategoryImage) {
          const imageFormData = new FormData();
          imageFormData.append('image', subcategoryImage);
          
          try {
            await axios.post(
              `${backendUrl}/api/category/${categoryId}/subcategory/${_id}/upload-image`,
              imageFormData,
              { 
                headers: { 
                  'Content-Type': 'multipart/form-data',
                  token 
                } 
              }
            );
          } catch (imageError) {
            console.error('Subcategory image upload failed:', imageError);
            toast.warning('Subcategory updated but image upload failed');
          }
        }
        
        toast.success('Subcategory updated successfully');
        setEditingSubcategory(null);
        setSubcategoryImage(null);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update subcategory');
    } finally {
      setUploading(false);
    }
  };

  // Delete subcategory
  const deleteSubcategory = async (categoryId, subcategoryId) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
    
    try {
      const response = await axios.post(
        `${backendUrl}/api/category/remove-subcategory`,
        { categoryId, subCategoryId: subcategoryId },
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success('Subcategory deleted successfully');
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete subcategory');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      subCategories: []
    });
    setNewSubCategory({ name: '', description: '', image: null });
    setCategoryImage(null);
    setEditingSubcategory(null);
    setSubcategoryImage(null);
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      subCategories: category.subCategories || []
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Categories Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage product categories and subcategories for your store.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          {categories.length === 0 && (
            <button
              onClick={seedCategories}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Seed Categories
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="mt-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new category or seeding initial data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {category.description && (
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Subcategories ({category.subCategories?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.subCategories?.map((sub, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 group relative"
                      >
                        <span>{sub.name}</span>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <button
                            onClick={() => handleEditSubcategory(sub, category._id)}
                            className="text-indigo-600 hover:text-indigo-900 p-0.5"
                            title="Edit subcategory"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => deleteSubcategory(category._id, sub._id)}
                            className="text-red-600 hover:text-red-900 p-0.5"
                            title="Delete subcategory"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Subcategory Modal */}
      {editingSubcategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white">
              <h3 className="text-lg font-medium text-gray-900">
                Edit Subcategory
              </h3>
              <button 
                onClick={() => {
                  setEditingSubcategory(null);
                  setSubcategoryImage(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={updateSubcategory} className="p-6">
              <div className="space-y-6">
                {/* Subcategory Name */}
                <div>
                  <label htmlFor="subcatName" className="block text-sm font-medium text-gray-700">
                    Subcategory Name *
                  </label>
                  <input
                    type="text"
                    name="subcatName"
                    id="subcatName"
                    required
                    value={editingSubcategory.name}
                    onChange={(e) => setEditingSubcategory(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., T-shirts, Jeans, Dresses"
                  />
                </div>

                {/* Subcategory Description */}
                <div>
                  <label htmlFor="subcatDescription" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="subcatDescription"
                    id="subcatDescription"
                    rows="3"
                    value={editingSubcategory.description || ''}
                    onChange={(e) => setEditingSubcategory(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Brief description of this subcategory"
                  />
                </div>

                {/* Current Subcategory Image */}
                {editingSubcategory.image && !subcategoryImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Image
                    </label>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={editingSubcategory.image} 
                        alt={editingSubcategory.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <div>
                        <p className="text-sm text-gray-600">Current subcategory image</p>
                        <button
                          type="button"
                          onClick={() => document.getElementById('subcatImage').click()}
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Change image
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subcategory Image Upload */}
                <div>
                  <label htmlFor="subcatImage" className="block text-sm font-medium text-gray-700">
                    Subcategory Image
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <input
                      type="file"
                      id="subcatImage"
                      accept="image/*,image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Validate file size (max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error('Image size must be less than 5MB');
                            e.target.value = '';
                            return;
                          }
                          // Validate file type
                          if (!file.type.startsWith('image/')) {
                            toast.error('Please select a valid image file');
                            e.target.value = '';
                            return;
                          }
                          setSubcategoryImage(file);
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {subcategoryImage && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">✓ New image selected: {subcategoryImage.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSubcategoryImage(null);
                            document.getElementById('subcatImage').value = '';
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload an image for this subcategory. Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSubcategory(null);
                    setSubcategoryImage(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {uploading ? 'Updating...' : 'Update Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {(showAddModal || editingCategory) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCategory(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={editingCategory ? updateCategory : addCategory} className="p-6">
              <div className="space-y-6">
                {/* Category Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., Men, Women, Kids"
                  />
                </div>

                {/* Category Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Brief description of this category"
                  />
                </div>

                {/* Category Image */}
                <div>
                  <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700">
                    Category Image
                  </label>
                  
                  {/* Show current image if editing */}
                  {editingCategory && editingCategory.image && !categoryImage && (
                    <div className="mt-2 mb-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={editingCategory.image} 
                          alt={editingCategory.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div>
                          <p className="text-sm text-gray-600">Current image</p>
                          <button
                            type="button"
                            onClick={() => {
                              // Create a file input to select new image
                              document.getElementById('categoryImage').click();
                            }}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            Change image
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-1 flex items-center space-x-4">
                    <input
                      type="file"
                      id="categoryImage"
                      accept="image/*,image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Validate file size (max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error('Image size must be less than 5MB');
                            e.target.value = '';
                            return;
                          }
                          // Validate file type
                          if (!file.type.startsWith('image/')) {
                            toast.error('Please select a valid image file');
                            e.target.value = '';
                            return;
                          }
                          setCategoryImage(file);
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {categoryImage && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">✓ New image selected: {categoryImage.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryImage(null);
                            document.getElementById('categoryImage').value = '';
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload an image to display in the category navigation. Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB. Recommended size: 200x200px
                  </p>
                </div>

                {/* Subcategories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategories
                  </label>
                  
                  {/* Add Subcategory Form */}
                  <div className="border border-gray-200 rounded-md p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <input
                        type="text"
                        placeholder="Subcategory name"
                        value={newSubCategory.name}
                        onChange={(e) => setNewSubCategory(prev => ({ ...prev, name: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={newSubCategory.description}
                        onChange={(e) => setNewSubCategory(prev => ({ ...prev, description: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                    {/* Subcategory Image Upload */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory Image (Optional)
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*,image/jpeg,image/png,image/gif,image/webp"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              // Validate file size (max 5MB)
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error('Image size must be less than 5MB');
                                e.target.value = '';
                                return;
                              }
                              // Validate file type
                              if (!file.type.startsWith('image/')) {
                                toast.error('Please select a valid image file');
                                e.target.value = '';
                                return;
                              }
                              setNewSubCategory(prev => ({ ...prev, image: file }));
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {newSubCategory.image && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-green-600">✓ Image selected: {newSubCategory.image.name}</span>
                            <button
                              type="button"
                              onClick={() => setNewSubCategory(prev => ({ ...prev, image: null }))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={addSubCategoryToForm}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Subcategory
                    </button>
                  </div>

                  {/* Subcategories List */}
                  {formData.subCategories.length > 0 && (
                    <div className="space-y-2">
                      {formData.subCategories.map((sub, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center space-x-3">
                            {sub.image && (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                <span className="text-xs text-green-600">📷</span>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-gray-900">{sub.name}</span>
                              {sub.description && (
                                <span className="text-sm text-gray-500 ml-2">- {sub.description}</span>
                              )}
                              {sub.image && (
                                <div className="text-xs text-green-600 mt-1">Image attached</div>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSubCategoryFromForm(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {uploading ? 'Creating...' : (editingCategory ? 'Update Category' : 'Create Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
