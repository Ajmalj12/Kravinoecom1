import express from 'express';
import { 
    getSizes, 
    addSize, 
    updateSize, 
    deleteSize, 
    seedSizes 
} from '../controllers/sizeController.js';
import adminAuth from '../middleware/adminAuth.js';

const sizeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sizes
 *   description: Product size management
 */

/**
 * @swagger
 * /api/size/list:
 *   get:
 *     summary: Get all sizes
 *     tags: [Sizes]
 *     responses:
 *       200:
 *         description: Sizes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 sizes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Size'
 */
sizeRouter.get('/list', getSizes);

/**
 * @swagger
 * /api/size/add:
 *   post:
 *     summary: Add new size (Admin only)
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Size added successfully
 */
sizeRouter.post('/add', adminAuth, addSize);

/**
 * @swagger
 * /api/size/update:
 *   post:
 *     summary: Update existing size (Admin only)
 *     tags: [Sizes]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Size updated successfully
 */
sizeRouter.post('/update', adminAuth, updateSize);

/**
 * @swagger
 * /api/size/remove:
 *   post:
 *     summary: Delete size (Admin only)
 *     tags: [Sizes]
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
 *         description: Size deleted successfully
 */
sizeRouter.post('/remove', adminAuth, deleteSize);

/**
 * @swagger
 * /api/size/seed:
 *   post:
 *     summary: Seed default sizes (Admin only)
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sizes seeded successfully
 */
sizeRouter.post('/seed', adminAuth, seedSizes);

export default sizeRouter;
