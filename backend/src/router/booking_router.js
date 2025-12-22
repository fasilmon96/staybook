import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth_middleware";
import { createBooking, getBooking, updateBookingStatus } from "../controllers/booking_controller";


const router = express.Router();

router.use(protectRoute);

router.post("/add", createBooking);
router.get("/fetch", getBooking);
router.patch("/update/:id" ,adminRoute, updateBookingStatus);





export default router;