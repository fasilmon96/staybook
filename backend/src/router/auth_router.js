import express from 'express';
import { signup } from '../controllers/auth_controller.js';


const router = express.Router();

router.get("/signup", signup)




// router.get("/login", (req, res)=>{
//     res.send("Login Ready");
// })

// router.get("/logout", (req, res)=>{
//     res.send("Logout Ready");
// })

// router.get("/check", (req, res)=>{
//     res.send("check Ready");
// })





export default router;