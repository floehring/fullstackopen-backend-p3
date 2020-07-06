const express = require('express')
const app = express()
app.use(express.json())

const PORT = 3001

const persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123457",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    // Without casting, id would be a string and the find method wouldn't work
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(`<p> Phonebook has info for ${persons.length} people </p>
            <p>${new Date()}</p>`)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
