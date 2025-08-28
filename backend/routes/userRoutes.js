import express from "express";
import {
  adminLogin,
  loginUser,
  registerUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserProfile,
  updateUserProfile
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.get("/all", getAllUsers);
userRouter.delete("/:userId", deleteUser);
userRouter.put("/:userId", updateUser);
userRouter.get("/profile", authUser, getUserProfile);
userRouter.put("/profile", authUser, updateUserProfile);

export default userRouter;
