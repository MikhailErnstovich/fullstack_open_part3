require('dotenv').config()
const errorHandler = require('./errorHandler')
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())

morgan.token('post-data', (req) =>
  req.method.toLowerCase() === 'post' ? `body: ${JSON.stringify(req.body)}` : ''
)

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-data'
  )
)

app.use(express.static('dist'))

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then((result) => response.json(result))
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((err) => next(err))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((length) => {
      response.send(`<div>
      <div>Phonebook has info for ${length} people<div>
      <div>${new Date(Date.now())}</div>
    </div>`)
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then((person) => {
      if (person) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch((err) => next(err))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  if (!name) {
    response.status(400).send({ error: 'name must be specified' }).end()
  } else if (!number) {
    response.status(400).send({ error: 'number must be specified' }).end()
  } else {
    const person = new Person({
      name: name,
      number: number,
    })
    person
      .save()
      .then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        response.status(201).json(person).end()
      })
      .catch((err) => next(err))
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const payload = { number: request.body.number }
  const options = {
    new: true,
    runValidators: true,
  }
  Person.findByIdAndUpdate(id, payload, options).catch((err) => next(err))
})

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
