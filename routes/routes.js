const router = require('express').Router()
const { createPayment, callback, refund, createAgreement, agreementCallback, afterAgreementCallback, createPaymentAfterAgreement } = require('../controller/controller')
const { bkashAuthMiddleware } = require('../middleware/middleware');

router.post('/bkash/payment/create', bkashAuthMiddleware, createPayment);
router.post('/bkash/create/agreement', bkashAuthMiddleware, createAgreement);
router.post('/bkash/create/agreement/payment', bkashAuthMiddleware, createPaymentAfterAgreement);
router.get('/bkash/payment/callback', bkashAuthMiddleware, callback);
router.get('/bkash/agreement/callback', bkashAuthMiddleware, agreementCallback);
router.get('/bkash/after/agreement/callback', bkashAuthMiddleware, afterAgreementCallback);
router.get('/bkash/payment/refund/:trxID', bkashAuthMiddleware, refund);

module.exports = router