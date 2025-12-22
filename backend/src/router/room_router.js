import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth_middleware';
import { createRoom, deleteRoom, getAllRooms, getSingleRoom, updateRoom } from '../controllers/room_controller';


const router = express.Router();

router.use(protectRoute);


router.post("/create", adminRoute, createRoom);
router.get("/fetchAll", getAllRooms);
router.get("/fetch/:id", getSingleRoom);
router.put("edit/:id" , adminRoute , updateRoom);
router.delete("/delete/:id" , adminRoute , deleteRoom);





export default router;