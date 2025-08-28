import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';

const ProductOffers = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subCategoryFilter, setSubCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products and discounts
  useEffect(() => {
    fetchProducts();
    fetchDiscounts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/discount/list', {
        headers: { token }
      });
      if (response.data.success) {
        setDiscounts(response.data.discounts);
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
      toast.error('Failed to fetch discounts');
    } finally {
      setLoading(false);
    }
  };

  // Get applicable discount for a product
  const getProductDiscount = (productId) => {
    return discounts.find(discount => 
      discount.applicableProducts.some(p => p._id === productId)
    );
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (product) => {
    const discount = getProductDiscount(product._id);
    if (!discount) return null;

    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = (product.price * discount.value) / 100;
      if (discount.maxDiscountAmount && discountAmount > discount.maxDiscountAmount) {
        discountAmount = discount.maxDiscountAmount;
      }
    } else {
      discountAmount = discount.value;
    }
    return Math.max(0, product.price - discountAmount);
  };

  // Open modal for product offer selection
  const openOfferModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Toggle product in discount
  const toggleProductInDiscount = async (productId, discountId, isCurrentlyIncluded) => {
    try {
      const endpoint = isCurrentlyIncluded ? 'remove-product' : 'add-product';
      const response = await axios.post(
        backendUrl + `/api/discount/${endpoint}`,
        { discountId, productId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchDiscounts(); // Refresh discounts
        closeModal(); // Close modal after successful action
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error toggling product:', error);
      toast.error('Failed to update product offer status');
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesSubCategory = !subCategoryFilter || product.subCategory === subCategoryFilter;
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, subCategoryFilter]);

  // Get unique categories and subcategories
  const categories = [...new Set(products.map(p => p.category))];
  const subCategories = [...new Set(products.map(p => p.subCategory))];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Offers Management</h1>
        <p className="text-gray-600">Manage which products are included in active discount offers</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
            <select
              value={subCategoryFilter}
              onChange={(e) => setSubCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sub Categories</option>
              {subCategories.map(subCategory => (
                <option key={subCategory} value={subCategory}>{subCategory}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Discounts Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">Active Discounts ({discounts.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {discounts.map(discount => (
            <div key={discount._id} className="bg-white p-3 rounded border">
              <div className="font-medium text-sm">{discount.name}</div>
              <div className="text-xs text-gray-600">
                {discount.type === 'percentage' ? `${discount.value}% OFF` : `${currency}${discount.value} OFF`}
              </div>
              <div className="text-xs text-blue-600">
                {discount.applicableProducts.length} products included
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="w-full">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{width: '40%'}}>
                  Product
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{width: '15%'}}>
                  Category
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{width: '15%'}}>
                  Price
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{width: '15%'}}>
                  Status
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{width: '15%'}}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map(product => {
                const discount = getProductDiscount(product._id);
                const discountedPrice = calculateDiscountedPrice(product);
                
                return (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-2 py-3">
                      <div className="flex items-center">
                        <img 
                          src={product.image[0]} 
                          alt={product.name}
                          className="h-8 w-8 object-cover rounded mr-2 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-gray-900 truncate">{product.name}</div>
                          <div className="text-xs text-gray-500 truncate">{product.subCategory}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-900">
                      <div className="truncate">{product.category}</div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="text-xs text-gray-900">
                        {discountedPrice ? (
                          <div>
                            <div className="text-red-600 font-medium">{currency}{discountedPrice.toFixed(0)}</div>
                            <div className="text-gray-500 line-through text-xs">{currency}{product.price}</div>
                          </div>
                        ) : (
                          <span>{currency}{product.price}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      {discount ? (
                        <div>
                          <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          No Offer
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-3 text-xs font-medium">
                      <button
                        onClick={() => openOfferModal(product)}
                        className="w-full px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found matching your criteria.
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal for Offer Selection */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Offers for {selectedProduct.name}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <img 
                src={selectedProduct.image[0]} 
                alt={selectedProduct.name}
                className="h-16 w-16 object-cover rounded-md mx-auto"
              />
              <p className="text-sm text-gray-600 text-center mt-2">
                {selectedProduct.category} • {currency}{selectedProduct.price}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Available Offers:</h4>
              {discounts.length > 0 ? (
                discounts.map(discount => {
                  const isIncluded = discount.applicableProducts.some(p => p._id === selectedProduct._id);
                  const currentOffer = getProductDiscount(selectedProduct._id);
                  const hasOtherOffer = currentOffer && currentOffer._id !== discount._id;
                  
                  return (
                    <div key={discount._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{discount.title}</div>
                        <div className="text-xs text-gray-600">
                          {discount.type === 'percentage' ? `${discount.value}% OFF` : `${currency}${discount.value} OFF`}
                        </div>
                        <div className="text-xs text-gray-500">
                          Valid until {new Date(discount.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleProductInDiscount(selectedProduct._id, discount._id, isIncluded)}
                        disabled={hasOtherOffer && !isIncluded}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          hasOtherOffer && !isIncluded
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isIncluded
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title={hasOtherOffer && !isIncluded ? 'Remove current offer first' : ''}
                      >
                        {isIncluded ? 'Remove' : hasOtherOffer ? 'Disabled' : 'Add'}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  No active offers available
                </p>
              )}
              
              {getProductDiscount(selectedProduct._id) && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> This product can only have one active offer at a time. Remove the current offer to add a different one.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOffers;
