import express from "express";
import { addAddress, getUserAddresses, updateAddress, deleteAddress, setDefaultAddress, getAddress } from "../controllers/addressController.js";
import authUser from "../middleware/auth.js";

const addressRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: User address management
 */

/**
 * @swagger
 * /api/address/add:
 *   post:
 *     summary: Add new address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipcode:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address added successfully
 */
addressRouter.post('/add', authUser, addAddress);

/**
 * @swagger
 * /api/address/list:
 *   post:
 *     summary: Get all user addresses
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 addresses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 */
addressRouter.post('/list', authUser, getUserAddresses);

/**
 * @swagger
 * /api/address/update:
 *   post:
 *     summary: Update existing address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipcode:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
addressRouter.post('/update', authUser, updateAddress);

/**
 * @swagger
 * /api/address/delete:
 *   post:
 *     summary: Delete address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */
addressRouter.post('/delete', authUser, deleteAddress);

/**
 * @swagger
 * /api/address/set-default:
 *   post:
 *     summary: Set address as default
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Default address set successfully
 */
addressRouter.post('/set-default', authUser, setDefaultAddress);

/**
 * @swagger
 * /api/address/get:
 *   post:
 *     summary: Get single address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 address:
 *                   $ref: '#/components/schemas/Address'
 */
addressRouter.post('/get', authUser, getAddress);

export default addressRouter;
