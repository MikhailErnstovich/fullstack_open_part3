require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')

const showAllPersons = async () => {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((el) => console.log(`${el.name} ${el.number}`))
    mongoose.connection.close()
  })
}

const addNewPerson = async () => {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length < 4) {
  showAllPersons()
} else if (process.argv.length < 6) {
  addNewPerson()
}
