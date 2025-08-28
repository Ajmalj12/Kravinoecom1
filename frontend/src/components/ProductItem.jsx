import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

const ProductItem = ({ id, image, name, price, sizes, discountInfo, finalPrice }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState("");

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!sizes || sizes.length === 0) {
      // If no sizes available, add directly
      addToCart(id, "");
      toast.success("Added to cart!");
    } else {
      // If sizes available, use first size as default or require selection
      const defaultSize = sizes[0];
      addToCart(id, defaultSize);
      toast.success("Added to cart!");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group relative h-full flex flex-col">
      <Link to={`/product/${id}`}>
        <div className="overflow-hidden h-64 w-full relative">
          <img
            src={image[0]}
            alt=""
            className="hover:scale-105 transition-transform duration-300 w-full h-full object-contain"
          />
          {discountInfo && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {discountInfo.discount.type === 'percentage' ? `${discountInfo.discount.value}% OFF` : `${currency}${discountInfo.discount.value} OFF`}
            </div>
          )}
        </div>
      </Link>
      
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-200"
        title={isInWishlist(id) ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${
            isInWishlist(id) 
              ? "text-red-500 fill-current" 
              : "text-gray-600 hover:text-red-500"
          }`} 
        />
      </button>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${id}`} className="flex-grow">
          <h3 className="text-sm text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-3 leading-tight">
            {name}
          </h3>
          <div className="flex flex-col gap-1 mb-2">
            {discountInfo ? (
              <>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-red-600">
                    {currency}{finalPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    {currency}{price.toFixed(2)}
                  </p>
                </div>
                <div className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold w-fit">
                  {discountInfo.discount.type === 'percentage' 
                    ? `${discountInfo.discount.value}% OFF` 
                    : `${currency}${discountInfo.discount.value} OFF`}
                </div>
              </>
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {currency}{price.toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500">Category: General</p>
            <p className="text-xs text-gray-400">Added: {new Date().toLocaleDateString()}</p>
          </div>
        </Link>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-2.5 px-4 text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2 rounded mt-auto"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
