import { Router, Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import db from "../index.js";
import User from "../types/database/User.js";

const router = Router();
const path = "/game";

router.use(async (req: Request, res: Response, next: NextFunction) => {
    if(typeof req.session['user'] === 'undefined') return res.redirect('/');

    const url = req.protocol + '://' + req.get('host');

    res.locals.resources = (await (await fetch(`${url}/api/getResources/${req.session['userId']}`, { headers: { "Authorization": req.session['accessToken'] || "" } })).json() as any).resources;
    res.locals.buildings = (await (await fetch(`${url}/api/getBuildings/${req.session['userId']}`)).json() as any).buildings;
    res.locals.planets = (await (await fetch(`${url}/api/getPlanets`)).json() as any).planets;

    next();
});

router.get(`${path}`, async (req: Request, res: Response) => {
    if(typeof req.session['user'] === 'undefined') return res.redirect('/');

    const url = req.protocol + '://' + req.get('host');
    const lang = await fetch(`${url}/lang/en_us.json`).then(res => res.json());

    const departed = 1687725966858 + 30000;
    const arrival = departed + 30000;
    const eta = Math.floor((arrival - new Date().getTime()) / 1000);
    const elapsed = Math.floor((arrival - departed) / 1000) - eta

    const data = {
        user: req.session['user'],
        userId: req.session['userId'],
        resources: res.locals.resources,
        buildings: res.locals.buildings,
        planets: res.locals.planets,
        lang,
        // fleet: [{
        //     departed,
        //     arrival,
        //     destination: "Kurvix",
        //     eta,
        //     elapsed,
        //     progress: (elapsed / Math.floor((arrival - departed) / 1000)) * 100
        // }]
    }

    if(["overview", "buildings", "galaxy"].indexOf(req.query['view'] as string) === -1) return res.render('pages/game/overview.ejs', data);
    else return res.render(`pages/game/${req.query['view']}.ejs`, data);
});

router.get(`${path}/account`, async (req: Request, res: Response) => {
    if(typeof req.session['user'] === 'undefined') return res.redirect('/');

    const accessToken = (await db.get<User>(req.session['userId'] || ""))[0].tmp;

    res.render('pages/game/account.ejs', {
        user: req.session['user'],
        userId: req.session['userId'],
        resources: res.locals.resources,
        accessToken
    });
});

export default {
    path,
    router
};