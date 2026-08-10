import { Router } from "express";
import { productService } from "../services/product/product.service.js";

const router = Router();

router.get("/", async(req, res) => {
    const products = await productService.getAllProducts();
    res.json({
        success: true,
        message: "Products retrieved successfully",
        data: products
    });
});

router.get("/:id", async(req, res) => {
    const id = req.params.id;
    const product = await productService.getProductById(id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        message: "Product retrieved successfully",
        data: product
    });
});

router.post("/", async(req, res) => {
    const data = req.body;
    const product = await productService.createProduct(data);
    res.json({
        success: true,
        message: "Product created successfully",
        data: product
    });
});

router.patch("/:id", async(req, res) => {
    const id = req.params.id;
    const data = req.body;
    const product = await productService.updateProduct(id, data);

    res.json({
        success: true,
        message: "Product updated successfully",
        data: product
    });
});

router.delete("/:id", async(req, res) => {
    const id = req.params.id;
    const product = await productService.deleteProduct(id);

    res.json({
        success: true,
        message: "Product deleted successfully",
        data: product
    });
});
export default router;