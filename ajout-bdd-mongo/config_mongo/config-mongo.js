//*************************************************************IMPORTS_ET_ATTRIBUTS**************************************************************************************************************************
var mongoose = require('mongoose');  // npm install -s mongoose
var varenv = require('dotenv').config();

var mongoPath = process.env.PATH_MONGO;

var mongoDbUrl = process.env.MONGO_DB_URL || mongoPath;


//*************************************************************CONNECT_MONGODB**************************************************************************************************************************
mongoose.connect(
    mongoDbUrl, {
        useNewUrlParser: true, 
        useUnifiedTopology: true , 
        dbName : 'spectacles'
    }
);

const myDBsalles = mongoose.connection;

myDBsalles.on('error' , function() { 
    console.log("Erreeeeeeeeeeeeeeeeeeeeeur connection error = " + " for dbUrl=" + mongoDbUrl)
});

myDBsalles.once('open', function() {
    console.log("Connecteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" );
});

module.exports.myDBsalles = myDBsalles ;