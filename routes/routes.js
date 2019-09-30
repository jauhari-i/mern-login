const express = require('express')
const app = express.Router()
const Todo = require('../models/Todos')
const User = require('../models/User')
const cors = require('cors')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const faker = require('faker')

app.use(cors())

process.env.SCRET_KEY = "secret"

app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

app.post('/register', (req,res) => {
    const UserData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
    }
    
    User.findOne({email: req.body.email},(err,user) => {
        if(err){
            return err
        }else if(user){
            res.json({
                error: "User Already Exists"
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err,hash) => {
                UserData.password = hash
                User.create(UserData)
                    .then(user => {
                        res.json({ status: user.email + ' registred!' })
                    })
                    .catch(err => {
                        res.send("error: " + err)
                    })
            })
        }
    })
})

app.post('/login',(req,res) => {
    User.findOne({email: req.body.email}, (err,user) => {
        if(err){
            res.send("error: "+ err)
        }else if(user){
            if(bcrypt.compareSync(req.body.password, user.password)){
                const payload = {
                    _id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
                let token = jwt.sign(payload,process.env.SCRET_KEY, {
                    expiresIn: 1440
                })
                res.send(token)
            }else{
                res.json({
                    error: "Wrong Password"
                })
            }
        }else{
            res.json({
                error: "User Not Exist" 
            })
        }
    })
})

app.get('/profile',(req,res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SCRET_KEY)

    User.findOne({
        _id: decoded._id
    },(err,user) => {
        if(err){
            res.send("error: " +err)
        }else if(user){
            res.json(user)
        }else{
            res.send("Usern Not Exist")
        }
    })
})

app.get('/todo',(req,res) => {
    var date = new Date()
    // console.log(date)
    Todo.find({},(err,data) => {
        if(err){
            res.json({ error: err})
        }else if(data){
            res.json({ todo: data })
        }else{
            res.json({ error: 'No Data Found' })
        }
    })
})

app.get('/faketodos',(req,res) => {
    for(var i = 1; i < 10; i++){
        var newTodo = new Todo()
        newTodo.name = faker.name.firstName(1)
        newTodo.desk = faker.lorem.words(2)
        newTodo.date = Date.now()
        newTodo.save()
    }
    res.send('faked')
})

app.post('/todo',(req,res) => {
    var name = req.body.todoname
    var deskripsi = req.body.deskripsi
    var date = req.body.datetime
    if(!name){
        res.json({ error: 'Please fill all fields' })
    }else if(!deskripsi){
        var newTodo = new Todo()
        newTodo.name = name
        newTodo.date = date
        newTodo.save((err) => {
            if(err){
                res.json({ error: err})
            }else{
                res.json({ success: 'Todos Added' })
            }
        })
    }else{
        var newTodo = new Todo()
        newTodo.name = name
        newTodo.desk = deskripsi
        newTodo.date = date
        newTodo.save((err) => {
            if(err){
                res.json({ error: err})
            }else{
                res.json({ success: 'Todos Added' })
            }
        })
    }
})

app.put('/todo/:id',(req,res) => {
    var name = req.body.todoname
    var deskripsi = req.body.deskripsi
    var id = req.params.id
    Todo.findByIdAndUpdate(id,{name: name,desk: deskripsi},(err,hh) => {
        if(err){
            res.json({error: err})
        }else{
            res.json({ success: 'Data updated'})
        }
    })
})

app.delete('/todo/:id',(req,res) => {
    var id = req.params.id
    Todo.findByIdAndRemove(id,(err,success) => {
        if(err){
            res.json({ error: err})
        }else{
            res.json({ success: 'Data Deleted' })
        }
    })
})

module.exports = app