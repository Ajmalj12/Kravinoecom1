import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProduct = ({ category, subCategory, excludeId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productCopy = products.slice();

      productCopy = productCopy.filter((item) => category === item.category);
      productCopy = productCopy.filter(
        (item) => subCategory === item.subCategory
      );

      if (excludeId) {
        productCopy = productCopy.filter((item) => item._id !== excludeId);
      }

      setRelated(productCopy.slice(0, 5));
    }
  }, [products, category, subCategory, excludeId]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-col-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-6">
        {related.map((item, i) => (
          <ProductItem
            key={i}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            sizes={item.sizes}
            discountInfo={item.discountInfo}
            finalPrice={item.finalPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
