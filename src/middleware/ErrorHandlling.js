export const GlobalErrorHandling = (err, req, res, next) => {
    err.status = err.status || 500;
    if (process.env.MODE == 'dev') {
        res.status(err.status).json({ error: err.message, stack: err.stack })
    } else {
        res.status(err.status).json({ error: err.message })
    }

}