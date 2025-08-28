import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProduct from "../components/RelatedProduct";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, cartItems, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

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

  useEffect(() => {
    fetchProductData();
  }, [productId]);

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
          <div className="flex items-center gap-1 mt-2">
            <img className="w-3.5" src={assets.star_icon} alt="Star rating" />
            <img className="w-3.5" src={assets.star_icon} alt="Star rating" />
            <img className="w-3.5" src={assets.star_icon} alt="Star rating" />
            <img className="w-3.5" src={assets.star_icon} alt="Star rating" />
            <img className="w-3.5" src={assets.star_dull_icon} alt="Star rating" />
            <p className="pl-2 text-sm">(122)</p>
          </div>
          <p className="mt-4 md:mt-5 text-2xl md:text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
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
              addToCart(productData._id, size);
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

      {/* DISPLAY RELATED PRODUCTS */}
      <div className="mt-10 md:mt-16">
        <RelatedProduct
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  ) : (
    <div className="opacity-0 min-h-screen"></div>
  );
};

export default Product;
