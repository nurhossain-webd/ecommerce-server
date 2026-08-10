import { Router } from 'express';
import { userService } from '../services/user/user.service.js';

const router = Router();

router.get('/', async (req, res) => {
    const users =  await userService.getAllUsers();

    res.json({
        success: true,
         message: "Users retrieved successfully",
        data: users
    })
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const user = await userService.getUserById(id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.json({
        success: true,
        message: "User retrieved successfully",
        data: user
    });
})
router.post('/', async (req, res) => {
    const data = req.body;
    const user = await userService.createUser(data);
   res.json({
  success: true,
  message: "User created successfully",
  data: user,

});
})

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const user = await userService.updateUser(id, data);

    res.json({
        success: true,
        message: "User updated successfully",
        data: user
    });
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const user = await userService.deleteUser(id);

    res.json({
        success: true,
        message: "User deleted successfully",
        data: user
    });
});

export default router;

