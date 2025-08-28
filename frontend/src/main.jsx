import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ShopContextProvider from "./context/ShopContext";
import WishlistContextProvider from "./context/WishlistContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShopContextProvider>
      <WishlistContextProvider>
        <App />
      </WishlistContextProvider>
    </ShopContextProvider>
  </BrowserRouter>
);
