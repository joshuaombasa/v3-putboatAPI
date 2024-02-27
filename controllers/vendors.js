const Vendor = require('../models/vendor')
const bcrypt = require('bcrypt')
const vendorRouter = require('express').Router()

vendorRouter.get('/', async (request, response, next) => {
    try {
        const vendors = await Vendor.find({})
        response.json(vendors)
    } catch (error) {
        next(error)
    }
})

vendorRouter.get('/:id', async (request, response, next) => {
    try {
        const vendor = await Vendor.findById(request.params.id)
        if (vendor) {
            response.json(vendor)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

vendorRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body

    const saltRounds = 10

    const passwordHash = await bcrypt.hash(password, saltRounds)
    const vendor = new Vendor({
        username,
        name,
        passwordHash
    })
    try {
        const savedVendor = await vendor.save()
        response.status(201).json(savedVendor)
    } catch (error) {
        next(error)
    }
})

vendorRouter.put('/', async (request, response, next) => {
    const { username, name, password } = request.body
    const saltRounds = 10

    const passwordHash = await bcrypt.hash(password, saltRounds)
    const vendor = {
        username,
        name,
        passwordHash
    }
    try {
        const savedVendor = await Vendor.findByIdAndUpdate(
            request.params.id,
            vendor,
            {new: true}
        )

        response.json(savedVendor)
    } catch (error) {
        next(error)
    }
})

vendorRouter.delete('/', async (request, response, next) => {
    try {
        await Vandor.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})


module.exports = vendorRouter