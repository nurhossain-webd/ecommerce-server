import { Router } from 'express';
import { categoryService } from '../services/category/category.service.js';

const router = Router();

router.get('/', async (req, res) => {
const categories = await categoryService.getAllCategories();
res.json({
    success: true,
    message: "Categories retrieved successfully",
    data: categories
});
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
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

router.post('/', async (req, res) => {
    const data = req.body;
    const category = await categoryService.createCategory(data);
    res.json({
        success: true,
        message: "Category created successfully",
        data: category
    });
}); 

router.patch('/:id', async (req, res) =>{
    const id = req.params.id;
    const data = req.body;
    const category = await categoryService.updateCategory(id, data);

    res.json({
        success: true,
        message: "Category updated successfully",
        data: category
    });
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const category = await categoryService.deleteCategory(id);

    res.json({
        success: true,
        message: "Category deleted successfully",
        data: category
    });
});

export default router;