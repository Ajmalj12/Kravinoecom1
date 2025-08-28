import { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Upload, Tag, DollarSign, Check } from 'lucide-react';
import { ShopContext } from "../context/ShopContext";

const Add = ({ token }) => {
  const { categories, sizes: dbSizes } = useContext(ShopContext);
  
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizeCategory, setSizeCategory] = useState("clothing");

  // Set default category and subcategory when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
      if (categories[0].subCategories?.length > 0) {
        setSubCategory(categories[0].subCategories[0].name);
      }
    }
  }, [categories, category]);

  // Filter sizes based on selected size category
  const filteredSizes = dbSizes.filter(size => size.category === sizeCategory);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setSizes([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const ImageUpload = ({ id, image, setImage }) => (
    <label
      htmlFor={id}
      className="relative group cursor-pointer"
    >
      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden group-hover:border-gray-400 transition-colors">
        {!image ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-500">
            <Upload className="w-6 h-6 mb-2" />
            <span className="text-xs">Upload</span>
          </div>
        ) : (
          <img
            src={URL.createObjectURL(image)}
            className="w-full h-full object-cover"
            alt=""
          />
        )}
      </div>
      <input
        onChange={(e) => setImage(e.target.files[0])}
        type="file"
        id={id}
        className="hidden"
        accept="image/*"
      />
    </label>
  );

  const SizeButton = ({ size }) => (
    <button
      type="button"
      onClick={() =>
        setSizes((prev) =>
          prev.includes(size)
            ? prev.filter((item) => item !== size)
            : [...prev, size]
        )
      }
      className={`${
        sizes.includes(size)
          ? "bg-indigo-100 text-indigo-700 border-indigo-200"
          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
      } px-4 py-2 rounded-md border transition-colors`}
    >
      {size}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Product</h1>
      
      <form onSubmit={onSubmitHandler} className="space-y-8">
        {/* Image Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
          <div className="flex flex-wrap gap-4">
            <ImageUpload id="image1" image={image1} setImage={setImage1} />
            <ImageUpload id="image2" image={image2} setImage={setImage2} />
            <ImageUpload id="image3" image={image3} setImage={setImage3} />
            <ImageUpload id="image4" image={image4} setImage={setImage4} />
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    // Reset subcategory when category changes
                    const selectedCategory = categories.find(cat => cat.name === e.target.value);
                    if (selectedCategory?.subCategories?.length > 0) {
                      setSubCategory(selectedCategory.subCategories[0].name);
                    } else {
                      setSubCategory("");
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Sub Category</option>
                  {categories
                    .find(cat => cat.name === category)
                    ?.subCategories?.map((sub) => (
                      <option key={sub._id} value={sub.name}>{sub.name}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sizes and Options */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sizes and Options</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size Category
              </label>
              <select
                value={sizeCategory}
                onChange={(e) => {
                  setSizeCategory(e.target.value);
                  setSizes([]); // Clear selected sizes when category changes
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="clothing">Clothing</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes ({sizeCategory})
              </label>
              <div className="flex flex-wrap gap-2">
                {filteredSizes.map((sizeObj) => (
                  <SizeButton key={sizeObj._id} size={sizeObj.name} />
                ))}
              </div>
              {filteredSizes.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No sizes available for {sizeCategory} category. Please add sizes in the Size Management page.
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="bestseller"
                type="checkbox"
                checked={bestseller}
                onChange={(e) => setBestseller(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="bestseller" className="ml-2 block text-sm text-gray-900">
                Mark as bestseller
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;