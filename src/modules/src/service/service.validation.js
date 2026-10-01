import joi from 'joi'

export const createServiceSchema = joi.object({
    vendor: joi.string().hex().length(24).required(),
    title: joi.string().min(2).max(100).trim().required(),
    description: joi.string().max(300).trim(),
    price: joi.number().min(0).required(),
    duration: joi.number().positive().required()
})

export const updateServiceSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    title: joi.string().min(2).max(100).trim(),
    description: joi.string().max(300).trim(),
    price: joi.number().min(0),
    duration: joi.number().positive(),
})

export const serviceIdSchema = joi.object({
    id: joi.string().hex().length(24).required()
})