const express = require('express')
const router = express.Router()

const { newOrder ,getUserOrder , getSingleOrder , getAllOrders , deleteOrder , updateOrder } = require('../controller/orderController')
const { isUserAuthenticated , authorizeRoles } = require('../middleware/auth')


router.route("/order/new").post(isUserAuthenticated , newOrder)
router.route("/order/userorder").get(isUserAuthenticated , getUserOrder)
router.route("/order/:id").get(isUserAuthenticated , getSingleOrder)


router.route("/admin/order/update/:id").put(isUserAuthenticated , authorizeRoles('admin') , updateOrder)

router.route("/admin/order/delete/:id").delete(isUserAuthenticated , authorizeRoles('admin') , deleteOrder)

router.route("/admin/orders").get(isUserAuthenticated ,authorizeRoles('admin') , getAllOrders)

module.exports = router; 