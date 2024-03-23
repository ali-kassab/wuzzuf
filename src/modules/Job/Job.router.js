import express from 'express';
import { allowedTo, authorization } from '../../middleware/protectedRoutes.js';
import { validation } from '../../middleware/validation.js';
import { addJob_vali, applyTojob_vali, deleteJob_vali, getAlJobsForCompany_vali, updateJob_vali } from './Job.validation.js';
import { addJob, applyTojob, collectApplicationsAndCreateExcel, deleteJob, getAlJobs, getAlJobsForCompany, getAlJobsmatchFilter, updateJob } from './Job.controller.js';
import { uploadSingleFile } from '../../../utilites/multer.js';




export const JobRouter = express.Router({ mergeParams: true })


JobRouter.route('/')
    .post(authorization, allowedTo('company_HR'), validation(addJob_vali), addJob)
    .put(authorization, allowedTo('company_HR'), validation(updateJob_vali), updateJob)
    .get(authorization, getAlJobs)
JobRouter.route('/filter').get(authorization, getAlJobsmatchFilter)
JobRouter.route('/jobForCompany').get(authorization, validation(getAlJobsForCompany_vali), getAlJobsForCompany)
JobRouter.route('/applyJob').post(authorization, allowedTo('user'), uploadSingleFile('userResume'), validation(applyTojob_vali), applyTojob)
JobRouter.route('/collect_cvs').get(authorization, allowedTo('company_HR'), collectApplicationsAndCreateExcel)

JobRouter.route('/:id')
    .delete(authorization, allowedTo('company_HR'), validation(deleteJob_vali), deleteJob)

