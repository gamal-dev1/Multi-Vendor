import mongoose from 'mongoose'

const serviceSchema = mongoose.Schema({

    title: {
        type: String,
        trim: true,
        required: [true, 'title is required']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [300, 'to long description']
    },
    price: {
        type: Number,
        min: 1,
        required: [true, 'price required']
    },
    duration: {
        type: Number,
        required: true
    },
    vendor: {
        type: mongoose.Types.ObjectId,
        ref: 'vendor',
        required: true
    },

}, { timestamps: true })

serviceSchema.index({ vendor: 1 })

serviceSchema.pre(/^find/, function () {
    this.populate('vendor', 'businessName category')
})

export const serviceModel = mongoose.model('service', serviceSchema)
