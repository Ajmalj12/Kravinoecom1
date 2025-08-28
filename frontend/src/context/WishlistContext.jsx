import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const WishlistContext = createContext();

const WishlistContextProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/wishlist`, {
        headers: { token }
      });

      if (response.data.success) {
        setWishlist(response.data.wishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add product to wishlist
  const addToWishlist = async (productId) => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to add items to wishlist");
      return false;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/wishlist/add`,
        { productId },
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchWishlist();
        toast.success("Added to wishlist");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
      return false;
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    const token = getToken();
    if (!token) return false;

    try {
      const response = await axios.post(
        `${backendUrl}/api/wishlist/remove`,
        { productId },
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchWishlist();
        toast.success("Removed from wishlist");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
      return false;
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId._id === productId);
  };

  // Toggle wishlist status
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    const token = getToken();
    if (!token) return false;

    try {
      const response = await axios.delete(`${backendUrl}/api/wishlist/clear`, {
        headers: { token }
      });

      if (response.data.success) {
        setWishlist([]);
        toast.success("Wishlist cleared");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
      return false;
    }
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlist.length;
  };

  // Load wishlist on component mount and when token changes
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, []);

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    getWishlistCount,
    fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistContextProvider");
  }
  return context;
};

export default WishlistContextProvider;
