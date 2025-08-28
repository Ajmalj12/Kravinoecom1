import express from "express";
import { addAddress, getUserAddresses, updateAddress, deleteAddress, setDefaultAddress, getAddress } from "../controllers/addressController.js";
import authUser from "../middleware/auth.js";

const addressRouter = express.Router();

// Add new address
addressRouter.post('/add', authUser, addAddress);

// Get all user addresses
addressRouter.post('/list', authUser, getUserAddresses);

// Update address
addressRouter.post('/update', authUser, updateAddress);

// Delete address
addressRouter.post('/delete', authUser, deleteAddress);

// Set default address
addressRouter.post('/set-default', authUser, setDefaultAddress);

// Get single address
addressRouter.post('/get', authUser, getAddress);

export default addressRouter;
