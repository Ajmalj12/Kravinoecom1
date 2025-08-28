import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, setSearch, categories } = useContext(ShopContext);

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

  const sortProduct = (productsToSort) => {
    let fpCopy = [...productsToSort];

    switch (sortType) {
      case "low-high":
        return fpCopy.sort((a, b) => a.price - b.price);
      case "high-low":
        return fpCopy.sort((a, b) => b.price - a.price);
      default:
        return fpCopy;
    }
  };

  // Apply filter and sort
  useEffect(() => {
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

    // Apply sorting to filtered products
    const sortedProducts = sortProduct(productsCopy);
    setFilterProducts(sortedProducts);
  }, [category, subCategory, search, products, sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-6 sm:pt-10 border-t bg-white px-3 sm:px-0">
      {/* FILTER OPTIONS */}
      <div className="min-w-60 sm:sticky sm:top-4 sm:self-start">
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
        
        {/* Filter Container with Scroll */}
        <div className={`${showFilter ? "" : "hidden"} sm:block max-h-[70vh] overflow-y-auto`}>
          {/* CATEGORY FILTER */}
          <div className="border border-gray-300 pl-5 py-3 mt-3 sm:mt-6 rounded-md shadow-sm">
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {categories.map((cat) => (
                <p key={cat._id} className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={cat.name}
                    onChange={toggleCategory}
                    id={`category-${cat._id}`}
                  />
                  <label htmlFor={`category-${cat._id}`} className="cursor-pointer">
                    {cat.name}
                  </label>
                </p>
              ))}
            </div>
          </div>

          {/* SUBCATEGORIES FILTER */}
          <div className="border border-gray-300 pl-5 py-3 my-3 sm:my-5 rounded-md shadow-sm">
            <p className="mb-3 text-sm font-medium">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700 max-h-48 overflow-y-auto">
              {categories.map((cat) => 
                cat.subCategories?.map((sub) => (
                  <p key={`${cat._id}-${sub._id}`} className="flex gap-2">
                    <input
                      className="w-3"
                      type="checkbox"
                      value={sub.name}
                      onChange={toggleSubCategory}
                      id={`subcategory-${sub._id}`}
                    />
                    <label htmlFor={`subcategory-${sub._id}`} className="cursor-pointer">
                      {sub.name}
                    </label>
                  </p>
                ))
              )}
            </div>
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
