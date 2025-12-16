import jwt from 'jsonwebtoken';
import { ENV } from './env';

export const gnerateToken = async (userId, res) => {
    const { JWT_SECRET } = ENV;
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not secured");

    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000 ,// 7days
        httpOnly : true ,
        sameSite : "strict",
        secure : ENV.NODE_ENV === "development" ? false : true
    })
    return token;
}