import mongoose from "mongoose"

const slotSchema = mongoose.Schema({
    service: {
        type: mongoose.Types.ObjectId,
        ref: 'service',
        required: true
    },
    startAt: {
        type: Date,
        required: true
    },
    endAt: {
        type: Date,
        required: true
    }

}, { timestamps: true })

slotSchema.pre(/^find/, function () {
    this.populate('service', 'title price duration vendor')
})

export const slotModel = mongoose.model('slot', slotSchema)
