import { Router, Request, Response } from "express";

const router = Router();
const path = "/metamaskRegister";

router.get(path, async (req: Request, res: Response) => {
    if(!req.session.user) return res.redirect('/');
    res.render('pages/metamaskRegister.ejs');
});

export default {
    path,
    router
};