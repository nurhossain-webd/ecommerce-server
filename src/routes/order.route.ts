import { Router } from "express";
import { orderService } from "../services/order/order.service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const orders = await orderService.getAllOrders();

  res.json({
    success: true,
    message: "Orders retrieved successfully",
    data: orders,
  });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const order = await orderService.getOrderById(id);

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

router.post("/", async (req, res) => {
  const data = req.body;

  const order = await orderService.createOrder(data);

  res.json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const order = await orderService.updateOrder(id, data);

  res.json({
    success: true,
    message: "Order updated successfully",
    data: order,
  });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const order = await orderService.deleteOrder(id);

  res.json({
    success: true,
    message: "Order deleted successfully",
    data: order,
  });
});

export default router;