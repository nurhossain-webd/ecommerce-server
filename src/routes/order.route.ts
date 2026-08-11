import { Router } from "express";
import { orderService } from "../services/order/order.service.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, async (req, res) => {
    const userId = req.user!.id;
  const orders = await orderService.getAllOrders(userId);

  res.json({
    success: true,
    message: "Orders retrieved successfully",
    data: orders,
  });
});

router.get("/:id", auth, async (req, res) => {
    const userId = req.user!.id;
  const id = req.params.id as string;

  const order = await orderService.getOrderById(id, userId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.json({
    success: true,
    message: "Order retrieved successfully",
    data: order,
  });
});

router.post("/", auth, async (req, res) => {
  const data = req.body;

  const order = await orderService.createOrder({
    ...data,
    userId: req.user!.id,
  });

  res.json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});
router.patch("/:id", auth, async (req, res) => {
  const id = req.params.id as string;
  const data = req.body;

  const order = await orderService.updateOrder(id, data);

  res.json({
    success: true,
    message: "Order updated successfully",
    data: order,
  });
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id as string;

  const order = await orderService.deleteOrder(id);

  res.json({
    success: true,
    message: "Order deleted successfully",
    data: order,
  });
});

export default router;