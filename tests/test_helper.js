const Boat = require('../models/boat')
const someBoats = [
    {
        name: 'Grand Elator',
        type: 'Luxury',
        price: '5000'
    },
    {
        name: 'Etat Major',
        type: 'Business',
        price: '3500'
    }
]

const allBoatsInDB = async() => {
    const boats = await Boat.find({})
    const boatsDataToSend = boats.map(boat => boat.toJSON())
    return boatsDataToSend
}

const nonExistentID = async() => {
    const boat = new Boat(
        {
            name: 'piker',
            type: 'basic',
            price: '1000'
        }
    )

    const savedBoat = await boat.save()
    await Boat.findByIdAndDelete(savedBoat._id)
    return savedBoat._id.toString()
}

module.exports = {
    someBoats,
    allBoatsInDB,
    nonExistentID
}