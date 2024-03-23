
import { catchError } from '../../middleware/catchError.js';
import { userModel } from './../../../DataBase/models/user.model.js';
import jwt, { decode } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError } from '../../../utilites/AppError.js';


// Api description
// this function is used to sign up new user and create token
// create token According to the project owner's preference
export const signUp = catchError(async (req, res, next) => {
    const newUser = await userModel.create(req.body)
    const token = jwt.sign({ _id: newUser.id, role: newUser.role }, process.env.JWT_KEY_LOGIN);
    return res.json({ msg: 'success', newUser, token });
});


// Api description
// this function is used to login Exist user and create token
// create token According to the project owner's preference
export const logIn = catchError(async (req, res, next) => {
    let userExist;
    if (req.body.email) {
        userExist = await userModel.findOne({ email: req.body.email });
    } else if (req.body.mobileNumber) {
        userExist = await userModel.findOne({ mobileNumber: req.body.mobileNumber });
    }
    if (!userExist) return next(new AppError('Email or password incorrect', 401));
    const match = bcrypt.compareSync(req.body.password, userExist.password)
    if (match) {
        const token = jwt.sign({ _id: userExist.id, role: userExist.role }, process.env.JWT_KEY_LOGIN)
        await userModel.findOneAndUpdate({ _id: userExist.id }, { status: 'online' })
        return res.json({ msg: "success", token });
    }
    else { return next(new AppError('Email or password incorrect', 401)); }
});

// Api description
// this finction used to Update password 
export const changePassword = catchError(async (req, res, next) => {

    const user = await userModel.findById(req.user._id);
    if (!user) {
        next(new AppError('Email or password incorrect', 401))
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_KEY_LOGIN);
        await userModel.findByIdAndUpdate(req.user._id, { password: req.body.newPassword, passwordChangedAt: Date.now() });
        return res.json({ msg: "success", token });
    } else {
        next(new AppError("password incorrect", 401))
    }

})

// Api description
//Forget password  data security specially the OTP and the newPassword 
export const forgetPassword = catchError(async (req, res, next) => {
    let isUserExist;
    if (req.body.email) {
        isUserExist = await userModel.findOne({ email: req.body.email })
    } else if (req.body.mobileNumber) {
        isUserExist = await userModel.findOne({ mobileNumber: req.body.mobileNumber })
    }
    if (!isUserExist) { return next(new AppError('user not found', 401)) }

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    isUserExist.OTP = OTP

    await isUserExist.save()
    return res.json({ msg: 'success', OTP });
})

// Api description
//reset password  without sending any email ,  data security specially the OTP and the newPassword 
export const resetPassword = catchError(async (req, res, next) => {

    const user = await userModel.findOne({ OTP: req.body.OTP })
    if (!user) { return next(new AppError('inValid OTP')) }
    user.password = req.body.newPassword
    await user.save()
    return res.json({ msg: 'success' });
})






