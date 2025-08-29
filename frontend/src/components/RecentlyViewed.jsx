import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useWishlist } from '../context/WishlistContext';
import { getRecentlyViewed, removeFromRecentlyViewed } from '../utils/recentlyViewed';
import { Heart, ShoppingCart, X, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const RecentlyViewed = ({ showTitle = true, maxItems = 8 }) => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [productsWithDiscounts, setProductsWithDiscounts] = useState([]);
  const { currency, addToCart, backendUrl } = useContext(ShopContext);
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const loadRecentlyViewed = async () => {
      const recent = getRecentlyViewed().slice(0, maxItems);
      setRecentProducts(recent);
      
      // Fetch discount information for recently viewed products
      if (recent.length > 0 && backendUrl) {
        try {
          const response = await axios.get(backendUrl + '/api/discount/active');
          if (response.data.success) {
            const discounts = response.data.discounts;
            
            const productsWithDiscountInfo = recent.map(product => {
              const applicableDiscount = discounts.find(d => 
                d.applicableProducts.length === 0 || 
                d.applicableProducts.some(p => p._id === product._id)
              );
              
              if (applicableDiscount) {
                let discountAmount = 0;
                if (applicableDiscount.type === 'percentage') {
                  discountAmount = (product.price * applicableDiscount.value) / 100;
                  if (applicableDiscount.maxDiscountAmount && discountAmount > applicableDiscount.maxDiscountAmount) {
                    discountAmount = applicableDiscount.maxDiscountAmount;
                  }
                } else {
                  discountAmount = applicableDiscount.value;
                }
                
                const finalPrice = Math.max(0, product.price - discountAmount);
                
                return {
                  ...product,
                  discountInfo: {
                    discount: applicableDiscount,
                    discountedPrice: finalPrice,
                    originalPrice: product.price
                  },
                  finalPrice
                };
              }
              
              return product;
            });
            
            setProductsWithDiscounts(productsWithDiscountInfo);
          }
        } catch (error) {
          console.error('Failed to fetch discounts:', error);
          setProductsWithDiscounts(recent);
        }
      }
    };

    loadRecentlyViewed();
    
    // Listen for storage changes to update across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'recentlyViewedProducts') {
        loadRecentlyViewed();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [maxItems, backendUrl]);

  const handleRemoveItem = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromRecentlyViewed(productId);
    setRecentProducts(prev => prev.filter(item => item._id !== productId));
    setProductsWithDiscounts(prev => prev.filter(item => item._id !== productId));
    toast.success('Removed from recently viewed');
  };

  const handleWishlistClick = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(productId);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const priceToUse = product.finalPrice || product.price;
    
    if (!product.sizes || product.sizes.length === 0) {
      addToCart(product._id, "", priceToUse);
      toast.success("Added to cart!");
    } else {
      const defaultSize = product.sizes[0];
      addToCart(product._id, defaultSize, priceToUse);
      toast.success("Added to cart!");
    }
  };

  const displayProducts = productsWithDiscounts.length > 0 ? productsWithDiscounts : recentProducts;

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-8 px-4 md:px-6 lg:px-8">
      {showTitle && (
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Recently Viewed Products
          </h2>
        </div>
      )}
      
      {/* Grid with max 4 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((product) => (
          <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group relative h-full flex flex-col">
            <Link to={`/product/${product._id}`}>
              <div className="overflow-hidden h-64 w-full relative">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="hover:scale-105 transition-transform duration-300 w-full h-full object-contain"
                />
                {product.discountInfo && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {product.discountInfo.discount.type === 'percentage' ? `${product.discountInfo.discount.value}% OFF` : `${currency}${product.discountInfo.discount.value} OFF`}
                  </div>
                )}
              </div>
            </Link>
            
            {/* Remove Button */}
            <button
              onClick={(e) => handleRemoveItem(product._id, e)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-200"
              title="Remove from recently viewed"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Wishlist Button */}
            <button
              onClick={(e) => handleWishlistClick(product._id, e)}
              className="absolute top-2 right-12 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-200"
              title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  isInWishlist(product._id) 
                    ? "text-red-500 fill-current" 
                    : "text-gray-600 hover:text-red-500"
                }`} 
              />
            </button>
            
            <div className="p-4 flex flex-col flex-grow">
              <Link to={`/product/${product._id}`} className="flex-grow">
                <h3 className="text-sm text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-3 leading-tight">
                  {product.name}
                </h3>
                <div className="flex flex-col gap-1 mb-2">
                  {product.discountInfo ? (
                    <>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-red-600">
                          {currency}{product.finalPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          {currency}{product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold w-fit">
                        {product.discountInfo.discount.type === 'percentage' 
                          ? `${product.discountInfo.discount.value}% OFF` 
                          : `${currency}${product.discountInfo.discount.value} OFF`}
                      </div>
                    </>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">
                      {currency}{product.price.toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500">Category: {product.category || 'General'}</p>
                  <p className="text-xs text-gray-400">Viewed: {new Date(product.viewedAt).toLocaleDateString()}</p>
                </div>
              </Link>
              
              {/* Add to Cart Button */}
              <button
                onClick={(e) => handleAddToCart(product, e)}
                className="w-full bg-black text-white py-2.5 px-4 text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2 rounded mt-auto"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
