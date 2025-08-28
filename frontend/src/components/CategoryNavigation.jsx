import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { 
  Smartphone, 
  Laptop, 
  Shirt, 
  Headphones, 
  Home, 
  Car, 
  Plane, 
  ShoppingBag,
  Gift,
  Utensils,
  Package
} from 'lucide-react';

const CategoryNavigation = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(ShopContext);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayItems, setDisplayItems] = useState([]);

  // Icon mapping for categories
  const getIconForCategory = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('mobile') || name.includes('phone')) return Smartphone;
    if (name.includes('fashion') || name.includes('clothing')) return Shirt;
    if (name.includes('electronics') || name.includes('headphone')) return Headphones;
    if (name.includes('home') || name.includes('furniture')) return Home;
    if (name.includes('laptop') || name.includes('computer')) return Laptop;
    if (name.includes('beauty') || name.includes('cosmetic')) return Gift;
    if (name.includes('grocery') || name.includes('food')) return Utensils;
    if (name.includes('bag') || name.includes('shopping')) return ShoppingBag;
    return Package; // Default icon
  };

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const categoryResponse = await axios.get(`${backendUrl}/api/category/list`);
        let allItems = [];
        
        if (categoryResponse.data.success) {
          const categories = categoryResponse.data.categories;
          
          // Process each category and its subcategories
          categories.forEach(category => {
            // Add main category
            allItems.push({
              name: category.name,
              icon: getIconForCategory(category.name),
              path: `/collection?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`,
              type: 'category'
            });
            
            // Add subcategories if they exist
            if (category.subCategories && category.subCategories.length > 0) {
              category.subCategories.forEach(subcat => {
                allItems.push({
                  name: subcat.name,
                  icon: getIconForCategory(subcat.name),
                  path: `/collection?subcategory=${subcat.name.toLowerCase().replace(/\s+/g, '-')}`,
                  type: 'subcategory',
                  parentCategory: category.name
                });
              });
            }
          });
          
          // Limit to 8 items total
          setDisplayItems(allItems.slice(0, 8));
          setCategories(categories);
        }
        
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if API fails
        const fallbackData = [
          { name: 'Fashion', icon: Shirt, path: '/collection?category=fashion', type: 'category' },
          { name: 'Electronics', icon: Headphones, path: '/collection?category=electronics', type: 'category' },
          { name: 'Home & Furniture', icon: Home, path: '/collection?category=home', type: 'category' },
          { name: 'Beauty', icon: Gift, path: '/collection?category=beauty', type: 'category' },
        ];
        setDisplayItems(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl) {
      fetchCategoriesAndSubcategories();
    }
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex flex-col items-center min-w-[80px] p-2">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-3 bg-gray-200 rounded mt-1 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full">
        <div className="flex items-center justify-start py-3 overflow-x-auto w-full px-4">
          {displayItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={`${item.type}-${index}`}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center flex-1 min-w-[100px] p-2 cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                  <IconComponent size={24} className="text-gray-600" />
                </div>
                <span className="text-xs text-black mt-2 text-center leading-tight font-medium">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;
