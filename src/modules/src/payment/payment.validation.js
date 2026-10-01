import joi from 'joi'

export const createPaymentSchema = joi.object({
    booking: joi.string().hex().length(24).required()
})

export const paymentIdSchema = joi.object({
    id: joi.string().hex().length(24).required()
})
