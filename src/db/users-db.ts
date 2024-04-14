// import { Pool } from "pg";
import { User, UpdateUserParams } from "../models/User";

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


/**
 * 
 * @param {User} user 
 * @returns the promise that results in creating a user
 */
export const createUser = async (user: User) => {
	const {id, email,username, password, role, is_verified} = user;
	return await prisma.users.create({
		data: {
			id,
			email,
			username,
			password,
			role,
			is_verified,
		},
	});
};

export const getUser = async (username: string) => {
	return await prisma.users.findUnique({
		where: {
			username: String(username),
		},
	});
};

export const getUserById = async (userId: string) => {
	return await prisma.users.findUnique({
		where: {
			id: String(userId),
		},
	});
};


export const updateUser = async(username: string, updateParams: UpdateUserParams) =>{
	return await prisma.users.update({
		where: {
			username: username,
		},
		data: {
			...updateParams,
		},
	});
};

// Example usage
// const usernameToUpdate = 'user123';
// const updates = {
//   email: 'newemail@example.com',
//   is_verified: true,
//   role: 'RegularUser', // Ensure this matches one of the options in your UserRole enum
// };

// updateUser(usernameToUpdate, updates)
//   .then(() => console.log('User updated successfully'))
//   .catch((error) => console.error('Failed to update user', error));
