import express from "express";
import { getUserByEmail, createUser } from "../models/User";
import { random, authentication } from "../helpers/index";


export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email or password incorrect' });
        };

        const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");
        if (!user) {
            return res.status(400).json({ message: "Can't Found Your Email Create New User!"});
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({ message: "Incorrect Password or Unauthorized"});
        };

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie("RIZA_AUTH", user.authentication.sessionToken, { domain: "localhost", path: "/"});
        
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password, username} = req.body;

        if (!email || !password || !username) {
            return res.sendStatus(400);
        };

        const existingUser = await getUserByEmail(email);

        if (existingUser){
            return res.sendStatus(400);
        };

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            },
        });

        return res.status(200).json(user).end();
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const testGet = async (req: express.Request, res: express.Response) => {
    res.end("hello world");
};