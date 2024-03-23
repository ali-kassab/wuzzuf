import joi from 'joi';



export const addJob_vali = {
    body: joi.object({
        jobTitle: joi.string().trim().required(),
        jobLocation: joi.string().trim().valid('onsite', 'remotely', 'hybrid').default('onsite').required(),
        workingTime: joi.string().valid('part-time', 'full-time').default('full-time').required(),
        seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').default('Junior').required(),
        jobDescription: joi.string().min(10).max(3000).required(),
        technicalSkills: joi.array().items(joi.string()).required(),
        softSkills: joi.array().items(joi.string()).required()
    })
}

export const updateJob_vali = {
    body: joi.object({
        jobTitle: joi.string().trim(),
        jobLocation: joi.string().trim().valid('onsite', 'remotely', 'hybrid').default('onsite'),
        workingTime: joi.string().valid('part-time', 'full-time').default('full-time'),
        seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').default('Junior'),
        jobDescription: joi.string().min(10).max(3000),
        technicalSkills: joi.array().items(joi.string()),
        softSkills: joi.array().items(joi.string()),
    }).options({ abortEarly: false, allowUnknown: false })
}

export const deleteJob_vali = {
    params: joi.object({
        id: joi.string().required().hex().length(24)
    }).options({ abortEarly: false, allowUnknown: false })
}

export const getAlJobsForCompany_vali = {
    body: joi.object({
        companyName: joi.string().trim().required(),
    }).options({ abortEarly: false, allowUnknown: false })
}

export const applyTojob_vali = {
    body: joi.object({
        jobId: joi.string().trim().required().hex().length(24),
        userTechSkills: joi.array().items(joi.string().trim()).required(),
        userSoftSkills: joi.array().items(joi.string().trim()).required(),
        userResume: joi.string().trim().required()
    }).options({ abortEarly: false, allowUnknown: false })
}
