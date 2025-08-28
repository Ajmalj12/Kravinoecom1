import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [pageContent, setPageContent] = useState({}); // { page: { key: value } }
  const [discounts, setDiscounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

  const navigate = useNavigate();

  const addToCart = async (itemId, size, price = null) => {
    if (!size) {
      toast.error("Select product size!");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // Store discounted price if provided
    if (price !== null) {
      if (!cartData[itemId].discountedPrice) {
        cartData[itemId].discountedPrice = price;
      }
    }

    setCartItems(cartData);
    // Store cart in localStorage for persistence
    localStorage.setItem('cartItems', JSON.stringify(cartData));

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size, price },
          { headers: { token } }
        );
      } catch (e) {
        console.log(e);
        toast.error(e.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (e) {}
      }
    }

    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);
    // Store cart in localStorage for persistence
    localStorage.setItem('cartItems', JSON.stringify(cartData));

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (e) {
        console.log(e);
        toast.error(e.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);

      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0 && item !== 'discountedPrice') {
            // Use discounted price if available, otherwise use original price
            const priceToUse = cartItems[items].discountedPrice || itemInfo.price;
            totalAmount += priceToUse * cartItems[items][item];
          }
        } catch (e) {}
      }
    }

    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDiscountsData = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/discount/list");
      if (res.data.success) {
        setDiscounts(res.data.discounts);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCategoriesData = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/category/list");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getSizesData = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/size/list");
      if (res.data.success) {
        setSizes(res.data.sizes);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDiscountForProduct = (productId, productPrice) => {
    const applicableDiscount = discounts.find(d => 
      d.applicableProducts.some(p => p._id === productId)
    );
    
    if (applicableDiscount) {
      let discountAmount = 0;
      if (applicableDiscount.type === 'percentage') {
        discountAmount = (productPrice * applicableDiscount.value) / 100;
        if (applicableDiscount.maxDiscountAmount && discountAmount > applicableDiscount.maxDiscountAmount) {
          discountAmount = applicableDiscount.maxDiscountAmount;
        }
      } else {
        discountAmount = applicableDiscount.value;
      }
      const discountedPrice = Math.max(0, productPrice - discountAmount);
      return {
        discount: applicableDiscount,
        discountedPrice,
        originalPrice: productPrice
      };
    }
    return null;
  };

  const getUserCart = async (token) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        setCartItems(res.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchPageContent = async (page) => {
    try {
      const res = await axios.get(backendUrl + "/api/page/list", { params: { page } });
      if (res.data.success) {
        const map = {};
        res.data.items.forEach((i) => { map[i.key] = i.value; });
        setPageContent((prev) => ({ ...prev, [page]: map }));
      }
    } catch (e) { /* ignore */ }
  };

  useEffect(() => {
    getProductsData();
    getDiscountsData();
    getCategoriesData();
    getSizesData();
    fetchPageContent('about');
    fetchPageContent('contact');
    fetchPageContent('global');
    fetchPageContent('home');
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    setCartItems,
    pageContent,
    fetchPageContent,
    discounts,
    getDiscountForProduct,
    categories,
    sizes,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
