import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';

const Discounts = ({ token }) => {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'percentage',
    value: '',
    maxDiscountAmount: '',
    applicableProducts: [],
    applicableCategories: [],
    active: true,
    startDate: '',
    endDate: '',
    showOnHomePage: false
  });

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/discount/list?includeInactive=true', {
        headers: { token }
      });
      if (response.data.success) {
        setDiscounts(response.data.discounts);
      }
    } catch (error) {
      toast.error('Failed to fetch discounts');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
        
        // Extract unique categories and subcategories
        const uniqueCategories = [...new Set(response.data.products.map(p => p.category))];
        const uniqueSubCategories = [...new Set(response.data.products.map(p => p.subCategory))];
        setCategories(uniqueCategories);
        setSubCategories(uniqueSubCategories);
      }
    } catch (error) {
      console.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchDiscounts();
    fetchProducts();
  }, []);

  // Filter products based on category and subcategory
  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (selectedSubCategory) {
      filtered = filtered.filter(product => product.subCategory === selectedSubCategory);
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedSubCategory, products]);

  // Update subcategories based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const categoryProducts = products.filter(p => p.category === selectedCategory);
      const categorySubCategories = [...new Set(categoryProducts.map(p => p.subCategory))];
      setSubCategories(categorySubCategories);
      setSelectedSubCategory(''); // Reset subcategory when category changes
    } else {
      const allSubCategories = [...new Set(products.map(p => p.subCategory))];
      setSubCategories(allSubCategories);
    }
  }, [selectedCategory, products]);

  // Filter products for search dropdown
  const searchFilteredProducts = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 10); // Limit to 10 results

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingDiscount 
        ? backendUrl + '/api/discount/update'
        : backendUrl + '/api/discount/add';
      
      const data = editingDiscount 
        ? { ...formData, id: editingDiscount._id }
        : formData;

      const response = await axios.post(url, data, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success(editingDiscount ? 'Discount updated' : 'Discount created');
        resetForm();
        fetchDiscounts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        const response = await axios.post(backendUrl + '/api/discount/remove', { id }, {
          headers: { token }
        });
        if (response.data.success) {
          toast.success('Discount deleted');
          fetchDiscounts();
        }
      } catch (error) {
        toast.error('Failed to delete discount');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'percentage',
      value: '',
      maxDiscountAmount: '',
      applicableProducts: [],
      applicableCategories: [],
      active: true,
      startDate: '',
      endDate: '',
      showOnHomePage: false
    });
    setEditingDiscount(null);
    setShowForm(false);
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setFormData({
      title: discount.title,
      description: discount.description || '',
      type: discount.type,
      value: discount.value,
      maxDiscountAmount: discount.maxDiscountAmount || '',
      applicableProducts: discount.applicableProducts.map(p => p._id || p),
      applicableCategories: discount.applicableCategories || [],
      active: discount.active,
      startDate: new Date(discount.startDate).toISOString().split('T')[0],
      endDate: new Date(discount.endDate).toISOString().split('T')[0],
      showOnHomePage: discount.showOnHomePage || false
    });
    setShowForm(true);
  };

  const handleProductSelection = (productId) => {
    setFormData(prev => ({
      ...prev,
      applicableProducts: prev.applicableProducts.includes(productId)
        ? prev.applicableProducts.filter(id => id !== productId)
        : [...prev.applicableProducts, productId]
    }));
  };

  const handleProductSearchSelect = (product) => {
    if (!formData.applicableProducts.includes(product._id)) {
      setFormData(prev => ({
        ...prev,
        applicableProducts: [...prev.applicableProducts, product._id]
      }));
    }
    setProductSearch('');
    setShowProductDropdown(false);
  };

  const removeSelectedProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      applicableProducts: prev.applicableProducts.filter(id => id !== productId)
    }));
  };

  const getSelectedProductsDetails = () => {
    return products.filter(p => formData.applicableProducts.includes(p._id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Discount Offers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add New Discount'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingDiscount ? 'Edit Discount' : 'Create New Discount'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded"
                required
                placeholder="e.g., 20% Off Summer Sale"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded"
                rows="2"
                placeholder="Optional description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ({currency})</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Value * {formData.type === 'percentage' ? '(0-100)' : `(${currency})`}
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                className="w-full p-2 border rounded"
                required
                min="0"
                max={formData.type === 'percentage' ? "100" : undefined}
                step={formData.type === 'percentage' ? "1" : "0.01"}
              />
            </div>


            {formData.type === 'percentage' && (
              <div>
                <label className="block text-sm font-medium mb-1">Max Discount Amount ({currency})</label>
                <input
                  type="number"
                  value={formData.maxDiscountAmount}
                  onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.01"
                  placeholder="No limit"
                />
              </div>
            )}


            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="active" className="text-sm font-medium">Active</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showOnHomePage"
                  checked={formData.showOnHomePage}
                  onChange={(e) => setFormData({...formData, showOnHomePage: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="showOnHomePage" className="text-sm font-medium">Show in Live Offers</label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Applicable Products (Leave empty for all products)</label>
              
              {/* Category and Subcategory Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Filter by Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Filter by Subcategory</label>
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="w-full p-2 border rounded"
                    disabled={!selectedCategory}
                  >
                    <option value="">All Subcategories</option>
                    {subCategories.map(subCategory => (
                      <option key={subCategory} value={subCategory}>{subCategory}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Search Bar */}
              <div className="relative mb-4">
                <label className="block text-sm font-medium mb-1">Search and Select Products</label>
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowProductDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowProductDropdown(productSearch.length > 0)}
                  className="w-full p-2 border rounded"
                  placeholder="Search products by name..."
                />
                
                {/* Search Dropdown */}
                {showProductDropdown && searchFilteredProducts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchFilteredProducts.map(product => (
                      <div
                        key={product._id}
                        onClick={() => handleProductSearchSelect(product)}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              {product.category} {`>`} {product.subCategory}
                            </div>
                          </div>
                          <div className="text-sm font-medium">{currency}{product.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Products Display */}
              {getSelectedProductsDetails().length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Selected Products ({getSelectedProductsDetails().length})</label>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {getSelectedProductsDetails().map(product => (
                        <div key={product._id} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm border">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={product.image?.[0]} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">
                                {product.category} {`>`} {product.subCategory}
                              </div>
                              <div className="text-sm font-medium text-green-600">
                                {currency}{product.price}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => removeSelectedProduct(product._id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                              title="Remove from offer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Product List with Checkboxes */}
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                <div className="text-sm text-gray-600 mb-2">
                  Showing {filteredProducts.length} products
                  {selectedCategory && ` in ${selectedCategory}`}
                  {selectedSubCategory && ` > ${selectedSubCategory}`}
                </div>
                {filteredProducts.map(product => (
                  <div key={product._id} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`product-${product._id}`}
                      checked={formData.applicableProducts.includes(product._id)}
                      onChange={() => handleProductSelection(product._id)}
                      className="mr-2"
                    />
                    <label htmlFor={`product-${product._id}`} className="text-sm flex-1">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-gray-500 ml-2">
                        ({product.category} {`>`} {product.subCategory}) - {currency}{product.price}
                      </span>
                    </label>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No products found for the selected filters
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                {editingDiscount ? 'Update Discount' : 'Create Discount'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Existing Discounts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Live Offers</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {discounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(discount => (
                <tr key={discount._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{discount.title}</td>
                  <td className="px-4 py-3 text-sm">
                    {discount.type === 'percentage' ? `${discount.value}%` : `${currency}${discount.value}`}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {discount.type === 'percentage' ? `${discount.value}%` : `${currency}${discount.value}`}
                    {discount.maxDiscountAmount && ` (max ${currency}${discount.maxDiscountAmount})`}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {discount.applicableProducts.length === 0 ? 'All Products' : `${discount.applicableProducts.length} Products`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      discount.active && new Date(discount.endDate) > new Date()
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {discount.active && new Date(discount.endDate) > new Date() ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      discount.showOnHomePage ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {discount.showOnHomePage ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(discount.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleEdit(discount)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(discount._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {discounts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No discounts found. Create your first discount offer!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discounts;
