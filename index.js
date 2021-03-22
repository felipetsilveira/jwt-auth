const express = require('express')
const app = express()
const dotenv= require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

// Conectar com o DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },  () => 
console.log('Conectado com o DB'))

// Middlewares
app.use(express.json())

//Route middlewares
app.use('/api/posts', postRoute)
app.use('/api/user', authRoute)

app.listen(3000, () => console.log('Servidor rodando'))