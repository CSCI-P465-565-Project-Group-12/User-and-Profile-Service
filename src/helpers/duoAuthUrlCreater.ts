import { redisClient, duoClient } from "../app";
export const duoAuthUrlCreater = async (username: string) => {
    await duoClient.healthCheck();
	const state = duoClient.generateState();
    const url = duoClient.createAuthUrl(username, state);
    const duoState=state;
    await redisClient.hSet(duoState,{username});
    return url;
}
