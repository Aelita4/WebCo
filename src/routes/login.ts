import { Router, Request, Response } from "express";
import db from "../index.js";
import bcrypt from 'bcrypt';
import User from "../types/User.js";

const router = Router();
const path = "/login";

router.get(path, async (req: Request, res: Response) => {
    const form = req.query['form'] as string || 'login';
    const error = req.query['error'] as string || '';
    res.render('pages/login.ejs', {
        form,
        error
    });
});

router.post(`${path}/log`, async (req: Request, res: Response) => {
    const username = req.body['login'];
    const password = req.body['password'];

    const ifFound = await db.select<User>(`users:${username}`);
    if(typeof ifFound === 'undefined') {
        res.redirect('/login?form=login&error=invalidCredentials');
        return;
    }

    const hash = ifFound.password;
    const isPasswordCorrect = await validatePassword(password, hash);
    if(!isPasswordCorrect) {
        res.redirect('/login?form=login&error=invalidCredentials');
        return;
    }

    req.session['user'] = username;
    res.redirect('/game');
});

router.post(`${path}/reg`, async (req: Request, res: Response) => {
    const username: string = req.body['login'];
    const email = req.body['email'];
    const password = req.body['password'];
    const password2 = req.body['password2'];

    if(username.length < 3 || username.length > 16) {
        res.redirect('/login?form=register&error=usernameLength');
        return;
    }

    if(username.match(/[^a-zA-Z0-9_]/g)) {
        res.redirect('/login?form=register&error=usernameInvalid');
        return;
    }

    if(!validateEmail(email)) {
        res.redirect('/login?form=register&error=emailInvalid');
        return;
    }

    const ifFound = await db.selectWhere('users', `username = '${username}' OR email = '${email}'`);
    if(typeof ifFound !== 'undefined') {
        if(ifFound.username === username) res.redirect('/login?form=register&error=usernameTaken');
        if(ifFound.email === email) res.redirect('/login?form=register&error=emailTaken');
        return;
    }

    if(password.length < 8) {
        res.redirect('/login?form=register&error=passwordLength');
        return;
    }

    if(password !== password2) {
        res.redirect('/login?form=register&error=passwordsNotMatch');
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

function validateEmail(email: string) {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; // DEAR GOD
    return re.test(email);
}

export default {
    path,
    router
};