import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist
} from "../controllers/wishlistController.js";
import authUser from "../middleware/auth.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/", authUser, getWishlist);
wishlistRouter.post("/add", authUser, addToWishlist);
wishlistRouter.post("/remove", authUser, removeFromWishlist);
wishlistRouter.get("/check/:productId", authUser, isInWishlist);
wishlistRouter.delete("/clear", authUser, clearWishlist);

export default wishlistRouter;
