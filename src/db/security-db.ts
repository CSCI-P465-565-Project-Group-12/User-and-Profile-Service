import { Security } from "../models/Security";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
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