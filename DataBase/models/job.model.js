import mongoose from "mongoose";

const schema = mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, 'jobTitle is required'],
        trim: true,
    },
    jobLocation: {
        type: String,
        trim: true,
        enum: ['onsite', 'remotely', 'hybrid'],
        default: 'onsite',
        required: true
    },
    workingTime: {
        type: String,
        enum: ['part-time', 'full-time'],
        default: 'full-time',
        required: true
    },
    seniorityLevel: {
        type: String,
        enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
        default: 'Junior',
        required: true
    },
    jobDescription: {
        type: String,
        minLenght: [10, 'too short job Description'],
        maxLength: [3000, 'too max job Description'],
        required: true
    },
    technicalSkills: {
        type: [String],
        required: true,
    },
    softSkills: {
        type: [String],
        required: true,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true })


export const jobModel = new mongoose.model('Job', schema)