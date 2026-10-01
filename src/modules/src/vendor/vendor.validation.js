import joi from 'joi'

const workingDaySchema = joi.object({
    isOpen: joi.boolean(),
    start: joi.string().allow(null),
    end: joi.string().allow(null)
})

export const createVendorSchema = joi.object({
    businessName: joi.string().min(2).max(100).trim().required(),
    category: joi.string().min(2).max(50).trim().required(),
    description: joi.string().max(300).trim(),
    address: joi.object({
        city: joi.string().trim(),
        street: joi.string().trim(),
        phone: joi.string().trim()
    }).required(),
    workingHours: joi.object({
        saturday: workingDaySchema,
        sunday: workingDaySchema,
        monday: workingDaySchema,
        tuesday: workingDaySchema,
        wednesday: workingDaySchema,
        thursday: workingDaySchema,
        friday: workingDaySchema
    }).required(),
    isActive: joi.boolean()
})

export const updateVendorSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    businessName: joi.string().min(2).max(100).trim(),
    category: joi.string().min(2).max(50).trim(),
    description: joi.string().max(300).trim(),
    address: joi.object({
        city: joi.string().trim(),
        street: joi.string().trim(),
        phone: joi.string().trim()
    }),
    workingHours: joi.object({
        saturday: workingDaySchema,
        sunday: workingDaySchema,
        monday: workingDaySchema,
        tuesday: workingDaySchema,
        wednesday: workingDaySchema,
        thursday: workingDaySchema,
        friday: workingDaySchema
    }),
    isActive: joi.boolean()
})

export const vendorIdSchema = joi.object({
    id: joi.string().hex().length(24).required()
})