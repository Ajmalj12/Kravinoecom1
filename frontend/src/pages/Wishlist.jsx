import React, { useContext, useEffect, useMemo } from "react";
import { useWishlist } from "../context/WishlistContext";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Package, Star, Filter, Grid, List } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { currency, addToCart, getDiscountForProduct, pageContent } = useContext(ShopContext);
  const [viewMode, setViewMode] = React.useState('grid');
  const [sortBy, setSortBy] = React.useState('newest');
  const [filterBy, setFilterBy] = React.useState('all');

  const handleAddToCart = async (product) => {
    try {
      console.log('Adding to cart:', product);
      
      // Check if product and productId exist
      if (!product || !product.productId) {
        console.error('Invalid product data:', product);
        toast.error('Invalid product data');
        return;
      }
      
      const productId = product.productId._id;
      const productPrice = product.productId.price;
      const availableSizes = product.productId.sizes;
      
      console.log('Product details:', { productId, productPrice, availableSizes });
      
      // Get discount info if available
      const discountInfo = getDiscountForProduct ? getDiscountForProduct(productId, productPrice) : null;
      const priceToUse = discountInfo ? discountInfo.discountedPrice : productPrice;
      
      // Use first available size or default to 'M'
      const sizeToUse = (availableSizes && availableSizes.length > 0) ? availableSizes[0] : 'M';
      
      console.log('Adding to cart with:', { productId, sizeToUse, priceToUse });
      
      // Call addToCart function
      await addToCart(productId, sizeToUse);
      toast.success('Item added to cart!');
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Error adding to cart:', error);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Item removed from wishlist!');
    } catch (error) {
      toast.error('Failed to remove item from wishlist');
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      try {
        await clearWishlist();
        toast.success('Wishlist cleared successfully!');
      } catch (error) {
        toast.error('Failed to clear wishlist');
        console.error('Error clearing wishlist:', error);
      }
    }
  };

  // Sort and filter wishlist items
  const processedWishlist = useMemo(() => {
    let filtered = [...wishlist];
    
    // Filter by category
    if (filterBy !== 'all') {
      filtered = filtered.filter(item => item.productId.category === filterBy);
    }
    
    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedAt) - new Date(a.addedAt);
        case 'oldest':
          return new Date(a.addedAt) - new Date(b.addedAt);
        case 'price-low':
          return (a.productId.finalPrice || a.productId.price) - (b.productId.finalPrice || b.productId.price);
        case 'price-high':
          return (b.productId.finalPrice || b.productId.price) - (a.productId.finalPrice || a.productId.price);
        case 'name':
          return a.productId.name.localeCompare(b.productId.name);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [wishlist, sortBy, filterBy]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = [...new Set(wishlist.map(item => item.productId.category))];
    return cats;
  }, [wishlist]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-gray-50 to-white py-12 px-0"
      >
        <div className="w-full text-center px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
            {pageContent?.wishlist?.title || 'My Wishlist'}
          </h1>
          <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {pageContent?.wishlist?.subtitle || 'Your curated collection of favorite items'}
          </p>
        </div>
      </motion.div>

      <div className="w-full px-4 sm:px-6 py-4">
        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center max-w-2xl mx-auto"
          >
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">
              {pageContent?.wishlist?.emptyTitle || 'Your Wishlist is Empty'}
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {pageContent?.wishlist?.emptyDescription || 'Discover amazing products and save your favorites here for easy access later.'}
            </p>
            <Link
              to="/collection"
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg cursor-pointer relative z-20"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Start Shopping button clicked');
              }}
            >
              <Package className="w-5 h-5 mr-2 pointer-events-none" />
              {pageContent?.wishlist?.shopButton || 'Start Shopping'}
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 w-full"
          >
            {/* Header with stats and controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-black text-white px-4 py-2 rounded-lg font-semibold">
                  {processedWishlist.length} Items
                </div>
                <p className="text-gray-600">
                  {processedWishlist.length !== wishlist.length && `Showing ${processedWishlist.length} of ${wishlist.length} items`}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 relative z-10">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Switching to grid view');
                      setViewMode('grid');
                    }}
                    className={`p-2 rounded-md transition-colors cursor-pointer relative z-20 ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Grid View"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Grid className="w-4 h-4 pointer-events-none" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Switching to list view');
                      setViewMode('list');
                    }}
                    className={`p-2 rounded-md transition-colors cursor-pointer relative z-20 ${
                      viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="List View"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <List className="w-4 h-4 pointer-events-none" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Sorting by:', e.target.value);
                    setSortBy(e.target.value);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white cursor-pointer relative z-20"
                  style={{ pointerEvents: 'auto' }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>

                {/* Category Filter */}
                {categories.length > 0 && (
                  <select
                    value={filterBy}
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Filtering by category:', e.target.value);
                      setFilterBy(e.target.value);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white cursor-pointer relative z-20"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                )}

                {/* Clear All Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Clear all clicked');
                    handleClearWishlist();
                  }}
                  className="flex items-center px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-colors font-medium cursor-pointer relative z-20"
                  disabled={wishlist.length === 0}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Trash2 className="w-4 h-4 mr-2 pointer-events-none" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" 
              : "space-y-4"
            }>
              {processedWishlist.map((item, index) => (
                <motion.div 
                  key={item.productId._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={viewMode === 'grid' 
                    ? "group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    : "group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex"
                  }
                >
                  <div className={viewMode === 'grid' ? "relative" : "relative w-48 flex-shrink-0"}>
                    <Link 
                      to={`/product/${item.productId._id}`}
                      className="cursor-pointer relative z-10"
                      style={{ pointerEvents: 'auto' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Product image clicked, navigating to:', `/product/${item.productId._id}`);
                      }}
                    >
                      <img
                        src={item.productId.image[0]}
                        alt={item.productId.name}
                        className={viewMode === 'grid' 
                          ? "w-full h-64 object-contain group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          : "w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        }
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Remove from wishlist clicked');
                        handleRemoveFromWishlist(item.productId._id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-20 cursor-pointer"
                      title="Remove from wishlist"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current pointer-events-none" />
                    </button>
                    {item.productId.discountInfo && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        {item.productId.discountInfo.discount.type === 'percentage' 
                          ? `${item.productId.discountInfo.discount.value}% OFF` 
                          : `${currency}${item.productId.discountInfo.discount.value} OFF`}
                      </div>
                    )}
                  </div>

                  <div className={viewMode === 'grid' ? "p-6" : "flex-1 p-6 flex flex-col justify-between"}>
                    <div>
                      <Link 
                        to={`/product/${item.productId._id}`}
                        className="cursor-pointer relative z-10"
                        style={{ pointerEvents: 'auto' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Product name clicked, navigating to:', `/product/${item.productId._id}`);
                        }}
                      >
                        <h3 className="font-semibold text-lg text-black mb-2 hover:text-gray-600 transition-colors line-clamp-2 cursor-pointer">
                          {item.productId.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm font-medium">
                          {item.productId.category}
                        </span>
                        {item.productId.bestSeller && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Bestseller
                          </span>
                        )}
                      </div>

                      <div className="mb-4">
                        {item.productId.finalPrice && item.productId.finalPrice < item.productId.price ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <p className="text-2xl font-bold text-red-600">
                                {currency}{item.productId.finalPrice.toFixed(2)}
                              </p>
                              <p className="text-lg text-gray-500 line-through">
                                {currency}{item.productId.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold w-fit">
                              {Math.round(((item.productId.price - item.productId.finalPrice) / item.productId.price) * 100)}% OFF
                            </div>
                          </div>
                        ) : (
                          <p className="text-2xl font-bold text-black">
                            {currency}{(item.productId.finalPrice || item.productId.price).toFixed(2)}
                          </p>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 mb-4">
                        <p>Added on {new Date(item.addedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>

                    <div className={viewMode === 'grid' ? "space-y-2" : "flex gap-3"}>
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Add to cart button clicked for:', item.productId?.name);
                          console.log('Full item data:', item);
                          await handleAddToCart(item);
                        }}
                        className="flex-1 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2 cursor-pointer relative z-20"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <ShoppingCart className="w-4 h-4 pointer-events-none" />
                        Add to Cart
                      </button>
                      {viewMode === 'list' && (
                        <Link
                          to={`/product/${item.productId._id}`}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold cursor-pointer relative z-20"
                          style={{ pointerEvents: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('View details clicked for:', item.productId.name);
                          }}
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Continue Shopping */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <Link
                to="/collection"
                className="inline-flex items-center px-8 py-4 bg-gray-100 text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors shadow-lg"
              >
                <Package className="w-5 h-5 mr-2" />
                {pageContent?.wishlist?.continueButton || 'Continue Shopping'}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Newsletter Section */}
      <NewsletterBox />
    </div>
  );
};

export default Wishlist;
