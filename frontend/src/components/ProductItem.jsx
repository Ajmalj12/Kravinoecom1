import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, sizes }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="overflow-hidden h-64 w-full">
        <img
          src={image[0]}
          alt=""
          className="hover:scale-110 transition ease-in-out w-full h-full object-contain"
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
        <p className="text-xs text-gray-500">Available in standard sizes</p>
      </div>
    </Link>
  );
};

export default ProductItem;
