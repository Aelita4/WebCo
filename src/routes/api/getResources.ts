import { Router, Request, Response } from "express";
import db from "../../index.js";
import User from "../../types/User.js";
import logger from "../../logger.js";

const router = Router();
const path = "/api/getResources";

router.get(`${path}/:user`, async (req: Request, res: Response) => {
    const user = req.params.user;
    const findUser: User = await db.selectWhere('users', `address = '${user}' OR username = '${user}'`);

    if(typeof findUser !== 'undefined') {
        const findResources = await db.selectWhere('resources', `owner = '${findUser.id}'`);
        if(typeof findResources !== 'undefined') {
            delete findResources.createdAt;
            delete findResources.updatedAt;
            delete findResources.owner;
            delete findResources.id;
            res.status(200).json({ code: 200, message: "OK", resources: findResources });
        } else {
            logger("ERR", "DB", `Failed to find resources for ${findUser.id}`);
            res.status(500).json({ code: 500, message: "Internal Server Error" });
        }
    } else res.status(404).json({ code: 404, message: "Not Found" });
});

export default {
    path,
    router
};