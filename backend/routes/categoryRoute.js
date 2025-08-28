import express from 'express';
import { 
    getCategories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addSubCategory, 
    removeSubCategory,
    seedCategories 
} from '../controllers/categoryController.js';
import adminAuth from '../middleware/adminAuth.js';

const categoryRouter = express.Router();

// Public routes
categoryRouter.get('/list', getCategories);

// Admin routes
categoryRouter.post('/add', adminAuth, addCategory);
categoryRouter.post('/update', adminAuth, updateCategory);
categoryRouter.post('/remove', adminAuth, deleteCategory);
categoryRouter.post('/add-subcategory', adminAuth, addSubCategory);
categoryRouter.post('/remove-subcategory', adminAuth, removeSubCategory);
categoryRouter.post('/seed', adminAuth, seedCategories);

export default categoryRouter;
