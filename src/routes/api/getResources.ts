import { Router, Request, Response } from "express";
import db from "../../index.js";
import { createHmac } from 'crypto';
import User from "../../types/database/User.js";
import Resource from "../../types/database/Resource.js";

const router = Router();
const path = "/api/getResources";

router.get(`${path}/:id`, async (req: Request, res: Response) => {
    const accessToken = req.headers['authorization'];
    if(typeof accessToken === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });

    const findUser: User = await db.selectWhere('users', `accessToken = '${createHmac('sha256', accessToken).digest('hex')}'`);
    if(accessToken !== "spy") {
        if(typeof findUser === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });
        if(findUser.id !== req.params['id'] && req.params["id"] !== "own") return res.status(403).json({ code: 403, message: "Forbidden" });
    }

    let user;
    if(req.params["id"] === "own") user = findUser.id;
    else user = req.params["id"];

    const findResources: Resource = await db.selectWhere('resources', `owner = '${user}'`);
    if(typeof findResources !== 'undefined') {
        const resourc: any = JSON.parse(JSON.stringify(findResources));

        delete resourc.createdAt;
        delete resourc.updatedAt;
        delete resourc.owner;
        delete resourc.id;
        res.status(200).json({ code: 200, message: "OK", id: findResources.id, resources: resourc });
    } else {
        res.status(404).json({ code: 404, message: "Not found" });
    }
});

export default {
    path,
    router
};