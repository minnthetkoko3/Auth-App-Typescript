import express from 'express';

import { deleteUser, getAllUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares/index';

export default (router: express.Router) => {
    router.get('/user', isAuthenticated, getAllUser);
    router.delete('/user/:id', isAuthenticated, isOwner, deleteUser);
    router.patch('/user/:id', isAuthenticated, isOwner, deleteUser);

};