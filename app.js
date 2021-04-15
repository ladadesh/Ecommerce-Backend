const express = require("express")
const app = express()
const errorMiddleware = require("./middleware/error")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const bodyparser = require("body-parser")
const fileUpload = require("express-fileupload")





app.use(express.json())

app.use(bodyparser.urlencoded({ extended: true }))
// cookie-parser is user to access the token stored in the cookie and 
app.use(cookieParser())
app.use(fileUpload())

app.use(cors())


// import all the product routes
const products = require("./routes/product")
// import all the user routes
const user = require("./routes/user")
// import all the order routes
const order = require("./routes/order")
const payment = require("./routes/payment")


app.use("/api/v1", products)
app.use("/api/v1", payment)
app.use("/api/v1", user)
app.use("/api/v1", order)


// Middleware to handle errors
app.use(errorMiddleware);


module.exports = app