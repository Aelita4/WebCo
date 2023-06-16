import { Router, Request, Response } from "express";
import db from "../index.js";

const router = Router();
const path = "/login";

router.get(path, async (req: Request, res: Response) => {
    await db.create(`users:gargamel`, {
        username: "gargamel",
        lastLogin: Date.now()
    });

    res.send('Hello Login!<br />' + JSON.stringify(await db.get(`users:gargamel`)));
});

export default {
    path,
    router
};