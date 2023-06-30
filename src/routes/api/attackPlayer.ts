import { Router, Request, Response } from "express";
import db from "../../index.js";
import User from "../../types/User.js";
import { createHmac } from 'crypto';
import fetch from 'node-fetch';

const router = Router();
const path = "/api/attackPlayer";

router.post(`${path}/:id`, async (req: Request, res: Response) => {
    const url = req.protocol + '://' + req.get('host');

    const accessToken = req.headers['authorization'];
    if(typeof accessToken === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });

    const findUser: User = await db.selectWhere('users', `accessToken = '${createHmac('sha256', accessToken).digest('hex')}'`);
    if(typeof findUser === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });

    const enemyPlayerId = req.params['id'];

    const ownResources   = await (await fetch(`${url}/api/getResources/${findUser.id}`,   { headers: { "Authorization": accessToken || "" } })).json() as any;
    const enemyResources = await (await fetch(`${url}/api/getResources/${enemyPlayerId}`, { headers: { "Authorization": "spy" } })).json() as any;

    const obtained = {
        wood: Math.floor(enemyResources.resources.wood * 0.1),
        iron: Math.floor(enemyResources.resources.iron * 0.1),
        copper: Math.floor(enemyResources.resources.copper * 0.1),
        gold: Math.floor(enemyResources.resources.gold * 0.1),
        coal: Math.floor(enemyResources.resources.coal * 0.1),
        oil: Math.floor(enemyResources.resources.oil * 0.1),
        uranium: Math.floor(enemyResources.resources.uranium * 0.1),
    }

    console.log(ownResources, enemyResources, obtained)

    await db.merge(ownResources.id, {
        wood: ownResources.resources.wood + obtained.wood,
        iron: ownResources.resources.iron + obtained.iron,
        copper: ownResources.resources.copper + obtained.copper,
        gold: ownResources.resources.gold + obtained.gold,
        coal: ownResources.resources.coal + obtained.coal,
        oil: ownResources.resources.oil + obtained.oil,
        uranium: ownResources.resources.uranium + obtained.uranium
    });

    await db.merge(enemyResources.id, {
        wood: enemyResources.resources.wood - obtained.wood,
        iron: enemyResources.resources.iron - obtained.iron,
        copper: enemyResources.resources.copper - obtained.copper,
        gold: enemyResources.resources.gold - obtained.gold,
        coal: enemyResources.resources.coal - obtained.coal,
        oil: enemyResources.resources.oil - obtained.oil,
        uranium: enemyResources.resources.uranium - obtained.uranium
    });

    res.status(200).json({ code: 200, message: "OK", obtained });
});

export default {
    path,
    router
};