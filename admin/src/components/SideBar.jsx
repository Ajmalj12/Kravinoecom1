import { NavLink } from "react-router-dom";
import { PlusCircle, Package, ShoppingBag, LayoutDashboard, Users, Image, Percent, Tags, FolderOpen, Ruler } from 'lucide-react';

const SideBar = () => {
  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/add", icon: <PlusCircle size={20} />, label: "Add Items" },
    { to: "/list", icon: <Package size={20} />, label: "List Items" },
    { to: "/order", icon: <ShoppingBag size={20} />, label: "Orders" },
    { to: "/users", icon: <Users size={20} />, label: "Users" },
    { to: "/banners", icon: <Image size={20} />, label: "Banners" },
    { to: "/content", icon: <LayoutDashboard size={20} />, label: "Content" },
    { to: "/categories", icon: <FolderOpen size={20} />, label: "Categories" },
    { to: "/sizes", icon: <Ruler size={20} />, label: "Sizes" },
    { to: "/discounts", icon: <Percent size={20} />, label: "Discounts" },
    { to: "/product-offers", icon: <Tags size={20} />, label: "Product Offers" },
  ];

  return (
    <div className="w-20 md:w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm fixed left-0 top-0 z-10">
      <div className="flex flex-col h-screen">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 hidden md:block">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1 hidden md:block">Store Management</p>
        </div>
        
        <nav className="flex-1 pt-4">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-4 py-3 mb-1 mx-2 rounded-lg
                transition-colors duration-150 ease-in-out
                ${isActive 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="flex items-center justify-center w-8">
                {item.icon}
              </span>
              <span className="ml-3 hidden md:block">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">A</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@store.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;