import { Router, Request, Response } from "express";
import db from "../../index.js";

const router = Router();
const path = "/api/getBuildings";

router.get(`${path}/:id`, async (req: Request, res: Response) => {
    const findBuildings = await db.selectWhere('buildings', `owner = '${req.params['id']}'`);
    if(typeof findBuildings !== 'undefined') {
        delete findBuildings.createdAt;
        delete findBuildings.updatedAt;
        delete findBuildings.owner;
        delete findBuildings.id;
        res.status(200).json({ code: 200, message: "OK", buildings: findBuildings });
    } else {
        res.status(404).json({ code: 404, message: "Not found" });
    }
});

export default {
    path,
    router
};