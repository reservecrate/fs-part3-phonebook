const express = require('express');
// const morgan = require('morgan');
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');
const app = express();

app.use(express.json());
app.use(bodyParser.json());
// app.use(morgan('tiny'));
morganBody(app);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
];

app.get('/', (req, res) => {
  res.send('<h1>The Gigachad</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const person = req.body;
  person.name = person.name.trim();
  person.number = person.number.trim();
  const personsNames = persons.map(person => person.name.trim().toLowerCase());
  if (!person.name || !person.number) {
    return res.status(400).json({ error: 'Name/phone number missing' });
  } else if (personsNames.includes(person.name.toLowerCase())) {
    return res.status(400).json({
      error: `The following person (${person.name}) already exists in the phonebook`
    });
  }
  person.id = persons.length + Math.floor(Math.random() * 9999);
  persons.push(person);
  res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const matchedPerson = persons.find(person => person.id === id);
  matchedPerson ? res.json(matchedPerson) : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

app.get('/info', (req, res) => {
  const formattedInfo = `<h3>The phonebook contains information for ${
    persons.length
  } people</h3><h3>${new Date()}</h3>`;
  res.send(formattedInfo);
});

const PORT = 4200;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
