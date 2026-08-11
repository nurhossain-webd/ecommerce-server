import express from 'express';
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import reviewRouter from "./routes/review.route.js";
import orderRouter from "./routes/order.route.js";
import authRouter from "./routes/auth.route.js";
const app = express();
app.use(express.json());

app.get('/',(req, res) => {
    res.json({
        success: true,
        message: 'Server is running'
    })
})

app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);
app.use("/api/auth", authRouter);

export default app;