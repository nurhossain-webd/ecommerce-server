import { Router } from "express";
import { authService } from "../services/auth/auth.service.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { loginSchema } from "../validations/auth.validation.js";
import { createUserSchema } from "../validations/user.validation.js";
import { userService } from "../services/user/user.service.js";

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

router.post("/register", validateRequest({ body: createUserSchema }), async (req, res) => {
  await userService.createUser(req.body);
  const session = await authService.loginUser({
    email: req.body.email,
    password: req.body.password,
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: session,
  });
});

export default router;
