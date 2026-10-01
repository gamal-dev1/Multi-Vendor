import joi from 'joi'

export const createReviewSchema = joi.object({
    service: joi.string().hex().length(24).required(),
    comment: joi.string().trim().min(3).max(500).optional(),
    rating: joi.number().min(1).max(5).required(),
})

export const getAllServiceReviewsSchema = joi.object({
    serviceId: joi.string().hex().length(24).required(),

    page: joi.number(),
    sort: joi.string(),
    fields: joi.string(),
    keyword: joi.string(),

    rating: joi.object({
        gte: joi.number(),
        gt: joi.number(),
        lte: joi.number(),
        lt: joi.number()
    })
})

export const updateReviewSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    rating: joi.number().min(1).max(5),
    comment: joi.string().max(300)
})

export const reviewIdSchema = joi.object({
    id: joi.string().hex().length(24).required(),
})
