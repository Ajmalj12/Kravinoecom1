import express from "express";
import { listPageContent, upsertPageContent, uploadPageImage } from "../controllers/pageContentController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const pageContentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Page Content
 *   description: Website page content management
 */

/**
 * @swagger
 * /api/page-content/list:
 *   get:
 *     summary: Get all page content
 *     tags: [Page Content]
 *     responses:
 *       200:
 *         description: Page content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 pageContent:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PageContent'
 */
pageContentRouter.get("/list", listPageContent);

/**
 * @swagger
 * /api/page-content/upsert:
 *   post:
 *     summary: Create or update page content (Admin only)
 *     tags: [Page Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageType:
 *                 type: string
 *               content:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Page content upserted successfully
 */
pageContentRouter.post("/upsert", adminAuth, upsertPageContent);

/**
 * @swagger
 * /api/page-content/upload:
 *   post:
 *     summary: Upload page image (Admin only)
 *     tags: [Page Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
pageContentRouter.post("/upload", adminAuth, upload.fields([{ name: 'image', maxCount: 1 }]), uploadPageImage);

export default pageContentRouter;