const  mongose = require("mongoose")
mongose.set("strictQuery", true);

const connectMongoDb = async(url) =>{
    return mongose.connect(url);
}

module.exports = connectMongoDb;