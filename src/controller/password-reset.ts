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

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || "http://localhost:8081";

export const sendOTP = async (req:Request, res:Response) => {
    const { username } = req.query as { username: string };
    const user = await getUser(username);
    const otp = generateOTP();
    await redisClient.hSet('Otp$'+username, {otp});
    const body = {
        to: user?.email,
        data: {
            firstName:username,
            otp:otp
        }
    };
    try {
        const response = await axios.post(`${API_GATEWAY_URL}/forgot-password-mail`, body);
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
        const token = jwt.sign(
			{ username }, // Payload data
			jwtSecret, // Secret key
			{ expiresIn: '1h' } // Token expiration time
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
    const { username, password } = req.body;
    console.log("username", username, "password", password);
    const user = await getUser(username);
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