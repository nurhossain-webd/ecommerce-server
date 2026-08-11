import { Router } from 'express';
import { categoryService } from '../services/category/category.service.js';
import { auth } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { idParamsSchema } from "../validations/common.validation.js";
import {
    createCategorySchema,
    updateCategorySchema,
} from "../validations/category.validation.js";

const router = Router();

router.get('/', async (req, res) => {
const categories = await categoryService.getAllCategories();
res.json({
    success: true,
    message: "Categories retrieved successfully",
    data: categories
});
});

router.get('/:id', validateRequest({ params: idParamsSchema }), async (req, res) => {
    const id = req.params.id as string;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    res.json({
        success: true,
        message: "Category retrieved successfully",
        data: category
    });
});

router.post('/', auth, authorize("ADMIN"), validateRequest({ body: createCategorySchema }), async (req, res) => {
    const data = req.body;
    const category = await categoryService.createCategory(data);
    res.json({
        success: true,
        message: "Category created successfully",
        data: category
    });
}); 

router.patch('/:id', auth, authorize("ADMIN"), validateRequest({ params: idParamsSchema, body: updateCategorySchema }), async (req, res) =>{
    const id = req.params.id as string;
    const data = req.body;
    const category = await categoryService.updateCategory(id, data);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    res.json({
        success: true,
        message: "Category updated successfully",
        data: category
    });
});

router.delete('/:id', auth, authorize("ADMIN"), validateRequest({ params: idParamsSchema }), async (req, res) => {
    const id = req.params.id as string;
    const category = await categoryService.deleteCategory(id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    res.json({
        success: true,
        message: "Category deleted successfully",
        data: category
    });
});

export default router;
