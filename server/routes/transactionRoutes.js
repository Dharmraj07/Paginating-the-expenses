const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser");
const Transaction = require("../models/transaction");
const createPayment = require("../controllers/paymentController");
const {
  addTransaction,
  getTransactionByUser,
  getWeeklyTransactions,
  getDailyTransaction,
  getMonthlyTransaction,
  getYearlyTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
//const { Op } = require("sequelize");

router.post("/transaction", authenticateUser, addTransaction);

router.get("/weekly", authenticateUser, getWeeklyTransactions);
router.get("/daily", authenticateUser, getDailyTransaction);
router.get("/monthly",authenticateUser,getMonthlyTransaction);
router.get("/yearly",authenticateUser,getYearlyTransaction);
router.get("/transaction", authenticateUser, getTransactionByUser);
router.delete("/transaction/:id",deleteTransaction);

module.exports = router;
