const express = require('express')
const router = express.Router()

const { paymentApi, sendStripeKey } = require('../controller/paymentController')
const { isUserAuthenticated, authorizeRoles } = require('../middleware/auth')


router.route("/payment").post(isUserAuthenticated, paymentApi)
router.route("/payment/apikey").get(sendStripeKey)


module.exports = router;