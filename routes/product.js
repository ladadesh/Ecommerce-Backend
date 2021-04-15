const express =  require("express");
const router = require("express").Router()

const {getProducts , newProduct ,getSingleProduct , updateProduct , deleteProduct} = require("../controller/productController")

// exporting authenticating user
const {isUserAuthenticated , authorizeRoles } = require("../middleware/auth")

router.route("/products").get( getProducts)
// router.route("/products").get(isUserAuthenticated ,authorizeRoles('admin') ,    getProducts)

router.route("/admin/product/new").post(isUserAuthenticated ,newProduct)

router.route("/product/:id").get(getSingleProduct)

router.route("/admin/product/:id").put(isUserAuthenticated ,updateProduct)

router.route("/admin/product/delete/:id").delete(isUserAuthenticated ,deleteProduct)

module.exports = router