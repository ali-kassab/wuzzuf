import joi from 'joi'


export const signUp_Vali = {
    body: joi.object({
        firstName: joi.string().min(3).max(10).required(),
        lastName: joi.string().min(3).max(10).required(),
        email: joi.string().email().trim().required(),
        password: joi.string().required().pattern(/^[a-zA-Z0-9#@]{8,40}$/),
        rePassword: joi.valid(joi.ref('password')).required(),
        recoverEmail: joi.string().email().trim().required(),
        mobileNumber: joi.string().min(10).max(15).pattern(/^[0-9]+$/).required(),
        role: joi.string().valid('user', 'company_HR').required(),
        DOB: joi.date().required(),
        status: joi.string().valid('online', 'offline').required(),
    })
}

export const logIn_vali = {
    body: joi.object({
        email: joi.string().email(),
        mobileNumber: joi.string().pattern(/^[0-9]+$/).min(10).max(15),
        password: joi.string().required().pattern(/^[a-zA-Z0-9#@]{8,40}$/)
    }).xor('email', 'mobileNumber').required()
}

export const changePassword_vali = {
    body: joi.object({

        password: joi.string().required().pattern(/^[a-zA-Z0-9#@]{8,40}$/),
        newPassword: joi.string().required().pattern(/^[a-zA-Z0-9#@]{8,40}$/)

    })
}

export const forgetPass_vali = {
    body: joi.object({
        email: joi.string().email(),
        mobileNumber: joi.string().pattern(/^[0-9]+$/).min(10).max(15),
    }).xor('email', 'mobileNumber').required()
}


export const resetPassword_vali = {
    body: joi.object({
        OTP: joi.string().required(),
        newPassword: joi.string().required().pattern(/^[a-zA-Z0-9#@]{8,40}$/)
    })
}
