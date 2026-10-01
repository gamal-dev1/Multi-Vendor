import mongoose from 'mongoose'

const workingDaySchema = mongoose.Schema({
    isOpen: {
        type: Boolean,
        default: true
    },
    start: {
        type: String,
        default: null
    },
    end: {
        type: String,
        default: null
    }
}, { _id: false })


const vendorSchema = mongoose.Schema({

    businessName: {
        type: String,
        trim: true,
        required: [true, 'businessName is required'],
        unique: [true, 'businessName Already exists']
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'category is required']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [300, 'to long description'],
    },
    address: {
        city: String,
        street: String,
        phone: String
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    workingHours: {
        saturday: workingDaySchema,
        sunday: workingDaySchema,
        monday: workingDaySchema,
        tuesday: workingDaySchema,
        wednesday: workingDaySchema,
        thursday: workingDaySchema,
        friday: workingDaySchema
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

vendorSchema.index({ category: 1 })

export const vendorModel = mongoose.model('vendor', vendorSchema)
