
import express from 'express';
import { validation } from './../../middleware/validation.js';
import { changePassword_vali, forgetPass_vali, logIn_vali, resetPassword_vali, signUp_Vali } from './auth.validation.js';
import { checkEmail } from './../../middleware/checkEmail.js';
import { changePassword, forgetPassword, logIn, resetPassword, signUp } from './auth.controller.js';
import { authorization } from './../../middleware/protectedRoutes.js';





export const authRouter = express.Router({ mergeParams: true })

authRouter
    .post('/signup', validation(signUp_Vali), checkEmail, signUp)
    .post('/login', validation(logIn_vali), logIn)
    .put('/changePassword', authorization, validation(changePassword_vali), changePassword)
    .patch('/forgetPassword', authorization, validation(forgetPass_vali), forgetPassword)
    .patch('/resetPassword', authorization, validation(resetPassword_vali), resetPassword)
