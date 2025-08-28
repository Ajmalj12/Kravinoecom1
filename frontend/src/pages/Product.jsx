import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProduct from "../components/RelatedProduct";
import { toast } from "react-toastify";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, cartItems, addToCart, token, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [reviews, setReviews] = useState([]);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(null);

  const renderStars = (value) => {
    const full = Math.round(value); // simple rounding to nearest whole star
    return (
      <span className="inline-flex items-center gap-1">
        {[1,2,3,4,5].map((i) => (
          <img key={i} src={i <= full ? assets.star_icon : assets.star_dull_icon} className="w-4 h-4" alt={i <= full ? "star" : "star empty"} />
        ))}
      </span>
    );
  };

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        
        // Select the first size as default if sizes are available
        if (item.sizes && item.sizes.length > 0) {
          setSize(item.sizes[0]);
        }

        return null;
      }
    });
  };

  const fetchDiscount = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/discount/active');
      if (response.data.success) {
        const applicableDiscount = response.data.discounts.find(d => 
          d.applicableProducts.length === 0 || 
          d.applicableProducts.some(p => p._id === productId)
        );
        
        if (applicableDiscount && productData) {
          setDiscount(applicableDiscount);
          let discountAmount = 0;
          if (applicableDiscount.type === 'percentage') {
            discountAmount = (productData.price * applicableDiscount.value) / 100;
            if (applicableDiscount.maxDiscountAmount && discountAmount > applicableDiscount.maxDiscountAmount) {
              discountAmount = applicableDiscount.maxDiscountAmount;
            }
          } else {
            discountAmount = applicableDiscount.value;
          }
          setDiscountedPrice(Math.max(0, productData.price - discountAmount));
        }
      }
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/${productId}/reviews`);
      if (res.data.success) {
        setReviews(res.data.reviews || []);
        setRatingAverage(res.data.ratingAverage || 0);
        setRatingCount(res.data.ratingCount || 0);
      }
    } catch (e) {
      // ignore silently for now
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (productData) {
      fetchDiscount();
    }
  }, [productData, productId, backendUrl]);

  // Scroll to top whenever product changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [productId]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to add a review");
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await axios.post(
        `${backendUrl}/api/product/${productId}/reviews`,
        { rating: Number(newReview.rating), comment: newReview.comment },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Review added");
        setNewReview({ rating: 5, comment: "" });
        setReviews(res.data.reviews || []);
        setRatingAverage(res.data.ratingAverage || 0);
        setRatingCount(res.data.ratingCount || 0);
      } else {
        toast.error(res.data.message || "Failed to add review");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return productData ? (
    <div className="border-t-2 pt-6 md:pt-10 px-4 md:px-6 lg:px-8 transition-opacity ease-in duration-500 opacity-100">
      {/* PRODUCT DATA */}
      <div className="flex gap-6 md:gap-12 flex-col md:flex-row">
        {/* PRODUCT IMAGES */}

        <div className="flex-1 flex flex-col-reverse gap-3 md:flex-row">
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto max-h-[500px] justify-between md:justify-normal md:w-[18.7%] w-full">
            {productData.image.map((item, i) => (
              <img
                src={item}
                key={i}
                className="w-[24%] md:w-full md:mb-3 flex-shrink-0 cursor-pointer border hover:border-gray-400 p-1"
                alt={`${productData.name} view ${i+1}`}
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full md:w-[80%]">
            <img src={image} className="w-full h-auto object-contain" alt={productData.name} />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex-1 mt-6 md:mt-0">
          <h1 className="font-medium text-xl md:text-2xl my-2">{productData.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            {renderStars(ratingAverage)}
            <span className="text-sm text-gray-600">{ratingAverage.toFixed(1)} ({ratingCount})</span>
          </div>
          <div className="mt-4 md:mt-5 flex items-center gap-4">
            {discount ? (
              <>
                <div className="flex items-center gap-2">
                  <p className="text-2xl md:text-3xl font-medium text-red-600">
                    {currency}{discountedPrice?.toFixed(2)}
                  </p>
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    {discount.type === 'percentage' ? `${discount.value}% OFF` : `${currency}${discount.value} OFF`}
                  </div>
                </div>
                <p className="text-lg text-gray-500 line-through">
                  {currency}{productData.price}
                </p>
              </>
            ) : (
              <p className="text-2xl md:text-3xl font-medium">
                {currency}{productData.price}
              </p>
            )}
          </div>
          <p className="mt-4 md:mt-5 text-gray-500 text-sm md:text-base w-full md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-3 md:gap-4 my-6 md:my-8">
            <p className="font-medium">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((item, i) => (
                <button
                  className={`border py-2 px-4 bg-gray-100 hover:bg-gray-200 transition-colors ${
                    item === size ? "border-orange-500 bg-orange-50" : ""
                  }`}
                  key={i}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            className="w-full md:w-auto bg-black text-white px-8 py-3 text-sm active:bg-gray-700 hover:bg-gray-800 transition-colors"
            onClick={() => {
              if (!size) {
                toast.error("Must select product size!");
                return;
              }
              // Add to cart with discounted price if available
              const priceToUse = discountedPrice || productData.price;
              addToCart(productData._id, size, priceToUse);
              toast.success("Added to cart!");
            }}
          >
            ADD TO CART
          </button>
          <hr className="mt-8 w-full md:w-4/5" />

          <div className="text-xs md:text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, idx) => (
                <div key={idx} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{r.name}</span>
                    <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(r.rating)}
                    <span className="text-xs text-gray-600">{r.rating}/5</span>
                  </div>
                  <p className="text-sm mt-1 text-gray-700">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Write a Review</h2>
          {!token && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Please login to write a review.</strong> You need to be logged in to share your experience with this product.
              </p>
            </div>
          )}
          <form onSubmit={submitReview} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="border px-3 py-2"
                disabled={!token}
              >
                {[5,4,3,2,1].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full border px-3 py-2"
                rows={3}
                placeholder={token ? "Share your thoughts about this product" : "Please login to write a review"}
                disabled={!token}
              />
            </div>
            <button disabled={submittingReview || !token} className="bg-black text-white px-6 py-2 text-sm rounded disabled:opacity-60">
              {submittingReview ? "Submitting..." : !token ? "Login Required" : "Submit Review"}
            </button>
          </form>
        </div>
      </div>

      {/* DISPLAY RELATED PRODUCTS */}
      <div className="mt-10 md:mt-16">
        <RelatedProduct
          category={productData.category}
          subCategory={productData.subCategory}
          excludeId={productId}
        />
      </div>
    </div>
  ) : (
    <div className="opacity-0 min-h-screen"></div>
  );
};

export default Product;
