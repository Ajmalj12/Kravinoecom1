import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import axios from 'axios';

const LiveOffers = () => {
  const { backendUrl } = useContext(ShopContext);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveOffers = async () => {
      try {
        // Get products with discounts from the main product list
        const response = await axios.get(backendUrl + '/api/product/list');
        if (response.data.success) {
          // Filter products that have discount info
          const productsWithDiscounts = response.data.products.filter(product => product.discountInfo);
          setDiscountedProducts(productsWithDiscounts);
        }
      } catch (error) {
        console.error('Failed to fetch live offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveOffers();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="my-10">
        <div className="text-center py-8 text-3xl">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (discountedProducts.length === 0) {
    return null;
  }

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <div className="inline-flex items-center gap-2 mb-3">
          <p className="text-gray-500">LIVE</p>
          <p className="text-gray-700 font-medium">OFFERS</p>
          <p className="text-gray-500">🔥</p>
        </div>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Don't miss out on these amazing deals! Limited time offers on selected products.
        </p>
      </div>

      {/* Displaying Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {discountedProducts.map((item, index) => (
          <ProductItem
            key={index}
            name={item.name}
            id={item._id}
            price={item.price}
            image={item.image}
            sizes={item.sizes}
            discountInfo={item.discountInfo}
            finalPrice={item.finalPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default LiveOffers;
