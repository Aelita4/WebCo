import { Router, Request, Response } from "express";

const router = Router();
const path = "/metamaskRegister";

router.get(path, async (req: Request, res: Response) => {
    if(req.session.user || !req.query.address) return res.redirect('/');
    const error = req.query['error'] as string || '';
    res.render('pages/metamaskRegister.ejs', {
        address: req.query.address,
        error
    });
});

export default {
    path,
    router
};