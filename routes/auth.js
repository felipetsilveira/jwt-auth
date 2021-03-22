const router = require('express').Router()
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation }= require('../validation')

router.post('/register', async (req, res) => {
    
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Verificar se o usuário está na base de dados
    const emailExist = await User.findOne({
        email: req.body.email
    })
    if(emailExist) return res.status(400).send('Email already exists')

    // Encriptar a senha
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send({ savedUser: savedUser._id })
    } catch(err) {
        send.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    //
    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Email não encontrado')
    //
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Senha incorreta')

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('token-auth', token).send(token)
})

module.exports = router