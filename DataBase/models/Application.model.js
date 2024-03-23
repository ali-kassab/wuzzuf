import mongoose from "mongoose";

const schema = mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userTechSkills: {
        type: [String],
        required: true
    },
    userSoftSkills: {
        type: [String],
        required: true
    },
    userResume: {
        type: String,
        required: true
    }
}, { timestamps: true })


schema.post('save', (doc) => {
    doc.userResume ? doc.userResume = 'http://localhost:3000/' + "upload.CV/" + doc.userResume : null
})
export const ApplicationModel = mongoose.model('Application', schema);

