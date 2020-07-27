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
        response.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => res.json(person))
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0

    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    console.log(body)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    // Check if person already exists in db
    if (persons.find(p => person.name === p.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    persons = persons.concat(person)

    res.json(person)
})

app.get('/info', (request, response) => {
    response.send(`<p> Phonebook has info for ${persons.length} people </p>
            <p>${new Date()}</p>`)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
