import express from 'express';
import { 
    getCategories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addSubCategory, 
    removeSubCategory,
    seedCategories,
    uploadCategoryImage,
    uploadSubcategoryImage,
    toggleCategoryVisibility,
    toggleSubcategoryVisibility
} from '../controllers/categoryController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';

const categoryRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Product category management
 */

/**
 * @swagger
 * /api/category/list:
 *   get:
 *     summary: Get all categories with subcategories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
categoryRouter.get('/list', getCategories);

/**
 * @swagger
 * /api/category/add:
 *   post:
 *     summary: Add new category (Admin only)
 *     tags: [Categories]
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
 *               image:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category added successfully
 */
categoryRouter.post('/add', adminAuth, addCategory);

/**
 * @swagger
 * /api/category/update:
 *   post:
 *     summary: Update existing category (Admin only)
 *     tags: [Categories]
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
 *               image:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
categoryRouter.post('/update', adminAuth, updateCategory);

/**
 * @swagger
 * /api/category/remove:
 *   post:
 *     summary: Delete category (Admin only)
 *     tags: [Categories]
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
 *         description: Category deleted successfully
 */
categoryRouter.post('/remove', adminAuth, deleteCategory);

/**
 * @swagger
 * /api/category/add-subcategory:
 *   post:
 *     summary: Add subcategory to existing category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subcategory added successfully
 */
categoryRouter.post('/add-subcategory', adminAuth, addSubCategory);

/**
 * @swagger
 * /api/category/remove-subcategory:
 *   post:
 *     summary: Remove subcategory from category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               subCategoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subcategory removed successfully
 */
categoryRouter.post('/remove-subcategory', adminAuth, removeSubCategory);

/**
 * @swagger
 * /api/category/seed:
 *   post:
 *     summary: Seed default categories (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories seeded successfully
 */
categoryRouter.post('/seed', adminAuth, seedCategories);

/**
 * @swagger
 * /api/category/{categoryId}/upload-image:
 *   post:
 *     summary: Upload image for category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Category image uploaded successfully
 */
categoryRouter.post('/:categoryId/upload-image', upload.single('image'), adminAuth, uploadCategoryImage);

/**
 * @swagger
 * /api/category/{categoryId}/subcategory/{subcategoryId}/upload-image:
 *   post:
 *     summary: Upload image for subcategory (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: subcategoryId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Subcategory image uploaded successfully
 */
categoryRouter.post('/:categoryId/subcategory/:subcategoryId/upload-image', upload.single('image'), adminAuth, uploadSubcategoryImage);

/**
 * @swagger
 * /api/category/toggle-visibility:
 *   post:
 *     summary: Toggle category visibility in navigation (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               showInNavigation:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category visibility updated successfully
 */
categoryRouter.post('/toggle-visibility', adminAuth, toggleCategoryVisibility);

/**
 * @swagger
 * /api/category/toggle-subcategory-visibility:
 *   post:
 *     summary: Toggle subcategory visibility in navigation (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               subcategoryId:
 *                 type: string
 *               showInNavigation:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Subcategory visibility updated successfully
 */
categoryRouter.post('/toggle-subcategory-visibility', adminAuth, toggleSubcategoryVisibility);

export default categoryRouter;
