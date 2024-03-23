import express from 'express'
import dotenv from 'dotenv'
import { AppError } from './utilites/AppError.js';
import { DBconnection } from './DataBase/connection.js';
import { bootstrap } from './src/modules/index.router.js';
import cors from 'cors'
import { GlobalErrorHandling } from './src/middleware/globalErrorHandlling.js';
dotenv.config()
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))



bootstrap(app)
DBconnection()

app.use('*', (req, res, next) => {
    next(new AppError(`not found ${req.originalUrl}`, 404))
})
app.use(GlobalErrorHandling)
process.on('unhandledRejection', (err) => {   // out Express
    console.log('error', err);
})
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))