import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, setSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((p) => p.filter((item) => item !== e.target.value));
    } else {
      setCategory((p) => [...p, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((p) => p.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((p) => [...p, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = [...filterProducts]; // Create a proper copy to avoid mutation issues

    switch (sortType) {
      case "low-high":
        return fpCopy.sort((a, b) => a.price - b.price);
      case "high-low":
        return fpCopy.sort((a, b) => b.price - a.price);
      default:
        return fpCopy;
    }
  };

  // Apply initial filter
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, products]);
  
  // Apply sorting whenever filter results or sort type changes
  useEffect(() => {
    if (filterProducts.length > 0) {
      const sortedProducts = sortProduct();
      // Use a different setter approach to avoid infinite loops
      setFilterProducts(prev => {
        // Only update if the sort actually changed something
        if (JSON.stringify(prev) !== JSON.stringify(sortedProducts)) {
          return sortedProducts;
        }
        return prev;
      });
    }
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-6 sm:pt-10 border-t bg-white px-3 sm:px-0">
      {/* FILTER OPTIONS */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2 justify-between sm:justify-start border-b pb-2 sm:border-0 sm:pb-0"
        >
          FILTERS
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            alt=""
          />
        </p>
        {/* CATEGORY FILTER */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-3 sm:mt-6 ${showFilter ? "" : "hidden"} sm:block rounded-md shadow-sm`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Men"}
                onChange={toggleCategory}
                id="men-category"
              />{" "}
              <label htmlFor="men-category" className="cursor-pointer">Men</label>
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Women"}
                onChange={toggleCategory}
                id="women-category"
              />{" "}
              <label htmlFor="women-category" className="cursor-pointer">Women</label>
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Kids"}
                onChange={toggleCategory}
                id="kids-category"
              />{" "}
              <label htmlFor="kids-category" className="cursor-pointer">Kids</label>
            </p>
          </div>
        </div>

        {/* SUBCATEGORIES FILTER */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-3 sm:my-5 ${showFilter ? "" : "hidden"} sm:block rounded-md shadow-sm`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Topwear"}
                onChange={toggleSubCategory}
                id="topwear"
              />{" "}
              <label htmlFor="topwear" className="cursor-pointer">Topwear</label>
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
                id="bottomwear"
              />{" "}
              <label htmlFor="bottomwear" className="cursor-pointer">Bottomwear</label>
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Winterwear"}
                onChange={toggleSubCategory}
                id="winterwear"
              />{" "}
              <label htmlFor="winterwear" className="cursor-pointer">Winterwear</label>
            </p>
          </div>
        </div>
        
        {/* Mobile Apply Button */}
        <button 
          onClick={() => setShowFilter(false)}
          className="w-full py-2 bg-black text-white rounded-md mt-3 mb-5 sm:hidden"
        >
          Apply Filters
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1">
        {/* SEARCH BAR */}
        <div className="mb-6">
          <div className="flex items-center justify-center border border-gray-400 px-4 py-3 rounded-full bg-gray-50">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 outline-none bg-inherit text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <img src={assets.search_icon} className="w-4 ml-2" alt="Search" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* PRODUCT SORT */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2 py-1 rounded-md w-full sm:w-auto"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* MAP PRODUCTS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 gap-y-6">
          {filterProducts.length > 0 ? (
            filterProducts.map((item, i) => (
              <ProductItem
                key={i}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              <p>No products found matching your filters.</p>
              <button 
                onClick={() => {setCategory([]); setSubCategory([]);}} 
                className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
