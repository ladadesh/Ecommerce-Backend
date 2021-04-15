class APIFeatures {
    constructor(query,queryStr){
        // this.query means the Product
        this.query = query
        // this.queryStr means the Product url keyword
        this.queryStr = queryStr

    }


    search(){
        // this keyword is for the value after api/v1/products?keyword=
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword ,
                $options : 'i'
                // i means it will search irrespective of case sensitive
            }
        } : {}

        console.log( "Keyword" , keyword);

        // this will search for the keyword in the products list names
        this.query = this.query.find({...keyword})
        return this ;
    }


    filter(){

        const queryCopy = {...this.queryStr}
        console.log( "Query copy before removing fields", queryCopy);
        // Removing fields from the query
        const removedFields = ['keyword','limit','page']
        removedFields.forEach(el => delete queryCopy[el] )
        console.log("Query copy after removing fields",queryCopy);
        
        // advance filter for price , rating , etc
        let queryString = JSON.stringify(queryCopy)
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}` )
        // gt , gte , lte , lt are the mongo db expression for greater than , greater than equal to and so on

        console.log(  "Query String after inserting the $",queryString);


        this.query = this.query.find(JSON.parse(queryString))
        return this;
    }

    pagination(productPerPage){

        // this will give the current page productP
        const currentPage = Number(this.queryStr.page) || 1
        
        // this will skip the product and jump into next page 
        // lets say productPerPage = 4 than skip will skip the 4 products and return the next 4 product
        const skip = productPerPage * (currentPage - 1)

        // limit will allow only to return number of productPerPage in the current page
        this.query = this.query.limit(productPerPage).skip(skip)
        return this;

    }

}

module.exports = APIFeatures;