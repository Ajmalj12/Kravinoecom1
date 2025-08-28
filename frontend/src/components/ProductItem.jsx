import { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, sizes }) => {
  const { currency, getDiscountForProduct } = useContext(ShopContext);
  
  const discountInfo = useMemo(() => {
    return getDiscountForProduct(id, price);
  }, [getDiscountForProduct, id, price]);

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="overflow-hidden h-64 w-full relative">
        <img
          src={image[0]}
          alt=""
          className="hover:scale-110 transition ease-in-out w-full h-full object-contain"
        />
        {discountInfo && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {discountInfo.discount.type === 'percentage' ? `${discountInfo.discount.value}% OFF` : `${currency}${discountInfo.discount.value} OFF`}
          </div>
        )}
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {discountInfo ? (
            <>
              <p className="text-sm font-medium text-red-600">
                {currency}{discountInfo.discountedPrice.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 line-through">
                {currency}{price}
              </p>
            </>
          ) : (
            <p className="text-sm font-medium">
              {currency}{price}
            </p>
          )}
        </div>
        <p className="text-xs text-gray-500">Available in standard sizes</p>
      </div>
    </Link>
  );
};

export default ProductItem;
