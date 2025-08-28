import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, sizes }) => {
  const { currency } = useContext(ShopContext);
  return (
<Link href={`/product/${id}`} className="text-gray-700 cursor-pointer">
  <div className="w-full aspect-[4/5] overflow-hidden rounded-lg bg-gray-50">
    <Image
      src={image[0]}
      alt={name}
      width={500}
      height={600}
      className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
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
