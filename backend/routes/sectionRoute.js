import express from "express";
import { listSections, upsertSection, reorderSections } from "../controllers/sectionController.js";
import adminAuth from "../middleware/adminAuth.js";

const sectionRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sections
 *   description: Website section management
 */

/**
 * @swagger
 * /api/section/list:
 *   get:
 *     summary: Get all website sections
 *     tags: [Sections]
 *     responses:
 *       200:
 *         description: Sections retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 sections:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Section'
 */
sectionRouter.get("/list", listSections);

/**
 * @swagger
 * /api/section/upsert:
 *   post:
 *     summary: Create or update section (Admin only)
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sectionType:
 *                 type: string
 *               content:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Section upserted successfully
 */
sectionRouter.post("/upsert", adminAuth, upsertSection);

/**
 * @swagger
 * /api/section/reorder:
 *   post:
 *     summary: Reorder sections (Admin only)
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sectionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Sections reordered successfully
 */
sectionRouter.post("/reorder", adminAuth, reorderSections);

export default sectionRouter;