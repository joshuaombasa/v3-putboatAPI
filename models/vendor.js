const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
    username: {},
    name: {},
    passwordHash: {},
    boats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Boat' }]
})


vendorSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('Vendor', vendorSchema)