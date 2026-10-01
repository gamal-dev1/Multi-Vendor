import mongoose from 'mongoose'

const paymentSchema = mongoose.Schema({

    booking: {
        type: mongoose.Types.ObjectId,
        ref: "booking",
        required: true,
        unique: true
    },
    method: {
        type: String,
        enum: ['cash', 'card'],
        required: true
    },

    paidAt: Date

}, { timestamps: true })

paymentSchema.pre(/^find/, function () {
    this.populate({
        path: 'booking',
        populate: [
            { path: 'user', select: 'name email phone' },
            { path: 'service', select: 'title price vendor' },
            { path: 'slot', select: 'startAt endAt' }
        ]
    })
})

export const paymentModel = mongoose.model('payment', paymentSchema)
