import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env';
import User from '../models/User.js';
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookie.jwt
        if (!token) return res.status(401).json({ message: "Unauthorized , No token provided" })

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: "Unauthorized , Invalid token" })

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({ message: "Unauthorized , User not found" });

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export const adminRoute = async (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        next();
    } else{
        return res.status(403).json({message : "Aceess denied Admins Only"})
    }

}