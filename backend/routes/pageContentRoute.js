import express from "express";
import { listPageContent, upsertPageContent } from "../controllers/pageContentController.js";
import adminAuth from "../middleware/adminAuth.js";

const pageContentRouter = express.Router();

pageContentRouter.get("/list", listPageContent);
pageContentRouter.post("/upsert", adminAuth, upsertPageContent);

export default pageContentRouter; 