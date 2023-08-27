import express from "express";

import { login, register, testGet } from "../controllers/authentication";

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.get('/auth/get', testGet);
    router.post('/auth/login', login);
};