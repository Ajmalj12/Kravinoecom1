import express from "express";
import { addBanner, listBanners, removeBanner, updateBanner, updateImageOrder, removeImage, addImages } from "../controllers/bannerController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const bannerRouter = express.Router();

bannerRouter.get("/list", listBanners);

bannerRouter.post(
  "/add",
  adminAuth,
  upload.fields([{ name: "images", maxCount: 10 }]),
  addBanner
);

bannerRouter.post(
  "/update",
  adminAuth,
  upload.fields([{ name: "images", maxCount: 10 }]),
  updateBanner
);

bannerRouter.post("/update-order", adminAuth, updateImageOrder);
bannerRouter.post("/remove-image", adminAuth, removeImage);
bannerRouter.post(
  "/add-images",
  adminAuth,
  upload.fields([{ name: "images", maxCount: 10 }]),
  addImages
);

bannerRouter.post("/remove", adminAuth, removeBanner);

export default bannerRouter;