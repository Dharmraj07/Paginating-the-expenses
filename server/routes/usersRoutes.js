const express = require("express");
const { createUser, loginUser, allTransaction } = require("../controllers/usersController");
const createPayment = require("../controllers/paymentController");
const authenticateUser = require("../middlewares/authenticateUser");
const { downloadTransactions } = require("../controllers/download");

const router = express.Router();


router.post('/signin', loginUser);
router.post('/signup', createUser);
router.post('/payment',authenticateUser,createPayment);
router.get('/alltransaction',allTransaction);
router.get('/download/:id',downloadTransactions);

module.exports = router;