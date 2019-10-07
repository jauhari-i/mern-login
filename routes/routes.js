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

app.get('/profile/:id',(req,res) => {
    var id = req.params.id
    User.findById(id,(err,user) => {
        if(err){
            res.json({error: err})
        }else if(user){
            res.json(user)
        }else{
            res.json({error: 'User Not Found'})
        }
    })
})

app.put('/profile/edit/:id',(req,res) => {
    var firstName = req.body.first_name
    var lastName = req.body.last_name
    var email = req.body.email
    var id = req.params.id
    User.findByIdAndUpdate(id,{
        first_name: firstName,
        last_name: lastName,
        email: email
    },(err,ok) => {
        if(err){
            res.json({error: err})
        }else{
            res.json({ success: 'Item updated!' })
        }
    })
})

app.put('/profile/password/:id',(req,res) => {
    var id = req.params.id
    var password = req.body.password
    bcrypt.hash(password,10,(err,hash) => {
        User.findByIdAndUpdate(id,{password: hash},(err,user) => {
            if(err){
                res.json(err)
            }else{
                res.json({success: true})
            }
        })
    })
})

app.get('/todo/:id',(req,res) => {
    var uid = req.params.id
    Todo.find({userId: uid},(err,data) => {
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
    for(var i = 1; i <= 10; i++){
        var newTodo = new Todo()
        newTodo.name = faker.name.firstName(1)
        newTodo.desk = faker.lorem.words(2)
        newTodo.date = moment().add(1,'h').format()
        newTodo.save()
    }
    res.send('faked')
})

app.post('/todo',(req,res) => {
    var name = req.body.todoname
    var deskripsi = req.body.deskripsi
    var date = req.body.datetime
    var uid = req.body.uid
    if(!name){
        res.json({ error: 'Please fill all fields' })
    }else if(!deskripsi){
        var newTodo = new Todo()
        newTodo.name = name
        newTodo.date = date
        newTodo.userId = uid
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
        newTodo.userId = uid
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
    var date = req.body.datetime
    var id = req.params.id
    Todo.findByIdAndUpdate(id,{name: name,desk: deskripsi,date: date},(err,hh) => {
        if(err){
            res.json({error: err})
        }else{
            res.json({ success: 'Data updated'})
        }
    })
})

app.get('/todo/cancel/:id',(req,res) => {
    var id = req.params.id
    Todo.findByIdAndUpdate(id,{done: 0,doneIn: null},(err,db) => {
        if(err){
            res.json({ error: err})
        }else{
            res.json({ success: 'Canceled by user'})
        }
    })
})

app.get('/todo/done/:id',(req,res) => {
    var id = req.params.id
    var today = moment().format()
    // {done: 1,doneIn: today},
    Todo.findById(id,(err,db) => {
        if(err){
            res.json({ error: err })
        }else{
            if(db.date > today){
                Todo.findByIdAndUpdate(id,{done: 1,doneIn: today,dlate: 1},(err,db) => {
                    if(err){
                        res.json({error: err})
                    }else{
                        res.json({ success: 'Done' })
                    }
                })
            }else{
                Todo.findByIdAndUpdate(id,{done: 1,doneIn: today,dlate: 0},(err,db) => {
                    if(err){
                        res.json({error: err})
                    }else{
                        res.json({done: 'Success'})
                    }
                })
            }
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

app.put('/check/password/:id',(req,res) => {
    var id = req.params.id
    var password = req.body.password
    User.findById(id,(err,user) => {
        if(err){
            res.json(err)
        }else{
            if(bcrypt.compareSync(password,user.password)){
                res.json({true: true})
            }else{
                res.json({wrong: true})
            }
        }
    })
})

module.exports = app