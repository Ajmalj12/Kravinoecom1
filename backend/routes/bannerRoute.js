import express from "express";
import { addBanner, listBanners, removeBanner, updateBanner, updateImageOrder, removeImage, addImages } from "../controllers/bannerController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const bannerRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management for hero sections and promotional content
 */

/**
 * @swagger
 * /api/banner/list:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Banners retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 banners:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 */
bannerRouter.get("/list", listBanners);

/**
 * @swagger
 * /api/banner/add:
 *   post:
 *     summary: Add new banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               link:
 *                 type: string
 *               section:
 *                 type: string
 *                 enum: [hero, top, middle]
 *               active:
 *                 type: boolean
 *               order:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Banner added successfully
 */
bannerRouter.post(
  "/add",
  adminAuth,
  upload.fields([{ name: "images", maxCount: 10 }]),
  addBanner
);

/**
 * @swagger
 * /api/banner/update:
 *   post:
 *     summary: Update existing banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               link:
 *                 type: string
 *               section:
 *                 type: string
 *               active:
 *                 type: boolean
 *               order:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Banner updated successfully
 */
bannerRouter.post(
  "/update",
  adminAuth,
  upload.fields([{ name: "images", maxCount: 10 }]),
  updateBanner
);

/**
 * @swagger
 * /api/banner/remove:
 *   post:
 *     summary: Remove banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Banner removed successfully
 */
bannerRouter.post("/remove", adminAuth, removeBanner);

bannerRouter.post("/update-order", adminAuth, updateImageOrder);
bannerRouter.post("/remove-image", adminAuth, removeImage);
bannerRouter.post(
  "/add-images",
  adminAuth,
  upload.fields([{ name: "images", maxCount: 10 }]),
  addImages
);

export default bannerRouter;