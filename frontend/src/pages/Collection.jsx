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
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-4 sm:pt-8 bg-white px-4 sm:px-6 w-full">
      {/* FILTER OPTIONS */}
      <div className="min-w-60 sm:sticky sm:top-28 sm:self-start sm:ml-4">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl font-semibold text-black flex items-center cursor-pointer gap-2 justify-between sm:justify-start border-b border-gray-200 pb-2 sm:border-0 sm:pb-0"
        >
          FILTERS
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden transition-transform ${showFilter ? "rotate-90" : ""}`}
            alt=""
          />
        </p>
        
        {/* Filter Container with Scroll */}
        <div className={`${showFilter ? "" : "hidden"} sm:block max-h-[70vh] overflow-y-auto`}>
          {/* CATEGORY FILTER */}
          <div className="border border-gray-200 pl-5 py-4 mt-3 sm:mt-6 rounded-lg shadow-sm bg-white">
            <p className="mb-3 text-sm font-semibold text-black">CATEGORIES</p>
            <div className="flex flex-col gap-3 text-sm text-gray-700">
              {categories.map((cat) => (
                <p key={cat._id} className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={cat.name}
                    onChange={toggleCategory}
                    id={`category-${cat._id}`}
                  />
                  <label htmlFor={`category-${cat._id}`} className="cursor-pointer hover:text-black transition-colors">
                    {cat.name}
                  </label>
                </p>
              ))}
            </div>
          </div>

          {/* SUBCATEGORIES FILTER */}
          <div className="border border-gray-200 pl-5 py-4 my-3 sm:my-5 rounded-lg shadow-sm bg-white">
            <p className="mb-3 text-sm font-semibold text-black">TYPE</p>
            <div className="flex flex-col gap-3 text-sm text-gray-700 max-h-48 overflow-y-auto">
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
                    <label htmlFor={`subcategory-${sub._id}`} className="cursor-pointer hover:text-black transition-colors">
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
          className="w-full py-3 bg-black text-white rounded-lg mt-4 mb-6 sm:hidden font-medium hover:bg-gray-800 transition-colors"
        >
          Apply Filters
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 sm:mr-4">
        {/* SEARCH BAR */}
        <div className="mb-8">
          <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 hover:border-gray-400 transition-colors max-w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 outline-none bg-inherit text-sm text-gray-700 placeholder-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <img src={assets.search_icon} className="w-4 ml-2 opacity-60" alt="Search" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-base sm:text-2xl mb-8">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* PRODUCT SORT */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 text-sm px-4 py-2 rounded-lg w-full sm:w-auto bg-white hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* MAP PRODUCTS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6">
          {filterProducts.length > 0 ? (
            filterProducts.map((item, i) => (
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
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-gray-500">
              <div className="max-w-md mx-auto">
                <p className="text-lg mb-2">No products found matching your filters.</p>
                <p className="text-sm mb-6">Try adjusting your search criteria or clear filters to see all products.</p>
                <button 
                  onClick={() => {setCategory([]); setSubCategory([]);}} 
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
