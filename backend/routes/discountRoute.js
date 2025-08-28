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

// Admin routes
discountRouter.post('/add', adminAuth, createDiscount);
discountRouter.post('/remove', adminAuth, removeDiscount);
discountRouter.post('/update', adminAuth, updateDiscount);
discountRouter.get('/list', adminAuth, listDiscounts);
discountRouter.post('/add-product', adminAuth, addProductToDiscount);
discountRouter.post('/remove-product', adminAuth, removeProductFromDiscount);

// Public routes
discountRouter.get('/active', getActiveDiscounts);
discountRouter.get('/homepage', getHomePageDiscounts);


export default discountRouter;
