const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const api = supertest(app)
const helper = require('./test_helper')
const Boat = require('../models/boat')


beforeEach(async () => {
    await Boat.deleteMany({})
    for (let boat of helper.someBoats) {
        let boatObject = new Boat(boat)
        await boatObject.save()
    }
    // const boatObjects = helper.someBoats.map(boat => new Boat(boat))
    // const promisesArray = boatObjects.map(boat => boat.save)
    // await Promise.all(promisesArray)
})

describe('when there is initially some boats', () => {
    test('boats are returned as json', async () => {
        await api.get('/api/boats')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all boats are returned', async () => {
        const result = await api.get('/api/boats')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(result.body).toHaveLength(helper.someBoats.length)
    })

    test('a specific boat is within the returned boats', async () => {
        const result = await api.get('/api/boats')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const names = result.body.map(r => r.name)
        expect(names).toContain('Etat Major')
    })
})

describe('viewing a specific boat', () => {

    test('succeeds with a valid id', async () => {
        const boatsAtStart = await helper.allBoatsInDB()
        const boatToSearch = boatsAtStart[0]
        const result = await api.get(`/api/boats/${boatToSearch.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(result.body).toEqual(boatToSearch)
    })

    test('fails with a status code 404 if id does not exist', async () => {
        const nonExistentID = await helper.nonExistentID()
        await api.get(`/api/boats/${nonExistentID}`)
            .expect(404)
    })

    test('fails with a status code 400 if id is invalid', async () => {
        const invalidID = 'ff34f43g34gf3fc34f'
        await api.get(`/api/boats/${invalidID}`)
            .expect(400)
    })
})

describe('addition of a new boat', () => {
    test('succeeds with valid data', async () => {
        const boatsAtStart = await helper.allBoatsInDB()
        const newBoat = {
            name: 'Grand Mulla',
            type: 'rugged',
            price: '5000'
        }
        const response = await api.post(`/api/boats`)
            .send(newBoat)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const boatsAtEnd = await helper.allBoatsInDB()

        expect(boatsAtEnd).toHaveLength(boatsAtStart.length + 1)
        const names = boatsAtEnd.map(b => b.name)
        expect(names).toContain('Grand Mulla')
    })

    test('fails with statuscode 400 if data is invalid', async () => {
        const boatsAtStart = await helper.allBoatsInDB()
        const badData = {
            type: 'rugged',
            price: '5000'
        }
        await api.post('/api/boats')
            .send(badData)
            .expect(400)

        const boatsAtEnd = await helper.allBoatsInDB()
        expect(boatsAtEnd).toHaveLength(boatsAtStart.length)
    })
})

describe('deletion of a boat', () => {
    test('succeeds with statuscode 204 if id is valid', async () => {
        const boatsAtStart = await helper.allBoatsInDB()
        const boatToDelete = boatsAtStart[0]
        await api.delete(`/api/boats/${boatToDelete.id}`)
            .expect(204)
        const boatsAtEnd = await helper.allBoatsInDB()
        expect(boatsAtEnd).toHaveLength(boatsAtStart.length - 1)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})