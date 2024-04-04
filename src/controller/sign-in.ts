import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { getUser } from "../db/users-db";
import { duoAuthUrlCreater } from "../helpers/duoAuthUrlCreater";

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await getUser(username);
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      try {
        const url = await duoAuthUrlCreater(username);
        res.status(302).json({ url });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
      }
    } else {
      return res.status(401).json({ message: "Invalid username or password." });
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    res
      .status(500)
      .json({ message: "An error occurred during the sign-in process." });
  }
};

export const getCurrentUser = async(req: Request, res: Response) => {
  res.status(200).json(req.user);
};