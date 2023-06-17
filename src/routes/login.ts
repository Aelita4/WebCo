import { Router, Request, Response } from "express";
import db from "../index.js";

const router = Router();
const path = "/login";

router.get(path, async (req: Request, res: Response) => {
    // let user = {};
    // if(req.session.user) user = await db.select(`users:${req.session.user}`);
    res.render('pages/login.ejs');
});

export default {
    path,
    router
};