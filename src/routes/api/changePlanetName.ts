import { Router, Request, Response } from "express";
import db from "../../index.js";
import Planet from "../../types/database/Planet.js";
import { createHmac } from 'crypto';
import fetch from "node-fetch";

const router = Router();
const path = "/api/changePlanetName";

router.post(`${path}`, async (req: Request, res: Response) => {
    //TODO: figure out how to get user access token in frontend
    // const accessToken = req.headers['authorization'];
    // if(typeof accessToken === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });

    // const findUser = await db.selectWhere('users', `accessToken = '${createHmac('sha256', accessToken).digest('hex')}'`);
    // if(typeof findUser === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });

    const userId = req.body['userId'];

    const planetName = req.body['name'];
    const findPlanet: Planet = await db.selectWhere('planets', `owner = ${userId}`);
    if(!findPlanet) return res.status(404).json({ code: 404, message: "Not found" });


    await db.merge((findPlanet.id as string), {
        name: planetName
    });

    res.status(200).json({ code: 200, message: "OK" });
});

export default {
    path,
    router
};