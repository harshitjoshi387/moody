const mongoose = require('mongoose')

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('connected to database')
    })

.catch(err=>{
    console.log("Error connecting to DB ",err)
})
}

module.exports = connectToDB