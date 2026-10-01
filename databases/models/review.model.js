import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema({

    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    service: {
        type: mongoose.Types.ObjectId,
        ref: 'service',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        maxLength: 300,
        trim: true
    }

}, { timestamps: true })

reviewSchema.index({ customer: 1, service: 1 }, { unique: true })

reviewSchema.pre(/^find/, function () {
    this.populate('customer', 'name -_id')
        .populate('service', 'title price')
})

export const reviewModel = mongoose.model('review', reviewSchema)
