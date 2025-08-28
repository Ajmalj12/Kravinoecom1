import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/category/list");
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/size/list");
      if (response.data.success) {
        setSizes(response.data.sizes);
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSizes();
  }, []);

  const value = {
    categories,
    sizes,
    fetchCategories,
    fetchSizes
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
