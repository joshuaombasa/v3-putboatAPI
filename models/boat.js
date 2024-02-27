const mongoose = require('mongoose')

const boatSchema = new mongoose.Schema({
    name: { type: String, minLength: 5, required: true },
    type: { type: String, minLength: 5, required: true },
    price: { type: String,  required: true },
    vendor:{type: mongoose.Schema.Types.ObjectId, ref: 'Vendor'}
})

boatSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Boat', boatSchema)