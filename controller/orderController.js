const Order = require("../models/order")
const Product = require("../models/product")

const ErrorHandler = require("../utlis/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")

// create new order 

exports.newOrder = catchAsyncErrors(async (req, res, next) => {

    const {orderItems , shippingInfo , paymentInfo 
        , itemsPrice , shippingPrice , taxPrice 
        , totalPrice } = req.body

    const order = await Order.create({
        orderItems , shippingInfo , paymentInfo 
        , itemsPrice , shippingPrice , taxPrice 
        , totalPrice ,
        paidAt : Date.now() ,
        user : req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
})


// get a single order

exports.getSingleOrder = catchAsyncErrors (async (req, res,next) => {

    const order = await Order.findById(req.params.id).populate("user" , "name email")

    if(!order){
        return next(new ErrorHandler("No order found"),404)
    }

    res.status(200).json({
        success: true,
        order
    })

})

// get user order => my order
exports.getUserOrder = catchAsyncErrors (async (req, res ,next) => {

    const orders = await Order.find({user : req.user.id})


    res.status(200).json({
        success: true,
        orders
    })

})


// get all order => api/v1/admin/allOrders

exports.getAllOrders = catchAsyncErrors (async (req, res, next) => {
    const orders = await Order.find()

   let totalAmount = 0 

    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        orderCount : orders.length,
        totalAmount,
        orders
    })
})


// update a order => api/v1/admin/order/update/:id
exports.updateOrder = catchAsyncErrors (async (req, res, next) =>{
    const order = await Order.findById(req.params.id)

    // here we'll check if the order is deliverede or not
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("Your order is already delivered"),400) 
    }

    // for all the orders of the user
    order.orderItems.forEach(async item => {
         await updateStock(item.product , item.quantity)
    })

    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()

    await order.save()

    res.status(202).json({
        success: true,
    })

})

async function updateStock(id,quantity){
    const product = await Product.findById(id)

    product.stock = product.stock - quantity

    await product.save({validateBeforeSave : false})
}


// delete the user by admin => api/v1/admin/delete
exports.deleteOrder = catchAsyncErrors (async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("No order found"),404)
    }

   await order.remove()

    res.status(200).json({
        success: true,
        msg : "Order deleted successfully."
    })

})
