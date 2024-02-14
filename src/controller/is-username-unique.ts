import express, {Request, Response, NextFunction} from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Route to check if a username exists
export const isUsernameUnique = async (req:Request, res:Response) => {
  const { username } = req.query; // Using query parameters for simplicity
  if (!username) {
    return res.status(400).json({ message: "Please provide a username." });
  }
  try {
    const user = await prisma.users.findUnique({
      where: {
        username: String(username),
      },
    });

    if (user) {
      res.json({ exists: true, message: "Username already exists." });
    } else {
      res.json({ exists: false, message: "Username is available." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while checking the username." });
  }
};