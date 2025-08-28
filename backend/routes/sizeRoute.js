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

// Public routes
sizeRouter.get('/list', getSizes);

// Admin routes
sizeRouter.post('/add', adminAuth, addSize);
sizeRouter.post('/update', adminAuth, updateSize);
sizeRouter.post('/remove', adminAuth, deleteSize);
sizeRouter.post('/seed', adminAuth, seedSizes);

export default sizeRouter;
