import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductSection = ({ title, products, viewAllLink, fullWidth = false }) => {
  const { currency } = useContext(ShopContext);
  const navigate = useNavigate();

  if (fullWidth) {
    return (
      <div className="bg-white shadow-sm border-y my-6">
        <div className="flex items-center justify-between p-4 border-b px-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          {viewAllLink && (
            <button
              onClick={() => navigate(viewAllLink)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
              <ChevronRight size={16} className="ml-1" />
            </button>
          )}
        </div>
        
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.slice(0, 16).map((item, index) => (
              <div key={index} className="group">
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  discountInfo={item.discountInfo}
                  finalPrice={item.finalPrice}
                  sizes={item.sizes}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border mx-4 my-6">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {viewAllLink && (
          <button
            onClick={() => navigate(viewAllLink)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
            <ChevronRight size={16} className="ml-1" />
          </button>
        )}
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((item, index) => (
            <div key={index} className="group">
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                discountInfo={item.discountInfo}
                finalPrice={item.finalPrice}
                sizes={item.sizes}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
