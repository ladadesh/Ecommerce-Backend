const app = require("./app")
const connectDatabase = require("./config/database")
const dotenv = require("dotenv")
const cloudinary = require("cloudinary")

// handling uncaught exceptions
// uncaught exceptions are those when some variables are not defined 
process.on("uncaughtException", err => {
    console.log(`Error : ${err.stack}`);
    console.log("Shutting down server due to uncaught Exception");
    process.exit(1)
})

//setting the dotenv config
dotenv.config({ path: "./config/config.env" })


// connecting to database
connectDatabase();

// setting up cloudinary server

cloudinary.config({
    cloud_name: "dafwcw9ux",
    api_key: "727282434434829",
    api_secret: "DUpjIrzhgRE7qvW57w35UoJKH1Y"
})

// console.log(a);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port : ${process.env.PORT} and is in ${process.env.NODE_ENV} mode.`);
})

// handling unhandled Promise rejection

process.on("unhandledRejection", err => {
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1)
    })
})


