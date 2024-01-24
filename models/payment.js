const Payment = require("../schema/paymentSchema");
const createPayment = async (data) => {
  const newPayment = new Payment(data);
  const createdNewPayment = await newPayment.save();
  return createdNewPayment;
};
const findPaymentByTRXID = async (trxID) => {
    const payment = await Payment.findOne({ trxID }).lean();
    return payment;
  };
module.exports={
    createPayment,
    findPaymentByTRXID
}