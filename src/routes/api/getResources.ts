import { Router, Request, Response } from "express";
import db from "../../index.js";

const router = Router();
const path = "/api/getResources";

router.get(`${path}/:id`, async (req: Request, res: Response) => {
    const findResources = await db.selectWhere('resources', `owner = '${req.params['id']}'`);
    if(typeof findResources !== 'undefined') {
        delete findResources.createdAt;
        delete findResources.updatedAt;
        delete findResources.owner;
        delete findResources.id;
        res.status(200).json({ code: 200, message: "OK", resources: findResources });
    } else {
        res.status(404).json({ code: 404, message: "Not found" });
    }
});

export default {
    path,
    router
};