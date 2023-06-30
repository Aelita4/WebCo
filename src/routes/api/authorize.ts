import { Router, Request, Response } from "express";
import db from "../../index.js";
import User from "../../types/database/User.js";
import bcrypt from 'bcrypt';

const router = Router();
const path = "/api/authorize";

router.post(`${path}`, async (req: Request, res: Response) => {
    const username = req.body['login'];
    const password = req.body['password'];

    const ifFound: User = await db.selectWhere(`users`, `username = '${username}' OR email = '${username}'`);
    if(typeof ifFound === 'undefined') {
        res.status(401).json({ code: 401, message: "Unauthorized" });
        return;
    }

    const hash = ifFound.password;
    const isPasswordCorrect = await validatePassword(password, hash || '');
    if(!isPasswordCorrect) {
        res.status(401).json({ code: 401, message: "Unauthorized" });
        return;
    }

    await db.merge(ifFound.id, {
        lastSeen: new Date().getTime()
    });

    res.status(200).json({ code: 200, message: "OK", username: ifFound.username, accessToken: ifFound.tmp });
});

async function validatePassword(password: string, hash: string) {
    const result = await bcrypt.compare(password, hash);
    return result;
}

export default {
    path,
    router
};