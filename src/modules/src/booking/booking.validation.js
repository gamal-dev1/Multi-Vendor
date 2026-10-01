import joi from 'joi'

export const createBookingSchema = joi.object({
    serviceId: joi.string().hex().length(24).required(),
    slotId: joi.string().hex().length(24).required()
})

export const bookingIdSchema = joi.object({
    id: joi.string().hex().length(24).required()
})

export const cancelBookingSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    cancellationReason: joi.string().max(300).required()
})