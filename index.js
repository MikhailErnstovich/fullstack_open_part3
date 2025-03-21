const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());

morgan.token("post-data", (req, res) =>
  req.method.toLowerCase() === "post" ? `body: ${JSON.stringify(req.body)}` : ""
);

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-data"
  )
);

app.use(express.static("dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: "5",
    name: "qwe",
    number: "39122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  if (id) {
    const person = persons.find((el) => el.id === id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  response.send(`<div>
    <div>Phonebook has info for ${persons.length} people<div>
    <div>${new Date(Date.now())}</div>
  </div>`);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  if (id) {
    const person = persons.find((el) => el.id === id);
    if (person) {
      persons = persons.filter((el) => el.id !== id);
      response.status(204).end();
    } else {
      response.status(404).end();
    }
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  if (!name) {
    response.status(400).send({ error: "name must be specified" }).end();
  } else if (!number) {
    response.status(400).send({ error: "number must be specified" }).end();
  } else {
    const duplicateName = Boolean(persons.find((el) => el.name === name));
    if (duplicateName) {
      response.status(400).send({ error: "name must be unique" }).end();
    } else {
      const id = `${Math.floor(Math.random() * 9007199254740991)}`;
      const person = { id, name, number };
      persons.push(person);
      response.status(201).json(person).end();
    }
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
