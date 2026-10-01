import express from 'express'
import * as vendor from './vendor.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validation } from '../../../middleware/validation.js'
import { createVendorSchema, updateVendorSchema, vendorIdSchema } from './vendor.validation.js'


const vendorRouter = express.Router()

vendorRouter.route('/')
    .post(protectedRoutes, allowedTo('owner'), validation(createVendorSchema),vendor.createVendor)
    .get(vendor.getAllVendors)

vendorRouter.get('/myVendors', protectedRoutes, allowedTo('owner'), vendor.getMyVendors)

vendorRouter.route('/:id')
    .get(validation(vendorIdSchema), vendor.getVendor)
    .put(protectedRoutes, allowedTo('owner'), validation(updateVendorSchema), vendor.updateVendor)
    .delete(protectedRoutes, allowedTo('owner', 'admin'), validation(vendorIdSchema), vendor.deleteVendor)

export default vendorRouter