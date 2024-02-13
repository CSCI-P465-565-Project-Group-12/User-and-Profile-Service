// import { Pool } from "pg";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { Security } from "../models/Security";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 
 * @todo: The following code is backup if the prisma integration fails
 */
// export const createUser = async (user: User): Promise<User> => {
// 	// Implement database logic to insert a user and return the inserted user data
// 	const { email, password, role, is_verified } = user;
// 	const client = await pool.connect();
// 	try {
// 		const result = await client.query(
// 			"INSERT INTO users (email, password, role, is_verified) VALUES ($1, $2, $3, $4) RETURNING *",
// 			[email, password, role, is_verified]
// 		);
// 		return result.rows[0];
// 	} finally {
// 		client.release();
// 	}
// 	// Remember to hash the password before storing it
// };

// export const createProfile = async (profile: Profile): Promise<Profile> => {
// 	// Implement database logic to insert a profile linked to the user
// 	const { profile_id, user_id, first_name, last_name, contact_number, bio } = profile;
// 	const client = await pool.connect();
// 	try {
// 		const result = await client.query(
// 			"INSERT INTO profiles (profile_id, user_id, first_name, last_name, contact_number, bio) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
// 			[profile_id, user_id, first_name, last_name, contact_number, bio]
// 		);
// 		return result.rows[0];
// 	} finally {
// 		client.release();
// 	}
// };

// export const createSecurity = async (security: Security): Promise<Security> => {
// 	// Implement database logic to insert security details for Duo 2FA
// 	const { security_id, user_id, duo_auth_id } = security;
// 	const client = await pool.connect();
// 	try {
// 		const result = await client.query(
// 			"INSERT INTO security (security_id, user_id, duo_auth_id) VALUES ($1, $2, $3) RETURNING *",
// 			[security_id, user_id, duo_auth_id]
// 		);
// 		return result.rows[0];
// 	} finally {
// 		client.release();
// 	}
// };


// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

/**
 * 
 * @param {User} user 
 * @returns the promise that results in creating a user
 */
export const createUser = async (user: User) => {
	const {email, password, role, is_verified} = user;
	return await prisma.user.create({
		data: {
			email,
			password,
			role,
			is_verified,
		},
	});
};

/**
 * 
 * @param {Profile} profile
 * @returns the promise that results in creating a profile
 */
export const createProfile = async (profile: Profile) => {
	const {profile_id, user_id, first_name, last_name, contact_number, bio} = profile;
	return await prisma.profile.create({
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

/**
 * 
 * @param {Security} security
 * @returns the promise that results in creating a security
 */
export const createSecurity = async (security: Security) => {
	const {security_id, user_id, duo_auth_id} = security;
	return await prisma.security.create({
		data: {
			security_id,
			user_id,
			duo_auth_id,
		},
	});
};
