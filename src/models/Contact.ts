import {model, Schema} from 'mongoose'
import {IContact} from "../types";

const ContactUsSchema = new Schema<IContact>({
    fullName: {
        type: String,
        trim: true,
        required: [true, 'fullName is a required field'],
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'fullName is a required field'],
    },
    message: {
        type: String,
        trim: true,
        required: [true, 'fullName is a required field'],
    },
}, {
    timestamps: true,
    versionKey: false,
    minimize: false
})

export default model<IContact>('Contacts', ContactUsSchema)
