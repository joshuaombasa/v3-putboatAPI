const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Vendor = require('../models/vendor')

loginRouter.get('/', async (request, response, next) => {
    const { username, password } = request.body

    const vendor = await Vendor.findOne({ username })
    const passwordCorrect = await bcrypt.compare(password, vendor.passwordHash)

    if (!(vendor && passwordCorrect)) {
        return response.status(401).json({ error: 'invalid username pr password' })
    }

    const vendorForToken = {
        username: vendor.username,
        id: vendor._id
    }

    const token = jwt.sign(vendorForToken, process.env.SECRET, {expiresIn: 60*60})
    response.status(200).json({
        token,
        username: vendor.username,
        name: vendor.name,
    })
})

module.exports = loginRouter