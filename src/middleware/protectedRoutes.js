import { userModel } from "../../DataBase/models/user.model.js";
import { AppError } from "../../utilites/AppError.js"
import { catchError } from "./catchError.js"
import jwt from 'jsonwebtoken';

// description 
// this function used to protect routes which user must have access to complete
export const authorization = catchError(async (req, res, next) => {

    const { token } = req.headers
    if (!token) return next(new AppError('token not provided', 401))

    let decoded = jwt.verify(token, process.env.JWT_KEY_LOGIN)
    let user = await userModel.findById(decoded._id)
    if (!user) return next(new AppError('user not found', 401))
    if (user.passwordChangedAt) {
        let time = parseInt(user?.passwordChangedAt.getTime() / 1000)
        if (time > decoded.iat) return next(new AppError('invalid token', 401))
    }
    req.user = user
    next()
})

// description 
// This function is used to authorize users based on their roles.
export const allowedTo = (...roles) => {
    return catchError(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(' you are unauthorized', 401))
        }
        next()
    }
    )
}