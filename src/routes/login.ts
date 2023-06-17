import { Router, Request, Response } from "express";
import db from "../index.js";
import bcrypt from 'bcrypt';

const router = Router();
const path = "/login";

router.get(path, async (req: Request, res: Response) => {
    // let user = {};
    // if(req.session.user) user = await db.select(`users:${req.session.user}`);
    res.render('pages/login.ejs');
});

router.post(`${path}/log`, async (req: Request, res: Response) => {
    const username = req.body['login'];
    const password = req.body['password'];

    const ifFound = await db.select(`users:${username}`);
    if(typeof ifFound === 'undefined') {
        res.redirect('/login?form=login&error=invalidCredentials');
        return;
    }

    const hash = ifFound.password;
    const isPasswordCorrect = await bcrypt.compare(password, hash);
    if(!isPasswordCorrect) {
        res.redirect('/login?form=login&error=invalidCredentials');
        return;
    }

    req.session['user'] = username;
    res.redirect('/game');
});

router.post(`${path}/reg`, async (req: Request, res: Response) => {
    const username = req.body['login'];
    const email = req.body['email'];
    const password = req.body['password'];
    const password2 = req.body['password2'];

    if(password !== password2) {
        res.redirect('/login?form=register&error=passwordsNotMatch');
        return;
    }

    const ifFound = await db.selectWhere('users', `username = '${username}' OR email = '${email}'`);
    if(typeof ifFound !== 'undefined') {
        res.redirect('/login?form=register&error=userExists');
        return;
    }

    const hash = await encryptPassword(password);

    await db.create(`users:${username}`, {
        username,
        email,
        password: hash
    });

    req.session['user'] = username;
    res.redirect('/game');
});

async function encryptPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

async function validatePassword(password: string, hash: string) {
    const result = await bcrypt.compare(password, hash);
    return result;
}

export default {
    path,
    router
};