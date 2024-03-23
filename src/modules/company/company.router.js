import express from 'express';
import { allowedTo, authorization } from '../../middleware/protectedRoutes.js';
import { validation } from '../../middleware/validation.js';
import { addCompany, deleteCompany, getApplicationsForJob, getCompanyData, searchCompany, updateCompany } from './company.controller.js';
import { IdParams_valid, addCompany_valid, updateCompany_valid } from './company.validation.js';



export const companyRouter = express.Router({ mergeParams: true })


companyRouter.route('/')
    .post(authorization, allowedTo('company_HR'), validation(addCompany_valid), addCompany)
    .put(authorization, allowedTo('company_HR'), validation(updateCompany_valid), updateCompany)

companyRouter.get('/search', authorization, searchCompany)

companyRouter.route('/:id')
    .delete(authorization, allowedTo('company_HR'), deleteCompany)
    .get(authorization, allowedTo('company_HR'), validation(IdParams_valid), getCompanyData)

companyRouter.route('/applicationsForJob/:id').get(authorization, allowedTo('company_HR'), validation(IdParams_valid), getApplicationsForJob)

