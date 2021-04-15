const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String, 
        required : [true , "Please enter product name"],
        trim : true,
        maxLength : [100 , "Product name cannot exceed more than 100 characters"]
    },
    price : {
        type : Number,
        required : [true , "Please  enter product price"],
        maxLength : [5 , "Product price cannot exceed 5 characters"],
        default : 0
    },
    description : {
        type : String,
        required : [true , "Please enter product description"],
    },
    rating : {
        type : Number,
        default : 0 ,
    },
    images : [
        {
            public_id : {
                type : String,
                required : true 
            },
            url : {
                type : String,
                required : true
            }
        }
    ],
    category : {
        type : String,
        required : [true , "Please select product category"],
        enum : {
            values : [
                "Electronics",
                "Laptops",
                "Cameras",
                "Mobile Devices",
                "Gaming Devices",
                "Accessories",
                "Headphones",
                "Food" ,
                "Books",
                "Clothing",
                "Footwear",
                "Beauty/Heath",
                "Sports",
                "Outdoor",
                "Home"
            ],
            message : "Please select correct category for product"
        },
    },
    seller : {
        type : String,
        required : [true , "Please select product seller"]
    },
    stock : {
        type : Number,
        required : [true , "Please enterproduct stock"],
        default :0 ,
        maxLength : [5 , "Stock number cannot exceed 5 characters"],
    },
    numOfReviews : {
        type : Number , 
        required : true
    },
    reviews : [
        {
            name : {
                type : String ,
                required : true
            },
            rating : {
                type : Number ,
                required : true
            },
            comment : {
                type : String ,
                required : true
            }
        }
    ],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    createdOn : {
        type : Date ,
        default : new Date
    }

    
})

module.exports = mongoose.model('Product', productSchema)