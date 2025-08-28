import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp, Search, Filter, X, Edit, Trash2, Package, Tag, DollarSign, Star } from 'lucide-react';
import Pagination from '../components/Pagination';
import { ShopContext } from '../context/ShopContext';

const List = ({ token }) => {
  const { categories, sizes } = useContext(ShopContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    bestSeller: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    sizes: [],
    bestSeller: false
  });
  const [editSizeCategory, setEditSizeCategory] = useState("clothing");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        console.log("Products data:", response.data.products);
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      sizes: product.sizes || [],
      bestSeller: product.bestSeller || false
    });
    setIsModalOpen(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSizeChange = (size) => {
    const updatedSizes = [...formData.sizes];
    
    if (updatedSizes.includes(size)) {
      // Remove size if already selected
      const index = updatedSizes.indexOf(size);
      updatedSizes.splice(index, 1);
    } else {
      // Add size if not selected
      updatedSizes.push(size);
    }
    
    setFormData({
      ...formData,
      sizes: updatedSizes
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...formData,
        price: Number(formData.price)
      };
      
      console.log("Updating product with data:", updateData);
      
      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        { id: editingProduct._id, ...updateData },
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success("Product updated successfully");
        setIsModalOpen(false);
        fetchList();
      } else {
        toast.error(response.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      subCategory: '',
      bestSeller: ''
    });
    setCurrentPage(1);
  };

  const filteredList = list.filter(item => {
    // Add null checks to prevent errors
    if (!item) return false;
    
    // Search term filter
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = !filters.category || item.category === filters.category;
    
    // Subcategory filter
    const matchesSubCategory = !filters.subCategory || item.subCategory === filters.subCategory;
    
    // Bestseller filter
    const matchesBestSeller = filters.bestSeller === '' || 
                             (filters.bestSeller === 'true' && item.bestSeller) ||
                             (filters.bestSeller === 'false' && !item.bestSeller);
    
    return matchesSearch && matchesCategory && matchesSubCategory && matchesBestSeller;
  });

  // Pagination calculations
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredList.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Get subcategories for filter dropdown
  const getFilterSubcategories = () => {
    if (!filters.category) return [];
    const selectedCategory = categories.find(cat => cat.name === filters.category);
    return selectedCategory?.subCategories || [];
  };

  // Filter sizes based on selected edit size category
  const filteredEditSizes = sizes.filter(size => size.category === editSizeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all products in your store including their name, category, and price.
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Filter className="h-5 w-5 mr-2 text-gray-400" />
          Filter
          <ChevronDown className={`ml-2 h-5 w-5 text-gray-400 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    category: e.target.value,
                    subCategory: '' // Reset subcategory when category changes
                  });
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
              <select
                value={filters.subCategory}
                onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Sub Categories</option>
                {getFilterSubcategories().map((sub) => (
                  <option key={sub._id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Best Seller</label>
              <select
                value={filters.bestSeller}
                onChange={(e) => handleFilterChange('bestSeller', e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Products</option>
                <option value="true">Best Sellers Only</option>
                <option value="false">Non-Best Sellers</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
          {(filters.category || filters.subCategory || filters.bestSeller) && (
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredList.length} of {list.length} products
            </div>
          )}
        </div>
      )}

      {/* Product List */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Product
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Price
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Best Seller
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <div className="flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400 animate-pulse" />
                            <span className="ml-2 text-gray-500">Loading products...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <p className="text-gray-500">No products found</p>
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="py-4 pl-4 pr-3 sm:pl-6">
                            <div className="flex items-center">
                              <div className="h-12 w-12 flex-shrink-0">
                                <img
                                  className="h-12 w-12 rounded-md object-cover"
                                  src={item.image[0]}
                                  alt={item.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {item.category}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {currency}{item.price}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {item.bestSeller ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Best Seller
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleEditProduct(item)}
                                className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => removeProduct(item._id)}
                                className="text-red-600 hover:text-red-900 inline-flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white">
              <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setFormData({
                        ...formData,
                        [name]: value,
                        subCategory: '' // Reset subcategory when category changes
                      });
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">Sub Category</label>
                  <select
                    name="subCategory"
                    id="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Sub Category</option>
                    {categories
                      .find(cat => cat.name === formData.category)
                      ?.subCategories?.map((sub) => (
                        <option key={sub._id} value={sub.name}>{sub.name}</option>
                      ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size Category</label>
                  <select
                    value={editSizeCategory}
                    onChange={(e) => {
                      setEditSizeCategory(e.target.value);
                      setFormData({
                        ...formData,
                        sizes: [] // Clear selected sizes when category changes
                      });
                    }}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="clothing">Clothing</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                    <option value="general">General</option>
                  </select>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes ({editSizeCategory})</label>
                  <div className="flex flex-wrap gap-2">
                    {filteredEditSizes.map((sizeObj) => (
                      <button
                        key={sizeObj._id}
                        type="button"
                        onClick={() => handleSizeChange(sizeObj.name)}
                        className={`px-4 py-2 border ${
                          formData.sizes.includes(sizeObj.name)
                            ? 'bg-indigo-100 border-indigo-500 text-indigo-800'
                            : 'bg-white border-gray-300 text-gray-700'
                        } rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        {sizeObj.name}
                      </button>
                    ))}
                  </div>
                  {filteredEditSizes.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      No sizes available for {editSizeCategory} category. Please add sizes in the Size Management page.
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      id="bestSeller"
                      name="bestSeller"
                      type="checkbox"
                      checked={formData.bestSeller}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="bestSeller" className="ml-2 block text-sm text-gray-900">
                      Mark as Best Seller
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default List;