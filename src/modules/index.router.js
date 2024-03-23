import { JobRouter } from "./Job/Job.router.js"
import { authRouter } from "./auth/auth.router.js"
import { companyRouter } from "./company/company.router.js"
import { userRouter } from "./user/user.router.js"

export const bootstrap = (app) => {

    app.get('/', (req, res) => res.send('welcome in job search app!'))
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/company', companyRouter)
    app.use('/api/v1/Job', JobRouter)
}