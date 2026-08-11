import { Router } from 'express';
import { userService } from '../services/user/user.service.js';
import { auth } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.get('/', auth, authorize("ADMIN"), async (req, res) => {
    const users =  await userService.getAllUsers();

    res.json({
        success: true,
         message: "Users retrieved successfully",
        data: users
    })
})

router.get('/:id', auth, authorize("ADMIN"), async (req, res) => {
    const id = req.params.id as string;
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
router.post('/', auth, authorize("ADMIN"), async (req, res) => {
    const data = req.body;
    const user = await userService.createUser(data);
   res.json({
  success: true,
  message: "User created successfully",
  data: user,

});
})

router.patch('/:id', auth, authorize("ADMIN"), async (req, res) => {
    const id = req.params.id as string;
    const data = req.body;
    const user = await userService.updateUser(id, data);

    res.json({
        success: true,
        message: "User updated successfully",
        data: user
    });
})

router.delete('/:id', auth, authorize("ADMIN"), async (req, res) => {
    const id = req.params.id as string;
    const user = await userService.deleteUser(id);

    res.json({
        success: true,
        message: "User deleted successfully",
        data: user
    });
});

export default router;

