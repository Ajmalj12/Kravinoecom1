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
import categoryRouter from "./routes/categoryRoute.js";
import sizeRouter from "./routes/sizeRoute.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import addressRouter from "./routes/addressRoute.js";
import { swaggerUi, specs } from "./swagger.js";

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
app.use("/api/wishlist", wishlistRouter);
app.use("/api/address", addressRouter);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Ecommerce API Documentation"
}));

app.get("/", (req, res) => {
  res.send("IT'S WORKING WOWWWW");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port} ❤️`);
});

// smimtiaz58
// YgDk3SE4kqmRIwjt
