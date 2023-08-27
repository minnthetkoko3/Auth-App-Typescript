import express, { NextFunction } from "express";
import { merge, get } from "lodash";
import { getUserById } from "../models/User";

export const isOwner = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const currentUserId = get(req, "identity._id") as string;

        if (!currentUserId) {
            return res.sendStatus(401);
        }

        if (currentUserId.toString() !== id) {
            return res.sendStatus(403);
        }

        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};


export const isAuthenticated = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies["RIZA_AUTH"];

        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = await getUserById(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });

        return next();
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};
