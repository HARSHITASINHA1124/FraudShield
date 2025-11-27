// backend/services/paymentService.js

exports.processPayment = async (data) => {
  // Simulated Payment Gateway Success
  return {
    status: "success",
    transactionId: "txn_" + Date.now(),
    amount: data.amount,
    processedAt: new Date().toISOString()
  };
};
