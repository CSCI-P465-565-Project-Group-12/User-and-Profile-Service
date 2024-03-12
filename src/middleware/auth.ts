import { jwtSecret } from "../app";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

export const validateUserToken = (req: Request, res: Response, next:NextFunction) => {
    console.log("called validate user token")
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.body.user = user;
        next();
    });
}