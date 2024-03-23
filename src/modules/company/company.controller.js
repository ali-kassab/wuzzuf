import { ApplicationModel } from "../../../DataBase/models/Application.model.js";
import { companyModel } from "../../../DataBase/models/company.model.js"
import { userModel } from "../../../DataBase/models/user.model.js"
import { AppError } from "../../../utilites/AppError.js"
import { catchError } from "../../middleware/catchError.js"
import { jobModel } from './../../../DataBase/models/job.model.js';


//Api description
// this function is used to Add company with 
// only Hr can add and every hr can add one company only
export const addCompany = catchError(async (req, res, next) => {

    const companyExist = await companyModel.findOne({ company_HR: req.user._id })

    if (companyExist) return next(new AppError('HR can add one only ', 401))
    const ExistHR = await userModel.findOne({ _id: req.user._id })
    if (ExistHR) {
        const newCompany = await companyModel.create(req.body)
        newCompany.company_HR = req.user._id
        await newCompany.save()
        return res.json({ msg: 'success', newCompany })
    } else {
        return next(new AppError('  HR not found ', 401))
    }
})
//Api description
// this function is used to update company and the new data 
// doesn’t conflict with any existing data in your  database
// HR must be in database and and have company find without id but by HR id   <==
export const updateCompany = catchError(async (req, res, next) => {
    const HRExist = await userModel.findOne({ _id: req.user._id })
    const hr_have_company = await companyModel.findOne({ company_HR: req.user._id })
    if (!HRExist || !hr_have_company) return next(new AppError('HR not found', 401))
    const companyExist = await companyModel.findOne({
        $or: [
            { companyEmail: req.body.companyEmail },
            { companyName: req.body.companyName }
        ]
    });
    if (companyExist) {
        return next(new AppError('already exist'), 400)
    }
    const updated = await companyModel.findOneAndUpdate({ companyHR: req.user._id }, req.body, { new: true }).populate('company_HR')
    res.json({ msg: 'success', updated })
})

//Api description
// this function is used to delete company
// HR must be in database and and have company find without id but by HR id   <==
export const deleteCompany = catchError(async (req, res, next) => {
    const HRExist = await userModel.findOne({ _id: req.user._id })
    const hr_have_company = await companyModel.findOne({ company_HR: req.user._id })
    if (!HRExist || !hr_have_company) return next(new AppError('HR not found', 401))
    const companyExist = await companyModel.findOneAndDelete({ companyHR: req.user._id }).populate('company_HR')
    if (!companyExist) return next(new AppError('company not found', 401))
    res.json({ msg: 'success', companyExist })
})

//Api description 
// this function used to Search for a company with a name
export const getCompanyData = catchError(async (req, res, next) => {
    const company = await companyModel.findOne({ _id: req.params.id });
    if (!company) return next(new AppError('company not found', 404))

    const companyJobs = await jobModel.findOne({ companyName: company._id }).populate('companyName')
    console.log(companyJobs);
    if (!companyJobs) return next(new AppError('company has not any jobs', 404))
    res.json({ msg: 'success', companyJobs })
})
//Api description 
// this function used to get Applications For Job
export const getApplicationsForJob = catchError(async (req, res, next) => {
    const job = await jobModel.findOne({ _id: req.params.id });
    if (!job) {
        return next(new AppError('Job not found', 404));
    }
    if (job.addedBy.toString() !== req.user._id.toString()) {
        return next(new AppError('Unauthorized access', 403));
    }
    const userResume = await ApplicationModel.find({ jobId: req.params.id }).populate('userResume', { path: 'userId', select: 'firstName lastName email' }).populate('jobId')
    res.json({ msg: 'Success', userResume });
});


//Api description 
// this function used to Search for a company with a name
export const searchCompany = catchError(async (req, res, next) => {
    const company = await companyModel.find({ companyName: { $regex: req.body.companyName, $options: 'i' } });
    if (!company) return next(new AppError('company name not found', 401))
    res.json({ msg: 'success', company })
})

