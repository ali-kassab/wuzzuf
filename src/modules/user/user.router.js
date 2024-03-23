import express from 'express';
import { authorization } from '../../middleware/protectedRoutes.js';
import { validation } from '../../middleware/validation.js';
import { getByCoverEmail, paramId_valid, updateUser_Vali } from './user.validation.js';
import { GetAccountsByrecoverEmail, GetProfileDataForAnotherUser, GetUserAccountData, deleteUser, updateUser } from './user.controller.js';



export const userRouter = express.Router({ mergeParams: true })


userRouter.route('/')
    .put(authorization, validation(updateUser_Vali), updateUser)
    .delete(authorization, deleteUser)
    .get(authorization, GetUserAccountData)
userRouter.get('/recoverEmail', authorization, validation(getByCoverEmail), GetAccountsByrecoverEmail)
userRouter.route('/:id')
    .get(authorization, validation(paramId_valid), GetProfileDataForAnotherUser)
