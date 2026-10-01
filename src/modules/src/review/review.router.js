import express from 'express'
import *as reviews from './review.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validation } from '../../../middleware/validation.js'
import *as valid from './review.validation.js'

const reviewRouter = express.Router()

reviewRouter.route('/')
    .post(protectedRoutes, allowedTo('customer'), validation(valid.createReviewSchema), reviews.createReview)

reviewRouter.route('/myReviews')
    .get(protectedRoutes, allowedTo('customer'), reviews.getMyReviews)

reviewRouter.route('/:serviceId')
    .get(validation(valid.getAllServiceReviewsSchema), reviews.getAllServiceReviews)

reviewRouter.route('/:id')
    .patch(protectedRoutes, allowedTo('customer'), validation(valid.updateReviewSchema), reviews.updateReview)
    .delete(protectedRoutes, allowedTo('customer', 'admin'), validation(valid.reviewIdSchema), reviews.deleteReview)

export default reviewRouter