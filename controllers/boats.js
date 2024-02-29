const Boat = require('../models/boat')
const boatRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Vendor = require('../models/vendor')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }

    return null
}

boatRouter.get('/', async (request,response, next) => {
    try {
        const boats = await Boat.find({}).populate('vendor', {username: '1', name:'1'})
        response.json(boats)
    } catch (error) {
        next(error)
    }
})

boatRouter.get('/:id', async (request,response, next) => {
    try {
        const boat = await Boat.findById(request.params.id).populate('vendor', {username: '1', name:'1'})
        if (boat) {
            response.json(boat)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

boatRouter.post('/', async(request,response, next) => {
    const {name, type, price}  = request.body 
    const boat = new Boat({
        name,
        type,
        price
    })
    try {
        const savedBoat = await boat.save()
        response.status(201).json(savedBoat)
    } catch (error) {
        next(error)
    }
})

// boatRouter.post('/', async (request,response, next) => {
//     const {name, type, price}  = request.body 
//     const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
//     if (!decodedToken.id) {
//         return response.status(400).json({error: 'invalid token'})
//     }

//     const vendor = await Vendor.findById(decodedToken.id)

//     const newBoat = new Boat({
//         name,
//         type,
//         price
//     })
//     try {
//         const savedBoat = await newBoat.save()
//         vendor.boats = vendor.boats.concat(savedBoat._id)
//         await vendor.save()
//         response.status(201).json(savedBoat)
//     } catch (error) {
//         next(error)
//     }
// })

boatRouter.put('/', async (request,response, next) => {
    const {name, type, price}  = request.body 

    const newBoat = new Boat({
        name,
        type,
        price
    })


    try {
        const updatedBoat = await Boat.findByIdAndUpdate(
            request.params.id,
            newBoat,
            {new: true}
        )
        response.json(updatedBoat)
    } catch (error) {
        next(error)
    }
})

boatRouter.delete('/:id', async (request,response, next) => {
    try {
        await Boat.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})


module.exports = boatRouter