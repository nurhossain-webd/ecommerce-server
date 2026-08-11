import { Router } from "express";
import { authService } from "../services/auth/auth.service.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { loginSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/login", validateRequest({ body: loginSchema }), async (req, res) => {
  const data = req.body;

  const user = await authService.loginUser(data);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  res.json({
    success: true,
    message: "Login successful",
    data: user,
  });
});

export default router;
