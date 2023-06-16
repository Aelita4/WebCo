import { Router, Request, Response } from "express";
import db from "../index.js";

const router = Router();
const path = "/login";

router.get(path, async (req: Request, res: Response) => {
    let user = {};
    if(req.session.user) user = await db.select(`users:${req.session.user}`);
    res.send(`Hello Login!<br />${JSON.stringify(user)}`);
});

export default {
    path,
    router
};