
import joi from 'joi';




export const paramId_valid = {
    params: joi.object({
        id: joi.string().required().length(24).hex()
    })
}

export const updateUser_Vali = joi.object({
    firstName: joi.string().min(3).max(10).required(),
    lastName: joi.string().min(3).max(10).required(),
    email: joi.string().email().trim().required(),
    recoverEmail: joi.string().email().trim().required(),
    mobileNumber: joi.string().min(10).max(15).pattern(/^[0-9]+$/).required(),
    DOB: joi.date().required(),
});

export const getByCoverEmail = {
    body: joi.object({
        recoverEmail: joi.string().email().trim().required(),
    })
}
