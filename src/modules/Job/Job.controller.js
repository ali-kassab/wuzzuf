import { jobModel } from "../../../DataBase/models/job.model.js";
import { userModel } from "../../../DataBase/models/user.model.js"
import { AppError } from "../../../utilites/AppError.js"
import { catchError } from "../../middleware/catchError.js"
import { companyModel } from './../../../DataBase/models/company.model.js';
import { ApplicationModel } from './../../../DataBase/models/Application.model.js';
import ExcelJS from 'exceljs';

//Api description
// this function is used to Add new job  
// only Hr can add job and must be found in database and must be have compnay 
// and add new job for his company
export const addJob = catchError(async (req, res, next) => {
    const HRExist = await userModel.findOne({ _id: req.user._id })
    const HrExist_in_Company = await companyModel.findOne({ company_HR: req.user._id })
    if (!HRExist || !HrExist_in_Company) return next(new AppError('HR not found', 401))
    const JobExist = await jobModel.findOne({ jobTitle: req.body.jobTitle, addedBy: req.user._id })
    if (JobExist) return next(new AppError('job allready Exist', 401))
    const newJob = await jobModel.create(req.body)
    newJob.companyName = HrExist_in_Company._id
    newJob.addedBy = req.user._id
    await newJob.save()
    res.json({ msg: 'success', newJob })
})
//Api description
// this function is used to update job only by Hr owner 
//  must be found in database and must be have compnay  and must job Exist
// and update job for his company without id but by  jobExist._id <<<==
export const updateJob = catchError(async (req, res, next) => {
    const HRExist = await userModel.findOne({ _id: req.user._id })
    const HrExist_in_Company = await companyModel.findOne({ company_HR: req.user._id })
    if (!HRExist || !HrExist_in_Company) return next(new AppError('HR not found', 401))
    const JobExist = await jobModel.findOne({ jobTitle: req.body.jobTitle, addedBy: req.user._id })
    if (!JobExist) return next(new AppError('Job not found', 401))
    const updatedJob = await jobModel.findByIdAndUpdate({ _id: JobExist._id }, req.body, { new: true });
    res.json({ msg: 'success', updatedJob })
})

//Api description
// this function is used to delete job
//  must be found in database and must be have compnay and must job Exist
export const deleteJob = catchError(async (req, res, next) => {
    const HRExist = await userModel.findOne({ _id: req.user._id })
    const HrExist_in_Company = await companyModel.findOne({ company_HR: req.user._id })
    if (!HRExist || !HrExist_in_Company) return next(new AppError('HR not found', 401))
    const deletedJob = await jobModel.findOneAndDelete({ _id: req.params.id })  // to delete the specified job
    if (!deletedJob) return next(new AppError('Job not found', 401))
    res.json({ msg: 'success', deletedJob })
})


//Api description 
// this function used to Get all Jobs with their company’s information.
export const getAlJobs = catchError(async (req, res, next) => {
    const jobs = await jobModel.find()
    if (!jobs) return next(new AppError('job not found', 404))
    res.json({ msg: 'success', jobs })
})


//Api description 
// this function used to Get all Jobs for a specific company.
// with edit in schema
export const getAlJobsForCompany = catchError(async (req, res, next) => {
    const jobs = await jobModel.find();
    if (!jobs) return next(new AppError('job not found', 404))
    const company = await companyModel.findOne();
    if (!company) return next(new AppError('company not found', 404))
    const jobsWithCompanyInfo = jobs.map(job => ({
        ...job.toObject(),
        companyInfo: {
            company,
        },
    }));
    res.json({ msg: 'success', jobs: jobsWithCompanyInfo });
})
// //Api description 
// // this function used to Get all Jobs for a specific company.
// export const getAlJobsForCompany = catchError(async (req, res, next) => {
//     const company = await companyModel.findOne({ companyName: req.query.companyName })
//     if (!company) return next(new AppError('company not found', 404))
//     const jobs = await jobModel.find({ companyName: company._id }).populate('companyName')
//     if (!jobs) return next(new AppError('job not found', 404))

//     res.json({ msg: 'success', jobs })
// })

//Api description 
// this function used to Get all Jobs by filter .
//one or more of them should applied
export const getAlJobsmatchFilter = catchError(async (req, res, next) => {

    const filters = {};
    if (req.query.workingTime) {
        filters.workingTime = req.query.workingTime;
    }

    if (req.query.jobLocation) {
        filters.jobLocation = req.query.jobLocation;
    }

    if (req.query.seniorityLevel) {
        filters.seniorityLevel = req.query.seniorityLevel;
    }

    if (req.query.jobTitle) {
        filters.jobTitle = req.query.jobTitle;
    }

    if (req.query.technicalSkills) {
        filters.technicalSkills = { $in: req.query.technicalSkills.split(',') };
    }
    const jobs = await jobModel.find(filters);

    if (!jobs) {
        return next(new AppError('No jobs found for the filters', 404));
    }

    res.json({ msg: 'success', jobs });
});



// Apply to Job
//This API will add a new document in the application Collections with the new data 
//check on jobId and userid   
export const applyTojob = catchError(async (req, res, next) => {
    const jobId = await jobModel.findOne({ _id: req.body.jobId })
    if (!jobId) return next(new AppError('job not found', 404))
    const userId = await userModel.findOne({ _id: req.user._id })
    if (!userId) return next(new AppError('user not found', 404))
    const ExisCv = await ApplicationModel.findOne({ jobId: jobId._id, userId: userId._id })
    if (ExisCv) return next(new AppError(' cv already Exist', 403))
    if (req.file?.filename) {
        req.body.userResume = req.file.path
    }
    const cv = await ApplicationModel.create(req.body)
    cv.userId = userId
    await cv.save()
    res.json({ msg: 'success', cv })
})


//add an endpoint that collects the applications for a specific company on a specific day and create an Excel sheet with this data

export const collectApplicationsAndCreateExcel = catchError(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const companyExist = await companyModel.findOne({ company_HR: req.user._id });
    if (!companyExist) {
        return next(new AppError('Company not found', 404));
    }

    const jobs = await jobModel.find({ addedBy: companyExist.company_HR });
    if (!jobs) {
        return next(new AppError('jobs not found', 404));
    }
    let applications = []

    for (let job of jobs) {

        let application = await ApplicationModel.find({ jobId: job._id }).populate("jobId userId")
        if (application.length > 0) {
            applications.push(application);
        }
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('New Sheet');
    worksheet.columns = [
        { header: 'user name', key: 'name', width: 20 },
        { header: 'resume link', key: 'resume', width: 100 },
        { header: 'job applied to', key: 'job', width: 20 },

    ];

    let data = []
    for (let inapplication of applications) {
        for (let application of inapplication) {
            let dataEntry = { name: application.userId.firstName + ' ' + application.userId.lastName, resume: application.userResume, job: application.jobId.jobTitle }
            data.push(dataEntry)
        }
    }
    worksheet.addRows(data)

    await workbook.xlsx.writeFile('resume.xlsx')
    return res.json(applications)

});












