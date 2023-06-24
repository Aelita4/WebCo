import { Router, Request, Response } from "express";
import fetch from "node-fetch";

const router = Router();
const path = "/game";

router.get(`${path}`, async (req: Request, res: Response) => {
    if(typeof req.session['user'] === 'undefined') return res.redirect('/');

    const resources = (await (await fetch(`http://localhost:3000/api/getResources/${req.session['userId']}`)).json() as any).resources;
    const buildings = (await (await fetch(`http://localhost:3000/api/getBuildings/${req.session['userId']}`)).json() as any).buildings;
    const planets = (await (await fetch(`http://localhost:3000/api/getPlanets`)).json() as any).planets;

    const data = {
        user: req.session['user'],
        userId: req.session['userId'],
        resources,
        buildings,
        planets
    }

    if(["overview", "buildings", "galaxy"].indexOf(req.query['view'] as string) === -1) return res.render('pages/game/overview.ejs', data);
    else return res.render(`pages/game/${req.query['view']}.ejs`, data);
});

router.get(`${path}/account`, async (req: Request, res: Response) => {
    if(typeof req.session['user'] === 'undefined') return res.redirect('/');
    res.render('pages/game/account.ejs', {
        user: req.session['user'],
        userId: req.session['userId']
    });
});

export default {
    path,
    router
};