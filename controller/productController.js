const Product = require('../models/product')
const errorHandler = require('../utlis/errorHandler')
const asyncErrors = require('../middleware/catchAsyncErrors')
const APIFeatures = require('../utlis/apiFeatures')
const ErrorHandler = require('../utlis/errorHandler')

// for creating a new product => api/v1/product/new
exports.newProduct = asyncErrors(async (req, res, next) => {

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "Avatar",
        width: 150,
        crop: "scale"
        // this crop : scale will maintain the aspect ratio of the image
    })

    req.body.user = req.user.id

    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})

// for getting all the products => api/v1/admin/products
exports.getProducts = asyncErrors(async (req, res, next) => {

    //  return   next(new ErrorHandler("Alert display"),400)

    // this will return product per page
    const resPerPage = 4;
    // this will return the total product count even after pagination limit per page
    const productCount = await Product.countDocuments()

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)


    const products = await apiFeatures.query

    // const products = await Product.find()

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        resPerPage,
        products
    })
})

// for getting a specific product => api/v1/product:id
exports.getSingleProduct = asyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }


    res.status(202).json({
        success: true,
        product
    })
})

// for updating the specific product => api/v1/admin/product/:id

exports.updateProduct = asyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)

    if (!product) {
        return next(new errorHandler("Product not found", 404));

    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})


// for deleting a specific product => api/v1/admin/product/:id/delete

exports.deleteProduct = asyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)

    if (!product) {
        return next(new errorHandler("Product not found", 404));

    }

    product = await Product.findByIdAndDelete(req.params.id)

    res.status(200).json({
        status: true,
        message: "Product deleted successfully."
    })
})