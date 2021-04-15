// this seeder file is used to delete all the products in the database 
// and add all the products in the product.json in data folder


const Product = require('../models/Product')
const dotenv = require("dotenv")
const {connect} = require("mongoose")

const product = require("../data/products.json")
const connectDatabase = require("../config/database")


// setting the dotenv

dotenv.config({ path: "./config/config.env"})

connectDatabase()

const seeder = async () =>{
    try{
        await Product.deleteMany()
        console.log("All products have been deleted.");

        await Product.insertMany(product)
        console.log("All products have been added.");
        process.exit()

    }catch(e){
        console.log(e.message);
        process.exit()
    }
}

seeder()