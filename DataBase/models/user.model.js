import mongoose from "mongoose";
import bcrypt from "bcrypt";
const schema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'lastName is required'],
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        validate: {
            validator: function (v) {
                return v || this.mobileNumber;
            },
            message: ' email or mobileNumber is required',
        },
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    mobileNumber: {
        type: String,
        trim: true,
        unique: true,
        validate: {
            validator: function (v) {
                return v || this.email;
            },
            message: ' email or mobileNumber is required',
        },
    },
    recoverEmail: {
        type: String,
        required: [true, 'recover email is required'],
        trim: true,
    }, DOB: {
        type: Date,
        required: [true, 'DOB is required'],
    },
    role: {
        type: String,
        enum: ['user', 'company_HR'],
        default: 'user',
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
        lowercase: true
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    }, passwordChangedAt: Date,
    OTP: {
        type: String,
    }
}, { timestamps: true })

schema.pre('save', function () {
    if (this.password) this.password = bcrypt.hashSync(this.password, 8)
})
schema.pre('findOneAndUpdate', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 8)
})

export const userModel = new mongoose.model('User', schema)