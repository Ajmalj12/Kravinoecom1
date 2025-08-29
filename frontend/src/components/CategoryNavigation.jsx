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
        setLoading(true);
        const categoryResponse = await axios.get(`${backendUrl}/api/category/list`);
        let allItems = [];
        
        if (categoryResponse.data.success) {
          const categories = categoryResponse.data.categories;
          
          // Process each category and its subcategories
          categories.forEach(category => {
            // Only add category if it should be shown in navigation
            if (category.showInNavigation !== false) {
              allItems.push({
                name: category.name,
                icon: getIconForCategory(category.name),
                image: category.image || null,
                path: `/collection?category=${encodeURIComponent(category.name)}`,
                type: 'category',
                id: `category-${category._id || category.name}`
              });
            }
            
            // Add subcategories if they exist and should be shown
            if (category.subCategories && category.subCategories.length > 0) {
              category.subCategories.forEach(subcat => {
                if (subcat.showInNavigation !== false) {
                  allItems.push({
                    name: subcat.name,
                    icon: getIconForCategory(subcat.name),
                    image: subcat.image || null,
                    path: `/collection?subcategory=${encodeURIComponent(subcat.name)}`,
                    type: 'subcategory',
                    parentCategory: category.name,
                    id: `subcategory-${subcat._id || subcat.name}`
                  });
                }
              });
            }
          });
          
          // Use setTimeout to ensure state updates properly
          setTimeout(() => {
            setDisplayItems(allItems);
            setCategories(categories);
            setLoading(false);
          }, 100);
        } else {
          setLoading(false);
        }
        
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if API fails
        const fallbackData = [
          { name: 'Fashion', icon: Shirt, path: '/collection?category=fashion', type: 'category', id: 'fallback-fashion' },
          { name: 'Electronics', icon: Headphones, path: '/collection?category=electronics', type: 'category', id: 'fallback-electronics' },
          { name: 'Home & Furniture', icon: Home, path: '/collection?category=home', type: 'category', id: 'fallback-home' },
          { name: 'Beauty', icon: Gift, path: '/collection?category=beauty', type: 'category', id: 'fallback-beauty' },
        ];
        setTimeout(() => {
          setDisplayItems(fallbackData);
          setLoading(false);
        }, 100);
      }
    };

    if (backendUrl) {
      fetchCategoriesAndSubcategories();
    } else {
      setLoading(false);
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
    <div className="bg-white shadow-lg border-b border-gray-100 relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 relative z-50">
        <div className="flex items-center justify-start sm:justify-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide relative z-50 pb-1" 
             style={{ 
               scrollbarWidth: 'none', 
               msOverflowStyle: 'none',
               WebkitOverflowScrolling: 'touch'
             }}>
          {displayItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.id || `${item.type}-${index}`}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Category clicked:', item.name, 'Path:', item.path);
                  window.location.href = item.path;
                }}
                className="flex flex-col items-center min-w-[75px] max-w-[75px] sm:min-w-[90px] sm:max-w-[90px] p-1.5 sm:p-2 cursor-pointer hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 transition-all duration-300 group flex-shrink-0 rounded-xl hover:shadow-md transform hover:-translate-y-1 active:scale-95 no-underline relative z-50"
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 9999,
                  pointerEvents: 'auto'
                }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-full group-hover:from-blue-50 group-hover:to-blue-100 group-hover:shadow-lg transition-all duration-300 overflow-hidden border-2 border-gray-100 group-hover:border-blue-200 relative z-50">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover rounded-full relative z-50"
                      draggable={false}
                      style={{ pointerEvents: 'none' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <IconComponent 
                    size={window.innerWidth < 640 ? 20 : 26} 
                    className={`text-gray-600 group-hover:text-blue-600 transition-colors duration-300 relative z-50 ${item.image ? 'hidden' : 'block'}`}
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
                <span className="text-xs sm:text-xs text-gray-700 mt-1 sm:mt-2 text-center font-medium group-hover:text-gray-900 transition-colors duration-300 max-w-full truncate whitespace-nowrap overflow-hidden relative z-50" style={{ pointerEvents: 'none' }}>
                  {item.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;
