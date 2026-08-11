import { Router } from "express";
import { productService } from "../services/product/product.service.js";
import { auth } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { idParamsSchema } from "../validations/common.validation.js";
import {
    createProductSchema,
    updateProductSchema,
} from "../validations/product.validation.js";

const router = Router();

router.get("/", async(req, res) => {
    const products = await productService.getAllProducts();
    res.json({
        success: true,
        message: "Products retrieved successfully",
        data: products
    });
});

router.get("/:id", validateRequest({ params: idParamsSchema }), async(req, res) => {
    const id = req.params.id as string;
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

router.post("/", auth, authorize("ADMIN"), validateRequest({ body: createProductSchema }), async(req, res) => {
    const data = req.body;
    const product = await productService.createProduct(data);
    res.json({
        success: true,
        message: "Product created successfully",
        data: product
    });
});

router.patch("/:id", auth, authorize("ADMIN"), validateRequest({ params: idParamsSchema, body: updateProductSchema }), async(req, res) => {
    const id = req.params.id as string;
    const data = req.body;
    const product = await productService.updateProduct(id, data);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        message: "Product updated successfully",
        data: product
    });
});

router.delete("/:id", auth, authorize("ADMIN"), validateRequest({ params: idParamsSchema }), async(req, res) => {
    const id = req.params.id as string;
    const product = await productService.deleteProduct(id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        message: "Product deleted successfully",
        data: product
    });
});
export default router;
