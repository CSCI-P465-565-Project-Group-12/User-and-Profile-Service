import { Profile, UpdateProfileParams } from "../models/Profile";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 
 * @param {Profile} profile
 * @returns the promise that results in creating a profile
 */
export const createProfile = async (profile: Profile) => {
	const {profile_id, user_id, first_name, last_name, contact_number, bio, address} = profile;
	return await prisma.profiles.create({
		data: {
			profile_id,
			user_id,
			first_name,
			last_name,
			contact_number,
			bio,
			address,
		},
	});
};

/**
 * 
 * @param user_id 
 * @param updateParams 
 * @returns 
 */
export const updateProfile = async(user_id: string, updateParams: UpdateProfileParams) =>{
	return await prisma.profiles.update({
		where: {
			user_id: user_id,
		},
		data: {
			...updateParams,
		},
	});
};

export const getProfile = async (user_id: string) => {
	return await prisma.profiles.findUnique({
		where: {
			user_id: String(user_id),
		},
	});
};