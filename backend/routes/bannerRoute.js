import express from "express";
import { addBanner, listBanners, removeBanner, updateBanner } from "../controllers/bannerController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const bannerRouter = express.Router();

bannerRouter.get("/list", listBanners);

bannerRouter.post(
  "/add",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  addBanner
);

bannerRouter.post(
  "/update",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateBanner
);

bannerRouter.post("/remove", adminAuth, removeBanner);

export default bannerRouter; 