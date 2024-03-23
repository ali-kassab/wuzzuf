import { userModel } from "../../../DataBase/models/user.model.js"
import { AppError } from "../../../utilites/AppError.js"
import { catchError } from "../../middleware/catchError.js"






// Api description
// this function is used to update ,User must be loggedIn and only the owner of the account can update his account data
//the new data doesn’t conflict with any existing data in your  database
export const updateUser = catchError(async (req, res, next) => {
    const userExist = await userModel.findOne({ _id: req.user._id })
    if (!userExist) return next(new AppError('user not found', 401))
    const checkEmail = await userModel.findOne({ email: req.body.email })
    const checkMobile = await userModel.findOne({ mobileNumber: req.body.mobileNumber });
    if (checkMobile || checkEmail) return next(new AppError('already Exist', 401))
    const user = await userModel.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true })
        .select('firstName lastName DOB recoveryEmail mobile Number email')
    return res.json({ msg: 'success', user })
});

// Api description
// this function used to delete user
export const deleteUser = catchError(async (req, res, next) => {
    let user = await userModel.findOneAndDelete(req.user._id)
    user && res.json({ msg: 'success', user })
    !user && res.json({ msg: 'user not found' })
})

// Api description
// this function is used to Get user account data - only the owner of the account can get his account data
//- User must be loggedIn
export const GetUserAccountData = catchError(async (req, res, next) => {
    let user = await userModel.findOne(req.user._id)

    user && res.json({ msg: 'success', user })
    !user && (next(new AppError('user not found', 404)))
})

// Api description
// this function used to Get profile data for another user by sendding the userId in params
export const GetProfileDataForAnotherUser = catchError(async (req, res, next) => {
    let user = await userModel.findById(req.params.id).select('firstName lastName email mobileNumber role')
    user && res.json({ msg: 'success', user })
    !user && (next(new AppError('user not found', 404)))
})

// Api description
// Get all accounts associated to a specific recovery Email 
export const GetAccountsByrecoverEmail = catchError(async (req, res, next) => {
    let accounts = await userModel.findOne({ recoverEmail: req.body.recoverEmail })
    accounts && res.json({ msg: 'success', accounts })
    !accounts && (next(new AppError(' inValid recoverEmail', 404)))
})



