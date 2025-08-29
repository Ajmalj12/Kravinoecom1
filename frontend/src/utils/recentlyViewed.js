// Recently Viewed Products utility functions

const STORAGE_KEY = 'recentlyViewedProducts';
const MAX_ITEMS = 8; // Maximum number of recently viewed products to store

export const getRecentlyViewed = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting recently viewed products:', error);
    return [];
  }
};

export const addToRecentlyViewed = (product) => {
  try {
    if (!product || !product._id) return;
    
    let recentlyViewed = getRecentlyViewed();
    
    // Remove if already exists to avoid duplicates
    recentlyViewed = recentlyViewed.filter(item => item._id !== product._id);
    
    // Add to beginning of array
    recentlyViewed.unshift({
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      sizes: product.sizes,
      category: product.category,
      subCategory: product.subCategory,
      viewedAt: new Date().toISOString()
    });
    
    // Keep only MAX_ITEMS
    recentlyViewed = recentlyViewed.slice(0, MAX_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
};

export const removeFromRecentlyViewed = (productId) => {
  try {
    let recentlyViewed = getRecentlyViewed();
    recentlyViewed = recentlyViewed.filter(item => item._id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  } catch (error) {
    console.error('Error removing from recently viewed:', error);
  }
};
