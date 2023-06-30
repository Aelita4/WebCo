import { Router, Request, Response } from "express";
import db from "../../index.js";
import Building from "../../types/database/Building.js";

const router = Router();
const path = "/api/getBuildings";

router.get(`${path}/:id`, async (req: Request, res: Response) => {
    const findBuildings: Building = await db.selectWhere('buildings', `owner = '${req.params['id']}'`);
    if(typeof findBuildings !== 'undefined') {
        const build: any = findBuildings;

        delete build.createdAt;
        delete build.updatedAt;
        delete build.owner;
        delete build.id;
        res.status(200).json({ code: 200, message: "OK", id: findBuildings.id, buildings: build });
    } else {
        res.status(404).json({ code: 404, message: "Not found" });
    }
});

export default {
    path,
    router
};