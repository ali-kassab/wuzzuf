import joi from 'joi';



export const addCompany_valid = {
    body: joi.object({
        companyName: joi.string().trim().required(),
        description: joi.string().trim().max(500).min(10).required(),
        industry: joi.string().trim().required(),
        address: joi.string().trim().required(),
        numberOfEmployees: joi.number().required().min(11).max(20),
        companyEmail: joi.string().trim().required()
    })
}

export const updateCompany_valid = {
    body: joi.object({
        companyName: joi.string().trim(),
        description: joi.string().trim().max(500).min(10),
        industry: joi.string().trim(),
        address: joi.string().trim(),
        numberOfEmployees: joi.number().min(11).max(20),
        companyEmail: joi.string().trim(),
    }).options({ abortEarly: false, allowUnknown: false })
}

export const IdParams_valid = {
    body: joi.object({
        id: joi.string().hex().length(24).required()
    }).options({ abortEarly: false, allowUnknown: false })
}

