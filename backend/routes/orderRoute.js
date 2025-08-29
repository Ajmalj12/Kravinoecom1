import express from "express";
import {
  allOrders,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateStatus,
  userOrders,
  verifyStripe,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and payment processing
 */

/**
 * @swagger
 * /api/order/place:
 *   post:
 *     summary: Place a new order (Cash on Delivery)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *               amount:
 *                 type: number
 *               address:
 *                 type: object
 *     responses:
 *       200:
 *         description: Order placed successfully
 */
orderRouter.post("/place", authUser, placeOrder);

/**
 * @swagger
 * /api/order/stripe:
 *   post:
 *     summary: Place order with Stripe payment
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *               amount:
 *                 type: number
 *               address:
 *                 type: object
 *     responses:
 *       200:
 *         description: Stripe payment session created
 */
orderRouter.post("/stripe", authUser, placeOrderStripe);

/**
 * @swagger
 * /api/order/razorpay:
 *   post:
 *     summary: Place order with Razorpay payment
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *               amount:
 *                 type: number
 *               address:
 *                 type: object
 *     responses:
 *       200:
 *         description: Razorpay order created
 */
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

/**
 * @swagger
 * /api/order/userorders:
 *   post:
 *     summary: Get user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User orders retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
orderRouter.post("/userorders", authUser, userOrders);

/**
 * @swagger
 * /api/order/verifystripe:
 *   post:
 *     summary: Verify Stripe payment
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               success:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Payment verification result
 */
orderRouter.post("/verifystripe", authUser, verifyStripe);

/**
 * @swagger
 * /api/order/list:
 *   post:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
orderRouter.post("/list", adminAuth, allOrders);

/**
 * @swagger
 * /api/order/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved
 */
orderRouter.get("/all", adminAuth, allOrders);

/**
 * @swagger
 * /api/order/status:
 *   post:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Order Placed, Packing, Shipped, Out for delivery, Delivered]
 *     responses:
 *       200:
 *         description: Order status updated
 */
orderRouter.post("/status", adminAuth, updateStatus);

export default orderRouter;
