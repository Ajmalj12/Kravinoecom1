import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart } from "lucide-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    pageContent,
  } = useContext(ShopContext);

  const { getWishlistCount } = useWishlist();

  const siteName = pageContent?.global?.siteName || 'The Store';

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-4 px-4 md:px-8 bg-white shadow-lg font-medium fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
     
      {/* Company Name - Left Side */}
      <Link to={"/"} className="flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 hover:text-black transition-colors">{siteName}</h1>
      </Link>

      {/* Navigation Menu - Center (Hidden on mobile) */}
      <ul className="hidden lg:flex gap-8 text-sm text-gray-600 absolute left-1/2 transform -translate-x-1/2">
        <NavLink to="/" className="text-gray-600 hover:text-black transition-colors relative group no-underline" style={{color: 'inherit', textDecoration: 'none'}}>
          <p>HOME</p>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
        </NavLink>
        <NavLink to="/collection" className="text-gray-600 hover:text-black transition-colors relative group no-underline" style={{color: 'inherit', textDecoration: 'none'}}>
          <p>COLLECTION</p>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
        </NavLink>
        <NavLink to="/about" className="text-gray-600 hover:text-black transition-colors relative group no-underline" style={{color: 'inherit', textDecoration: 'none'}}>
          <p>ABOUT</p>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
        </NavLink>
        <NavLink to="/contact" className="text-gray-600 hover:text-black transition-colors relative group no-underline" style={{color: 'inherit', textDecoration: 'none'}}>
          <p>CONTACT</p>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
        </NavLink>
      </ul>

      {/* Right Side - Icons */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Profile Icon */}
        <div className="group relative">
          <img
            src={assets.profile_icon}
            className="w-4 md:w-5 cursor-pointer hover:opacity-80 transition-opacity"
            alt="Profile"
            onClick={() => (token ? null : navigate("/login"))}
          />
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
              <div className="flex flex-col gap-2 w-44 py-3 px-5 bg-white text-gray-700 rounded-lg shadow-xl border border-gray-200">
                <p onClick={() => navigate("/profile")} className="cursor-pointer hover:text-black transition-colors py-1">
                  Profile
                </p>
                
                <p onClick={() => navigate("/orders")} className="cursor-pointer hover:text-black transition-colors py-1">
                  Orders
                </p>
                <hr className="border-gray-200" />
                <p onClick={logout} className="cursor-pointer hover:text-red-600 transition-colors py-1 text-red-500">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Wishlist Icon */}
        <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
          <Heart className="w-4 md:w-5 text-gray-600 hover:text-black transition-colors" />
          {token && getWishlistCount() > 0 && (
            <span className="absolute right-0 top-0 w-4 h-4 text-center leading-4 bg-black text-white rounded-full text-[10px] font-medium">
              {getWishlistCount()}
            </span>
          )}
        </Link>

        {/* Cart Icon */}
        <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
          <img src={assets.cart_icon} className="w-4 md:w-5 min-w-4 md:min-w-5" alt="Cart" />
          <span className="absolute right-0 top-0 w-4 h-4 text-center leading-4 bg-black text-white rounded-full text-[10px] font-medium">
            {getCartCount()}
          </span>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          src={assets.menu_icon}
          className="w-5 cursor-pointer lg:hidden hover:opacity-80 transition-opacity"
          onClick={() => setVisible(true)}
          alt="Menu"
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-white transition-all duration-300 shadow-2xl ${
          visible ? "w-full sm:w-80" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600 h-full">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-200"
          >
            <div className="flex items-center gap-2">
              <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="Back" />
              <p className="font-medium text-gray-800">Back</p>
            </div>
            {token && (
              <div className="text-sm">
                <p onClick={() => {navigate("/profile"); setVisible(false);}} className="cursor-pointer hover:text-black px-3 py-1 transition-colors">
                  Profile
                </p>
              </div>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            <NavLink onClick={() => setVisible(false)} to={"/"} className="py-4 pl-6 border-b border-gray-200 flex items-center hover:bg-gray-100 transition-colors text-gray-600 no-underline" style={{color: 'inherit', textDecoration: 'none'}}>
              HOME
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to={"/collection"} className="py-4 pl-6 border-b border-gray-200 flex items-center hover:bg-gray-100 transition-colors text-gray-600 no-underline" style={{color: 'inherit', textDecoration: 'none'}}>
              COLLECTION
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to={"/about"} className="py-4 pl-6 border-b border-gray-200 flex items-center hover:bg-gray-100 transition-colors text-gray-600 no-underline" style={{color: 'inherit', textDecoration: 'none'}}>
              ABOUT
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to={"/contact"} className="py-4 pl-6 border-b border-gray-200 flex items-center hover:bg-gray-100 transition-colors text-gray-600 no-underline" style={{color: 'inherit', textDecoration: 'none'}}>
              CONTACT
            </NavLink>
            {token && (
              <>
                <NavLink onClick={() => setVisible(false)} to={"/wishlist"} className="py-4 pl-6 border-b border-gray-200 flex items-center hover:bg-gray-100 transition-colors text-gray-600 no-underline" style={{color: 'inherit', textDecoration: 'none'}}>
                  WISHLIST
                </NavLink>
                <NavLink onClick={() => setVisible(false)} to={"/address-management"} className="py-4 pl-6 border-b border-gray-200 flex items-center hover:bg-gray-100 transition-colors text-gray-600 no-underline" style={{color: 'inherit', textDecoration: 'none'}}>
                  MANAGE ADDRESSES
                </NavLink>
                <NavLink onClick={() => setVisible(false)} to={"/orders"} className="py-4 pl-6 border-b border-gray-200 flex items-center hover:bg-gray-100 transition-colors text-gray-600 no-underline" style={{color: 'inherit', textDecoration: 'none'}}>
                  ORDERS
                </NavLink>
              </>
            )}
          </div>
          {token && (
            <div className="mt-auto border-t border-gray-200 p-4">
              <button 
                onClick={() => {logout(); setVisible(false);}} 
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
