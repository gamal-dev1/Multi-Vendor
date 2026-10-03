import crypto from 'crypto'
import { bookingModel } from "../../../../databases/models/booking.model.js"
import { paymentModel } from "../../../../databases/models/payment.model.js"
import { catchAsyncError } from "../../../middleware/catchAsyncError.js"
import { AppError } from "../../../utils/AppError.js"
import { vendorModel } from '../../../../databases/models/vendor.model.js'

const createPayment = catchAsyncError(async (req, res, next) => {
    let booking = await bookingModel.findOne({ _id: req.body.booking, user: req.user._id }).populate('service', 'title')
    if (!booking) return next(new AppError('booking not found', 404))
    if (booking.status === 'cancelled') return next(new AppError('cannot pay for cancelled booking', 400))
    let payment = await paymentModel.findOne({ booking: booking._id })
    if (payment) return next(new AppError('payment already exists', 409))
    let amount = Math.round(booking.totalPrice * 100)
    let response = await fetch(`${process.env.PAYMOB_BASE_URL}/v1/intention/`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount,
            currency: 'EGP',
            payment_methods: [
                Number(process.env.PAYMOB_INTEGRATION_ID)
            ],
            items: [
                {
                    name: booking.service.title,
                    amount,
                    description: `Booking for ${booking.service.title}`,
                    quantity: 1
                }
            ],
            billing_data: {
                first_name: req.user.name,
                last_name: req.user.name,
                email: req.user.email,
                phone_number: req.user.phone,
                apartment: 'NA',
                floor: 'NA',
                building: 'NA',
                street: 'NA',
                shipping_method: 'NA',
                postal_code: 'NA',
                city: 'NA',
                state: 'NA',
                country: 'EG'
            },
            special_reference: booking._id.toString(),
            notification_url: `${process.env.BASE_URL}/api/payment/webhook`,
            redirection_url: `${process.env.BASE_URL}/api/payment/success`
        })
    })
    let responseText = await response.text()
    if (!response.ok) { return next(new AppError(`Paymob error ${response.status}: ${responseText}`, 400)) }
    let data = JSON.parse(responseText)
    payment = await new paymentModel({ booking: booking._id, method: 'card' }).save()
    let checkoutUrl = `${process.env.PAYMOB_BASE_URL}/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${data.client_secret}`
    res.status(200).json({ message: 'success', paymentId: payment._id, checkoutUrl })
})

const paymentWebhook = catchAsyncError(async (req, res) => {
    let { obj } = req.body
    let {
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order,
        owner,
        pending,
        source_data,
        success
    } = obj

    let fields = [
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order.id,
        owner,
        pending,
        source_data.pan,
        source_data.sub_type,
        source_data.type,
        success
    ]

    let hmac = crypto
        .createHmac('sha512', process.env.PAYMOB_HMAC_SECRET)
        .update(fields.join(''))
        .digest('hex')

    if (hmac !== req.query.hmac) return res.status(401).json({ message: 'Invalid HMAC' })
    if (success === true && pending === false) {
        let bookingId = order.merchant_order_id
        let booking = await bookingModel.findById(bookingId)
        if (!booking) return res.status(404).json({ message: 'Booking not found' })
        let payment = await paymentModel.findOne({ booking: booking._id })
        if (!payment) return res.status(404).json({ message: 'Payment not found' })
        if (!payment.paidAt) {
            payment.paidAt = Date.now()
            await payment.save()
        }
    }
    return res.status(200).json({ received: true })
})

const paymentSuccess = catchAsyncError(async (req, res) => {
    res.status(200).json({ message: 'Payment completed, waiting for confirmation' })
})

const paymentCancel = catchAsyncError(async (req, res) => {
    res.status(200).json({ message: 'Payment canceled' })
})

const getPayment = catchAsyncError(async (req, res, next) => {
    let payment = await paymentModel.findById(req.params.id)

    if (!payment) return next(new AppError('payment not found', 404))
    if (req.user.role === 'customer') {
        if (
            payment.booking.user._id.toString() !== req.user._id.toString()
        )
            return next(new AppError('not authorized', 403))
    }
    if (req.user.role === 'owner') {
        let vendor = await vendorModel.findOne({ _id: payment.booking.service.vendor, owner: req.user._id })
        if (!vendor) return next(new AppError('not authorized', 403))
    }
    res.json({ message: 'success', payment })
})

export {
    createPayment,
    paymentWebhook,
    paymentSuccess,
    paymentCancel,
    getPayment
}
