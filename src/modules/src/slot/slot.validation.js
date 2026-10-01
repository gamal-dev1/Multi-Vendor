import joi from 'joi'

export const generateSlotSchema = joi.object({
    service: joi.string().hex().length(24).required(),
    date: joi.date().greater('now').required()
})

export const getSlotsSchema = joi.object({
    service: joi.string().hex().length(24).required(),
    date: joi.date().required()
})

export const slotIdSchema = joi.object({
    id: joi.string().hex().length(24).required()
})
