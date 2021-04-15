const asyncErrors = require("../middleware/catchAsyncErrors")
const stripe = require("stripe")("sk_test_51HRAm9IDSkh9QoquQLZGp1JtIDsGwh5MYr5MAY4NRS4JMUZR6rdbl1UnuKT5hAJNqkVG79A0A41pdPORrrPJCaZc00q89yFGvJ")

exports.paymentApi = asyncErrors(async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntent.create({
        amount: req.body.amount,
        currency: 'inr',


        metadata: { integration_check: 'accept_a_payment' }
    })

    res.status(200).json({
        success: true,
        client_Secret: paymentIntent.client_Secret
    })

})

exports.sendStripeKey = asyncErrors(async (req, res, next) => {



    res.status(200).json({
        stripeAPIKey: "pk_test_51HRAm9IDSkh9QoquX1VoPunEw2psIyzADy6JYcstP4nLByVsfk2HsEoEJnkntUEY9Be53xxAEwz4dv4hzH8113Hc00lLIHUqCL",
        success: true

    })

})

