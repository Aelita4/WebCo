import { Router, Request, Response } from "express";

const router = Router();
const path = "/";

router.get(path, (req: Request, res: Response) => {
    if(typeof req.session['user'] !== 'undefined') return res.redirect('/game');
    res.render('pages/index.ejs');
});

export default {
    path,
    router
};