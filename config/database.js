const mongoose = require("mongoose")

const connectDatabase = () => {

    mongoose.connect(process.env.MONGODB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then((con) =>
        console.log(`Mongoose Database is connected with host: ${con.connection.host}`)
    ).catch((err) => {
        console.log(err);
    })
}

module.exports = connectDatabase