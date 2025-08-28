import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import LoginModal from "../components/LoginModal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0 && item !== 'discountedPrice') {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
              discountedPrice: cartItems[items].discountedPrice || null,
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-8 md:pt-14 px-4 md:px-6 lg:px-8">
      <div className="text-xl md:text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg mb-4">Your cart is empty</p>
            <button 
              onClick={() => navigate('/collection')}
              className="bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          cartData.map((item, i) => {
            const productsData = products.find(
              (product) => product._id === item._id
            );

            return (
              <div
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[3fr_0.5fr_0.5fr] md:grid-cols-[4fr_1fr_0.5fr] items-center gap-2 md:gap-4"
                key={i}
              >
                <div className="flex items-start gap-3 md:gap-6">
                  <img
                    src={productsData.image[0]}
                    className="w-14 md:w-20 object-cover"
                    alt={productsData.name}
                  />
                  <div>
                    <p className="text-xs md:text-lg font-medium">
                      {productsData.name}
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-5 mt-2">
                      <div className="flex items-center gap-2">
                        {item.discountedPrice ? (
                          <>
                            <p className="font-medium text-red-600">
                              {currency}{item.discountedPrice.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              {currency}{productsData.price}
                            </p>
                          </>
                        ) : (
                          <p className="font-medium">
                            {currency}{productsData.price}
                          </p>
                        )}
                      </div>
                      <p className="px-2 md:px-3 py-1 border bg-gray-50 inline-block w-fit">
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>

                <input
                  className="border max-w-10 md:max-w-20 px-1 md:px-2 py-1 text-center"
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(
                          item._id,
                          item.size,
                          Number(e.target.value)
                        )
                  }
                />
                <div className="flex justify-end">
                  <img
                    src={assets.bin_icon}
                    className="w-4 md:w-5 cursor-pointer hover:opacity-70 transition-opacity"
                    alt="Remove item"
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-end my-10 md:my-20">
        <div className="w-full md:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              className="bg-black text-white text-sm my-8 px-8 py-3"
              onClick={() => token ? navigate("/place-order") : setShowLoginModal(true)}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
          
          <LoginModal 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)} 
            onLoginSuccess={() => navigate("/place-order")}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
