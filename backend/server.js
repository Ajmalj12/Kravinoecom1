import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import bannerRouter from "./routes/bannerRoute.js";
import sectionRouter from "./routes/sectionRoute.js";
import pageContentRouter from "./routes/pageContentRoute.js";
import discountRouter from "./routes/discountRoute.js";

//App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
//Middlewares
app.use(express.json());
app.use(cors());

//API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/section", sectionRouter);
app.use("/api/page", pageContentRouter);
app.use("/api/discount", discountRouter);

app.get("/", (req, res) => {
  res.send("IT'S WORKING WOWWWW");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port} ❤️`);
});

// smimtiaz58
// YgDk3SE4kqmRIwjt
