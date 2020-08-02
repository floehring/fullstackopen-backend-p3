require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const PORT = process.env.PORT || 3001

morgan.token("content", req => !req.body ? "" : JSON.stringify(req.body))

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :content"
    )
)

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        }).catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    console.log(body)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => res.json(savedPerson))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    // By default, findByIdAndUpdate() returns the document as it was before update was applied.
    // If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.countDocuments().then(count =>
        response.send(`<p> Phonebook has info for ${count} people </p>
            <p>${new Date()}</p>`))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    // If the error is of type CastError, it gets processed by this errorHandler
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({error: 'malformatted id'})
    }

    // next call passes the error to the next middleware. Since the error handler in this case is the
    // last middleware, it get's passed to the default error handler.
    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
