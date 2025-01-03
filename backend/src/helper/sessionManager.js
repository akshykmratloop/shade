import prismaClient from '../config/dbConnection.js';

export const saveSession = async (sid, session) => {
    await prismaClient.session.upsert({
        where: { sid },
        update: {
            data: JSON.stringify(session),
            expiresAt: new Date(Date.now() + session.cookie.maxAge),
        },
        create: {
            sid,
            data: JSON.stringify(session),
            expiresAt: new Date(Date.now() + session.cookie.maxAge),
        },
    });
};