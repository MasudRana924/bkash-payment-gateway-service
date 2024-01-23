const axios = require('axios');
const paymentModel = require('./model');
const globals = require('node-global-storage');
const { v4: uuidv4 } = require('uuid');

const getBkashHeaders = async () => {
    return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: globals.get('id_token'),
        'x-app-key': process.env.BKASH_API_KEY,
    };
};

const createPayment = async (req, res) => {
    const { amount, userId } = req.body;
    globals.set('userId', userId);
    try {
        const { data } = await axios.post(process.env.BKASH_CREATE_PAYMENT_URL, {
            mode: '0011',
            payerReference: ' ',
            callbackURL: 'http://localhost:5000/api/bkash/payment/callback',
            amount: amount,
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: 'Inv' + uuidv4().substring(0, 5),
        }, {
            headers: await getBkashHeaders(),
        });

        return res.status(200).json({ bkashURL: data.bkashURL });
    } catch (error) {
        return res.status(500).json({ error: 'Payment creation failed' });
    }

};

const callback = async (req, res) => {
    const { paymentID, status, } = req.query;
    if (status === 'cancel' || status === 'failure') {
        return res.redirect(`http://localhost:3000/error?message=${status}`);
    }

    if (status === 'success') {
        try {
            const { data } = await axios.post(process.env.BKASH_EXECUTE_PAYMENT_URL, { paymentID }, {
                headers: await getBkashHeaders(),
            });
            if (data && data.statusCode === '0000') {
                const userId = globals.get('userId');
                // await paymentModel.create({
                //     userId: userId,
                //     paymentID,
                //     trxID: data.trxID,
                //     date: data.paymentExecuteTime,
                //     amount: parseInt(data.amount),
                // });

                return res.redirect('http://localhost:3000/success');
            } else {
                return res.redirect(`http://localhost:3000/error?message=${data.statusMessage}`);
            }
        } catch (error) {
            console.error("error", error);
            return res.redirect(`http://localhost:3000/error?message=${error.message}`);
        }
    }
};

const refund = async (req, res) => {
    // const { trxID } = req.params;

    // try {
    //     const payment = await paymentModel.findOne({ trxID });

    //     const { data } = await axios.post(process.env.BKASH_REFUND_TRANSACTION_URL, {
    //         paymentID: payment.paymentID,
    //         amount: payment.amount,
    //         trxID,
    //         sku: 'payment',
    //         reason: 'cashback',
    //     }, {
    //         headers: await getBkashHeaders(),
    //     });

    //     if (data && data.statusCode === '0000') {
    //         return res.status(200).json({ message: 'Refund success' });
    //     } else {
    //         return res.status(500).json({ error: 'Refund failed' });
    //     }
    // } catch (error) {
    //     return res.status(500).json({ error: 'Refund failed' });
    // }
};
const createAgreement = async (req, res) => {

    const { amount, userId } = req.body;
    globals.set('userId', userId);
    console.log("agreement api amount", amount);

    try {
        const { data } = await axios.post(process.env.BKASH_CREATE_PAYMENT_URL, {
            mode: '0000',
            payerReference: ' ',
            agreementID: '',
            callbackURL: 'http://localhost:5000/api/bkash/agreement/callback',
            amount: amount,
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: 'Inv' + uuidv4().substring(0, 5),
        }, {
            headers: await getBkashHeaders(),
        });

        return res.status(200).json({ bkashURL: data.bkashURL });
    } catch (error) {
        return res.status(500).json({ error: 'Payment creation failed' });
    }

};
const agreementCallback = async (req, res) => {
    const { paymentID, status } = req.query;
    if (status === 'cancel' || status === 'failure') {
        return res.redirect(`http://localhost:3000/error?message=${status}`);
    }
    if (status === 'success') {
        try {
            const { data } = await axios.post(process.env.BKASH_EXECUTE_PAYMENT_URL, { paymentID }, {
                headers: await getBkashHeaders(),
            });
            req.session.agreementId = data.agreementID;
            console.log(req.session.agreementId);

            if (data && data.statusCode === '0000') {
                return res.redirect('http://localhost:3000/success');
            } else {
                return res.redirect(`http://localhost:3000/error?message=${data.statusMessage}`);
            }
        } catch (error) {
            console.error("error", error);
            return res.redirect(`http://localhost:3000/error?message=${error.message}`);
        }
    }
};

const createPaymentAfterAgreement = async (req, res) => {
    try {
        const agreementId = req.session.agreementId;
        console.log(agreementId);
        if (!agreementId) {
            return res.status(400).json({ error: 'Agreement ID not found' });
        }
        const amount = req.body.amount;
        const { data } = await axios.post(process.env.BKASH_CREATE_PAYMENT_URL, {
            mode: '0001',
            payerReference: ' ',
            agreementId: agreementId,
            callbackURL: 'http://localhost:5000/api/bkash/after/agreement/callback',
            amount: amount,
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: 'Inv' + uuidv4().substring(0, 5),
        }, {
            headers: await getBkashHeaders(),
        });
        return res.status(200).json({ bkashURL: data.bkashURL });
    } catch (error) {
        console.error('Error creating payment after agreement:', error);
        return res.status(500).json({ error: 'Payment initiation failed' });
    }
};
const afterAgreementCallback = async (req, res) => {
    const { paymentID, status } = req.query;
    if (status === 'cancel' || status === 'failure') {
        return res.redirect(`http://localhost:3000/error?message=${status}`);
    }

    if (status === 'success') {
        try {
            const { data } = await axios.post(process.env.BKASH_EXECUTE_PAYMENT_URL, { paymentID }, {
                headers: await getBkashHeaders(),
            });
            console.log("data-----", data);
            if (data && data.statusCode === '0000') {
                return res.redirect('http://localhost:3000/success');
            } else {
                return res.redirect(`http://localhost:3000/error?message=${data.statusMessage}`);
            }
        } catch (error) {
            console.error("error", error);
            return res.redirect(`http://localhost:3000/error?message=${error.message}`);
        }
    }
};
module.exports = {
    createPayment,
    callback,
    refund,
    createAgreement,
    agreementCallback,
    createPaymentAfterAgreement,
    afterAgreementCallback
};