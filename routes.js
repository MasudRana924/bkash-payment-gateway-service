const router = require('express').Router()
const { createPayment, callback, refund } = require('./controller')
const { bkashAuth } = require('./middleware')


router.post('/bkash/payment/create', bkashAuth, createPayment)

router.get('/bkash/payment/callback', bkashAuth, callback)

router.get('/bkash/payment/callback', bkashAuth, callback)

router.get('/bkash/payment/refund/:trxID', bkashAuth, refund)



module.exports = router