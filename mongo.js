const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://floeh:${password}@cluster0.mgukg.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    // no additional arguments -> print all persons in phonebook
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        // Dont close the connection after the for loop, since it then will be closed immediately after the loop,
        // disregarding the asynchronous nature of getting the persons. -> connection closes before getting the
        // persons finishes
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    // add person to database
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(() => {
        console.log(`person ${person} saved!`)
        mongoose.connection.close()
    })
} else {
    // wrong amount of arguments
    console.log('Wrong arguments. Usage is: node mongo.js <password> [name number]')
}


