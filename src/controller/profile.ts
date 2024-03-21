import { Request, Response } from "express";
import { createProfile, getProfile, updateProfile } from "../db/profiles-db";
import { v4 as uuidv4 } from "uuid";

export const createUserProfile = async (req: Request, res: Response) => {
  const { first_name, last_name, contact_number, bio, address } = req.body;
  const user_id = req.body.user.id;
  const profile_id = uuidv4();
  try {
    const profile = await createProfile({
      profile_id,
      user_id,
      first_name,
      last_name,
      contact_number,
      bio,
      address,
    });
    res.status(201).json(profile);
  } catch (error) {
    console.error("Create profile error:", error);
    res
      .status(500)
      .json({ message: "An error occurred during profile creation." });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const updateParams = req.body.updateParams;
  const user_id = req.body.user.id;
  try {
    const profile = await updateProfile(user_id, updateParams);
    res.status(200).json(profile);
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "An error occurred during profile update." });
  }
};
