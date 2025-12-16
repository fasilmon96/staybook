import { gnerateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {

    const { userName, email, password } = req.body;

    try {

        if (!userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters long" });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists with this email" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            const saveUser = await newUser.save();
            gnerateToken(saveUser._id, res);
            return res.status(201).json({
                _id: saveUser._id,
                userName: saveUser.userName,
                email: saveUser.email,
                role: saveUser.role,
                createdAt: saveUser.createdAt
            })
        }


    } catch (error) {
        console.log("Error in Signup Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) return res.status(400).json({ message: "Invalid Credentials" });

        gnerateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        })
    } catch (error) {
        console.log("Error in Login controller", error)
        res.status(500).json({ message: "Internal Server error" })
    }
}

export const logout = async (_, res) => {
   
    res.cookie("jwt" , "" , {maxAge : 0});
    res.status(200).json({message : "Logout successfully"});

}


export const checkAuth = (req , res) =>{
    res.status(200).json(req.user)
}


