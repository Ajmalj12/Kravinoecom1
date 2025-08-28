import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import bannerRouter from "./routes/bannerRoutes.js";
import sectionRouter from "./routes/sectionRoutes.js";
import pageContentRouter from "./routes/pageContentRoutes.js";
import discountRouter from "./routes/discountRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import sizeRouter from "./routes/sizeRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";

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
app.use("/api/category", categoryRouter);
app.use("/api/size", sizeRouter);

app.get("/", (req, res) => {
  res.send("IT'S WORKING WOWWWW");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port} ❤️`);
});

// smimtiaz58
// YgDk3SE4kqmRIwjt
