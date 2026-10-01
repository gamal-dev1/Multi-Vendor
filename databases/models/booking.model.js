import mongoose from 'mongoose'

const bookingSchema = mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    vendor: {
        type: mongoose.Types.ObjectId,
        ref: 'vendor',
        required: true
    },
    service: {
        type: mongoose.Types.ObjectId,
        ref: 'service',
        required: true
    },
    slot: {
        type: mongoose.Types.ObjectId,
        ref: 'slot',
        required: true
    },
    bookingAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['completed', 'cancelled'],
        default: 'completed'
    },
    cancellationReason: {
        type: String,
        trim: true,
        maxLength: 300
    },
    totalPrice: Number,

}, { timestamps: true })

bookingSchema.pre(/^find/, function () {
    this.populate('user', 'name email phone')
    this.populate('service', 'title price duration vendor')
    this.populate('service.vendor', 'owner')
    this.populate('slot', 'startAt endAt')
})

export const bookingModel = mongoose.model('booking', bookingSchema)
