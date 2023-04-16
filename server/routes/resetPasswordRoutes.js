const express = require("express");
const { forgotPassword, resetPassword, updatePassword } = require("../controllers/resetpassword");
const router = express.Router();
//const { forgotPassword, resetPassword, updatePassword } = require("../controllers/resetpassword");

router.post('/forgotpassword', forgotPassword);
router.get('/resetpassword/:token', resetPassword);
router.post('/updatepassword', updatePassword);

module.exports = router;
