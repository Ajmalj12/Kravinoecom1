import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { getCartAmount, getOriginalCartAmount, getTotalDiscount, currency, delivery_fee } = useContext(ShopContext);

  return (
    <div className="w-full ">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTAL"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        {getTotalDiscount() > 0 && (
          <>
            <div className="flex justify-between">
              <p>Original Subtotal</p>
              <p className="line-through text-gray-500">
                {currency} {getOriginalCartAmount().toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-green-600 font-medium">Discount</p>
              <p className="text-green-600 font-medium">
                -{currency} {getTotalDiscount().toFixed(2)}
              </p>
            </div>
            <hr />
          </>
        )}
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p className={getTotalDiscount() > 0 ? "text-red-600 font-medium" : ""}>
            {currency} {getCartAmount().toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b className={getTotalDiscount() > 0 ? "text-red-600" : ""}>
            {currency}{" "}
            {getCartAmount() === 0 ? 0 : (getCartAmount() + delivery_fee).toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
