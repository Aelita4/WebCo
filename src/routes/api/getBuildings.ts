import { Router, Request, Response } from "express";
import db from "../../index.js";
import User from "../../types/User.js";
import logger from "../../logger.js";

const router = Router();
const path = "/api/getBuildings";

router.get(`${path}/:user`, async (req: Request, res: Response) => {
    const user = req.params.user;
    const findUser: User = await db.selectWhere('users', `address = '${user}' OR username = '${user}'`);

    if(typeof findUser !== 'undefined') {
        const findBuildings = await db.selectWhere('buildings', `owner = '${findUser.id}'`);
        if(typeof findBuildings !== 'undefined') {
            delete findBuildings.createdAt;
            delete findBuildings.updatedAt;
            delete findBuildings.owner;
            delete findBuildings.id;
            res.status(200).json({ code: 200, message: "OK", buildings: findBuildings });
        } else {
            logger("ERR", "DB", `Failed to find buildings for ${findUser.id}`);
            res.status(500).json({ code: 500, message: "Internal Server Error" });
        }
    } else res.status(404).json({ code: 404, message: "Not Found" });
});

export default {
    path,
    router
};