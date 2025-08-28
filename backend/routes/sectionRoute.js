import express from "express";
import { listSections, upsertSection, reorderSections } from "../controllers/sectionController.js";
import adminAuth from "../middleware/adminAuth.js";

const sectionRouter = express.Router();

sectionRouter.get("/list", listSections);
sectionRouter.post("/upsert", adminAuth, upsertSection);
sectionRouter.post("/reorder", adminAuth, reorderSections);

export default sectionRouter; 