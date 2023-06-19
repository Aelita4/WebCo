import { Router, Request, Response } from "express";
import db from "../../index.js";
import User from "../../types/User.js";

const router = Router();
const path = "/api/auth";

router.post(`${path}/metamask/:address`, async (req: Request, res: Response) => {
    const address = req.params.address;
    const findAddr = await db.selectWhere('users', `address = '${address}'`);
    const userFound = typeof findAddr !== 'undefined';

    res.status(200).json({ code: 200, message: "OK", userFound });
});

router.get(`${path}/logout`, async (req: Request, res: Response) => {
    const redirectTo = req.query.redirectTo as string || '/';
    req.session.destroy(() => {});
    res.redirect(redirectTo);
});

export default {
    path,
    router
};