import { Request, Response, NextFunction } from "express";
import bcrypt  from "bcrypt";
import dotenv from "dotenv"; 
import { redisClient } from "../app";
import { generateOTP } from "../helpers/generateOTP";
import { getUser, updateUser } from "../db/users-db";
import axios from "axios";
import { jwtSecret } from "../app";
import jwt from "jsonwebtoken";
dotenv.config();

const MAIL_URL = process.env.MAIL_URL as string;

export const sendOTP = async (req:Request, res:Response) => {
    const { username } = req.query as { username: string };
    const redisData = await redisClient.hGetAll('Otp$'+username);
    const user = await getUser(username);
    let otp = generateOTP();
    if (redisData.otp) {
        otp =  redisData.otp; 
    }
    await redisClient.hSet('Otp$'+username, {otp});
    await redisClient.expire('Otp$' + username, 600); //10 min expiration.
    const body = {
        to: user?.email,
        data: {
            firstName:username,
            otp:otp
        }
    };
    try {
        const response = await axios.post(`${MAIL_URL}/forgot-password-mail`, body);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("OTP error:", error);
        res.status(500).json({ message: "An error occurred during OTP generation." });
    }
}

export const verifyOTP = async (req:Request, res:Response) => {
    const { username, otp } = req.query as { username: string, otp: string };
    try{
        const redisData = await redisClient.hGetAll('Otp$'+username);
        const savedOtp = redisData.otp;
        await redisClient.del('Otp$'+username);
        const user = await getUser(username);
        const token = jwt.sign(
			{ 
                id: user?.id, 
                username: user?.username,
                email: user?.email,
                role: user?.role,
            },
			jwtSecret,
			{ expiresIn: '1h' }
		);
        if(savedOtp === otp){
            res.status(200).json(token);
        }else{
            res.status(401).json({ message: "Invalid OTP" });
        }
    }
    catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "An error occurred during OTP verification." });
    }
}

export const resetPassword = async (req:Request, res:Response) => {
    const user = req.user.jwtUserObj;
    const { username, password } = req.body;
    console.log("username", username, "password", password);
    console.log("user", user);
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await updateUser(username, { password: hashedPassword });
        console.log("updatedUser", updatedUser);
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "An error occurred during password reset." });
    }
};