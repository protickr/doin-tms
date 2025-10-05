import { Router } from "express";
import usersRoutes from "../src/modules/users/userRoute";

const router = Router();

// Mount each module on a path
router.use(usersRoutes);
// router.use("/auth", authRoutes);

export default router;
