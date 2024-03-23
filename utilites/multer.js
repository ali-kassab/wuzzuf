import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../utilites/AppError.js";

export const fileUpload = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'upload.CV/')
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + '-' + file.originalname)
        }
    })
    
    const fileFilter = (req, file, cb) => {
        if (file.originalname.endsWith('.pdf')) {
            cb(null, true)
        } else {
            cb(new AppError('Only file pdf', 401), false)
        }
    }
    const upload = multer({ storage, fileFilter })
    return upload
}
export const uploadSingleFile = (fieldname) => fileUpload().single(fieldname)
