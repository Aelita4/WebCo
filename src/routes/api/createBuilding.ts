import { Router, Request, Response } from "express";
import db from "../../index.js";
import { createHmac } from 'crypto';
import fetch from "node-fetch";
import User from "../../types/database/User.js";
import Building from "../../types/database/Building.js";

const router = Router();
const path = "/api/createBuilding";

router.post(`${path}/:name`, async (req: Request, res: Response) => {
    const url = req.protocol + '://' + req.get('host');

    const accessToken = req.headers['authorization'];
    if(typeof accessToken === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });

    const findUser: User = await db.selectWhere('users', `accessToken = '${createHmac('sha256', accessToken).digest('hex')}'`);
    if(typeof findUser === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });

    const building = req.params['name'];
    const findBuilding: Building = await db.selectWhere('buildings', `owner = ${findUser.id}`);
    
    // TODO: check if player has enough resources
    const resources = (await (await fetch(`${url}/api/getResources/${findUser.id}`, { headers: { "Authorization": accessToken || "" } })).json() as any).resources;

    const data: any = {};
    data[building] = (findBuilding[building as keyof(Building)] as number) + 1;

    await db.merge((findBuilding.id as string), data);

    res.status(200).json({ code: 200, message: "OK" });
    
    // const findBuildings = await db.selectWhere('buildings', `owner = '${req.params['id']}'`);
    // if(typeof findBuildings !== 'undefined') {
    //     delete findBuildings.createdAt;
    //     delete findBuildings.updatedAt;
    //     delete findBuildings.owner;
    //     delete findBuildings.id;
    //     res.status(200).json({ code: 200, message: "OK", buildings: findBuildings });
    // } else {
    //     res.status(404).json({ code: 404, message: "Not found" });
    // }
});

export default {
    path,
    router
};