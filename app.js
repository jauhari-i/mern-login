const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const log = require('morgan')
const app = express()
const port = 3002

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/logreg',{ useNewUrlParser: true, useUnifiedTopology: true }, (err,db) => {
    if(err){
        return err
    }
    console.log('Mongo DB Connected')
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(log('dev'))

var Router = require('./routes/routes')
app.use('/', Router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))