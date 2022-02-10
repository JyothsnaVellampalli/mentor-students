const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let dbName = 'users';
let dburl =`mongodb+srv://Jyothsna:Jyothsna123@cluster0.b0dyt.mongodb.net/test/${dbName}`;
module.exports={mongodb,MongoClient,dburl};
