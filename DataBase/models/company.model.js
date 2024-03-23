import mongoose from "mongoose";

const schema = mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'companyName is required'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        minLenght: [10, 'too short company description'],
        maxLength: [500, 'too max company description'],
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    numberOfEmployees: {
        type: Number,
        required: true
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true
    },
    company_HR: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


export const companyModel = new mongoose.model('Company', schema)