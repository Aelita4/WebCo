import { Router, Request, Response } from "express";
import db from "../index.js";
import User from "../types/User.js";

const router = Router();
const path = "/game";

// router.get(`${path}/metamask/:address`, async (req: Request, res: Response) => {
//     const address = req.params.address;
//     res.json(await db.selectWhere('users', `address = '${address}'`));
// });

// router.get(`${path}/login`, async (req: Request, res: Response) => {
//     const user: User = await db.select('users:gargamel');
//     req.session.user = user.username;
//     return res.status(200).json({ code: 200, message: "OK" });
// });

// router.get(`${path}/register`, async (req: Request, res: Response) => {
//     await db.create('users:gargamel', {
//         username: 'gargamel',
//         address: '0x1234567890'
//     });

//     return res.status(200).json({ code: 200, message: "OK" });
// });

// router.get(`${path}/logout`, async (req: Request, res: Response) => {
//     const redirectTo = req.query.redirectTo as string || '/';
//     req.session.destroy(() => {});
//     res.redirect(redirectTo);
// });

export default {
    path,
    router
};