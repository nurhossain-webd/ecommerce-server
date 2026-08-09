import express from 'express';
import userRouter from "./routes/user.route.js";

const app = express();
app.use(express.json());

app.get('/',(req, res) => {
    res.json({
        success: true,
        message: 'Server is running'
    })
})

app.use("/api/users", userRouter);

export default app;