import { Router, Request, Response } from "express";
import db from "../../index.js";
import { createHmac } from 'crypto';

const router = Router();
const path = "/api/getResources";

router.get(`${path}/:id`, async (req: Request, res: Response) => {
    const accessToken = req.headers['authorization'];
    if(typeof accessToken === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });

    if(accessToken !== "spy") {
        const findUser = await db.selectWhere('users', `accessToken = '${createHmac('sha256', accessToken).digest('hex')}'`);
        if(typeof findUser === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });

        if(findUser.id !== req.params['id']) return res.status(403).json({ code: 403, message: "Forbidden" });
    }

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