const router = require('express').Router()
const { createPayment, callback, refund,createAgreement,agreementCallback, afterAgreementCallback, createPaymentAfterAgreement } = require('./controller')
const { bkashAuth } = require('./middleware')


router.post('/bkash/payment/create', bkashAuth, createPayment);
router.post('/bkash/create/agreement', bkashAuth, createAgreement);
router.post('/bkash/create/agreement/payment',bkashAuth,createPaymentAfterAgreement);

router.get('/bkash/payment/callback', bkashAuth, callback);
router.get('/bkash/agreement/callback', bkashAuth, agreementCallback);
router.get('/bkash/after/agreement/callback', bkashAuth, afterAgreementCallback);

// router.get('/bkash/payment/callback', bkashAuth, callback)

router.get('/bkash/payment/refund/:trxID', bkashAuth, refund)



module.exports = router