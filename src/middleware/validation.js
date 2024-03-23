import { AppError } from "../../utilites/AppError.js";


const dataMethods = ["body", "params", "query", "headers", "file"]


export const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];

        dataMethods.forEach((key) => {
            if (schema[key]) {
                const validationRes = schema[key].validate(req[key], { abortEarly: false });
                if (validationRes.error) {
                    validationErrors.push(validationRes.error.message);
                }
            }
        });

        if (validationErrors.length) {
            return next(new AppError(validationErrors.join(', '), 422));
        }

        return next();
    };
};