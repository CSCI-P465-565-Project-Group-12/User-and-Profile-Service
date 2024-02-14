import { Profile } from "../models/Profile";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 
 * @param {Profile} profile
 * @returns the promise that results in creating a profile
 */
export const createProfile = async (profile: Profile) => {
	const {profile_id, user_id, first_name, last_name, contact_number, bio} = profile;
	return await prisma.profiles.create({
		data: {
			profile_id,
			user_id,
			first_name,
			last_name,
			contact_number,
			bio,
		},
	});
};