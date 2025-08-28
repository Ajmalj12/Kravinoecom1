import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    pageContent,
  } = useContext(ShopContext);

  const siteName = pageContent?.global?.siteName || 'The Store';

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-3 md:py-5 px-4 md:px-6 bg-white shadow-md font-medium fixed top-0 left-0 right-0 z-50">
     
      <Link to={"/"}>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{siteName}</h1>
      </Link>

      <ul className="hidden md:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1 hover:text-black transition-colors">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1 hover:text-black transition-colors">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1 hover:text-black transition-colors">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1 hover:text-black transition-colors">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-3 md:gap-6">
        <img
          src={assets.search_icon}
          className="w-4 md:w-5 cursor-pointer"
          onClick={() => setShowSearch(true)}
          alt="Search"
        />
        <div className="group relative">
          <img
            src={assets.profile_icon}
            className="w-4 md:w-5 cursor-pointer"
            alt="Profile"
            onClick={() => (token ? null : navigate("/login"))}
          />
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-md">
                
                <p onClick={() => navigate("/profile")} className="cursor-pointer hover:text-black transition-colors">
                  Profile
                </p>
                <p onClick={() => navigate("/orders")} className="cursor-pointer hover:text-black transition-colors">
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black transition-colors">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-4 md:w-5 min-w-4 md:min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          src={assets.menu_icon}
          className="w-5 cursor-pointer md:hidden"
          onClick={() => setVisible(true)}
          alt="Menu"
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-white transition-all duration-300 shadow-xl ${
          visible ? "w-full sm:w-80" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600 h-full">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center justify-between p-4 cursor-pointer border-b"
          >
            <div className="flex items-center gap-2">
              <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="Back" />
              <p className="font-medium">Back</p>
            </div>
            {token && (
              <div className="text-sm">
                <p onClick={() => {navigate("/profile"); setVisible(false);}} className="cursor-pointer hover:text-black px-3 py-1">
                  Profile
                </p>
              </div>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            <NavLink onClick={() => setVisible(false)} to={"/"} className="py-3 pl-6 border-b flex items-center hover:bg-gray-50">
              HOME
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to={"/collection"} className="py-3 pl-6 border-b flex items-center hover:bg-gray-50">
              COLLECTION
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to={"/about"} className="py-3 pl-6 border-b flex items-center hover:bg-gray-50">
              ABOUT
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to={"/contact"} className="py-3 pl-6 border-b flex items-center hover:bg-gray-50">
              CONTACT
            </NavLink>
            {token && (
              <NavLink onClick={() => setVisible(false)} to={"/orders"} className="py-3 pl-6 border-b flex items-center hover:bg-gray-50">
                ORDERS
              </NavLink>
            )}
          </div>
          {token && (
            <div className="mt-auto border-t p-4">
              <button 
                onClick={() => {logout(); setVisible(false);}} 
                className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
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
