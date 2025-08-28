import express from "express";
import { listPageContent, upsertPageContent, uploadPageImage } from "../controllers/pageContentController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const pageContentRouter = express.Router();

pageContentRouter.get("/list", listPageContent);
pageContentRouter.post("/upsert", adminAuth, upsertPageContent);
pageContentRouter.post("/upload", adminAuth, upload.fields([{ name: 'image', maxCount: 1 }]), uploadPageImage);

export default pageContentRouter; 