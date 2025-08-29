import express from 'express';
import { 
  createDiscount, 
  listDiscounts, 
  removeDiscount, 
  updateDiscount, 
  getActiveDiscounts, 
  getHomePageDiscounts, 
  addProductToDiscount, 
  removeProductFromDiscount 
} from '../controllers/discountController.js';
import adminAuth from '../middleware/adminAuth.js';
import auth from '../middleware/auth.js';

const discountRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: Discount management
 */

/**
 * @swagger
 * /api/discount/add:
 *   post:
 *     summary: Create new discount (Admin only)
 *     tags: [Discounts]
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
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discountValue:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Discount created successfully
 */
discountRouter.post('/add', adminAuth, createDiscount);

/**
 * @swagger
 * /api/discount/remove:
 *   post:
 *     summary: Remove discount (Admin only)
 *     tags: [Discounts]
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
 *         description: Discount removed successfully
 */
discountRouter.post('/remove', adminAuth, removeDiscount);

/**
 * @swagger
 * /api/discount/update:
 *   post:
 *     summary: Update existing discount (Admin only)
 *     tags: [Discounts]
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
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discountValue:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Discount updated successfully
 */
discountRouter.post('/update', adminAuth, updateDiscount);

/**
 * @swagger
 * /api/discount/list:
 *   get:
 *     summary: Get all discounts (Admin only)
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Discounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 discounts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Discount'
 */
discountRouter.get('/list', adminAuth, listDiscounts);

/**
 * @swagger
 * /api/discount/add-product:
 *   post:
 *     summary: Add product to discount (Admin only)
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discountId:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to discount successfully
 */
discountRouter.post('/add-product', adminAuth, addProductToDiscount);

/**
 * @swagger
 * /api/discount/remove-product:
 *   post:
 *     summary: Remove product from discount (Admin only)
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discountId:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product removed from discount successfully
 */
discountRouter.post('/remove-product', adminAuth, removeProductFromDiscount);

/**
 * @swagger
 * /api/discount/active:
 *   get:
 *     summary: Get active discounts
 *     tags: [Discounts]
 *     responses:
 *       200:
 *         description: Active discounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 discounts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Discount'
 */
discountRouter.get('/active', getActiveDiscounts);

/**
 * @swagger
 * /api/discount/homepage:
 *   get:
 *     summary: Get homepage discounts
 *     tags: [Discounts]
 *     responses:
 *       200:
 *         description: Homepage discounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 discounts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Discount'
 */
discountRouter.get('/homepage', getHomePageDiscounts);


export default discountRouter;
